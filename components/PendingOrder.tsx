"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, X, ChevronRight, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RumahOTP } from "@/lib/api";
import { toast } from "react-hot-toast";
import { auth, Profiles, Orders } from "@/lib/supabase";

export const PendingOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  // Load from localStorage on mount
  // Request permission for notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch from DB instead of localStorage on mount
  const fetchMyOrders = async () => {
    const { user } = await auth.getUser();
    if (user) {
      const { data, error } = await Orders.getAllForUser(user.id);
      if (!error && data) setPendingOrders(data);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Show browser notification
  const sendBrowserNotification = (title: string, body: string) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/favicon.ico", 
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body, icon: "/favicon.ico" });
          }
        });
      }
    }
  };

  // Polling for orders
  useEffect(() => {
    const activeOrders = pendingOrders.filter(o => o.status === "waiting");
    if (activeOrders.length === 0) return;

    const interval = setInterval(async () => {
      const updatedOrders = [...pendingOrders];
      let hasChanges = false;

      for (let i = 0; i < updatedOrders.length; i++) {
        const order = updatedOrders[i];
        if (order.status === "waiting") {
          try {
            const res = await RumahOTP.getOrderStatus(order.order_id);
            if (res.success && res.data) {
              const newStatus = res.data.status; 
              const newOtp = res.data.otp;
              
              if (newStatus !== order.status || newOtp !== order.otp) {
                const isFirstOtp = !order.otp && newOtp;
                
                updatedOrders[i] = { 
                  ...order, 
                  status: newStatus === "success" || newOtp ? "received" : newStatus,
                  otp: newOtp 
                };
                hasChanges = true;

                // Sync status to DB
                await Orders.updateStatus(order.order_id, updatedOrders[i].status, newOtp);
                
                if (isFirstOtp) {
                  toast.success(`OTP Diterima: ${newOtp}`, { duration: 10000 });
                  sendBrowserNotification("OTP Diterima! 🔑", `Layanan ${order.service}: ${newOtp}`);
                }
              }
            }
          } catch (e) {
            console.error(`Status check failed for ${order.order_id}`, e);
          }
        }
      }

      if (hasChanges) {
        setPendingOrders(updatedOrders);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [pendingOrders]);

  const fetchServices = async () => {
    setIsDataLoading(true);
    const res = await RumahOTP.getServices();
    if (res.success) setServices(res.data);
    else toast.error("Gagal mengambil layanan.");
    setIsDataLoading(false);
  };

  const fetchCountries = async (code: string) => {
    setIsDataLoading(true);
    const res = await RumahOTP.getCountries(code);
    if (res.success && res.data) setCountries(res.data);
    else toast.error(res.message || "Gagal mengambil negara.");
    setIsDataLoading(false);
  };

  const handleServiceSelect = (s: any) => {
    setSelectedService(s);
    const serviceId = s.service_id || s.id || s.service_code;
    fetchCountries(String(serviceId));
  };

  const handleOrder = async (country: any, provider: any) => {
    setIsLoading(true);
    try {
      const { user } = await auth.getUser();
      if (!user) throw new Error("Silakan login terlebih dahulu.");
      
      const { data: profile } = await Profiles.get(user.id);
      if (!profile) throw new Error("Profil tidak ditemukan.");
      
      const priceToPay = provider.price;
      if (profile.balance < priceToPay) {
        toast.error(`Saldo tidak cukup. Harga: Rp${priceToPay.toLocaleString("id-ID")}`);
        setIsLoading(false);
        return;
      }

      const res = await RumahOTP.orderNumber(country.number_id, provider.provider_id, 1);
      
      if (res.success) {
        const newBalance = profile.balance - priceToPay;
        await Profiles.updateBalance(user.id, newBalance);
        
        toast.success(`Nomor didapat! Saldo terpotong Rp${priceToPay.toLocaleString("id-ID")}`);
        
        const newOrder = {
          user_id: user.id,
          order_id: res.data.order_id,
          service_name: selectedService.service_name,
          phone_number: res.data.phone_number,
          amount: priceToPay,
          status: "waiting",
          otp: null
        };

        // Save to DB
        await Orders.create(newOrder);

        setPendingOrders(prev => [newOrder, ...prev]);
        setIsModalOpen(false);
        setSelectedService(null);
        setSelectedCountry(null);
      } else {
        toast.error(res.message || "Gagal memesan.");
      }
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetStatus = async (orderId: string, status: "cancel" | "done") => {
    setIsDataLoading(true);
    try {
      const res = await RumahOTP.setOrderStatus(orderId, status);
      console.log("Cancel Response:", res);
      
      if (res.success) {
        // Handle Refund if Cancelled
        if (status === "cancel") {
          const order = pendingOrders.find(o => String(o.order_id) === String(orderId));
          console.log("Order found for refund:", order);
          
          if (order && order.amount) {
            const { user } = await auth.getUser();
            if (user) {
              const { data: profile, error: profileError } = await Profiles.get(user.id);
              if (profile && !profileError) {
                const refundAmount = Number(order.amount);
                const currentBalance = Number(profile.balance);
                const newBalance = currentBalance + refundAmount;
                
                console.log(`Processing Refund: ${currentBalance} + ${refundAmount} = ${newBalance}`);
                
                const { error: updateError } = await Profiles.updateBalance(user.id, newBalance);
                if (updateError) {
                  console.error("Refund failed in DB:", updateError);
                  toast.error("Refund gagal disimpan ke database.");
                } else {
                  // Trigger balance refresh
                  window.dispatchEvent(new Event("refreshBalance"));
                  toast.success(`Berhasil! Saldo Rp${refundAmount.toLocaleString("id-ID")} dikembalikan.`, { icon: "💰", duration: 5000 });
                }
              } else {
                console.error("Profile not found for refund:", profileError);
              }
            }
          } else {
             console.warn("Order amount not found or zero:", order);
             toast.error("Data harga pesanan tidak ditemukan, hubungi admin.");
          }
        }

        const msg = status === "cancel" ? "Pesanan dibatalkan" : "Pesanan selesai";
        toast.success(msg);

        // Sync Status to DB
        const dbStatus = status === "cancel" ? "canceled" : "received";
        await Orders.updateStatus(orderId, dbStatus);

        setPendingOrders(prev => 
          prev.map(o => String(o.order_id) === String(orderId) ? { ...o, status: dbStatus } : o)
        );
      } else {
        toast.error(res.message || "Gagal update status.");
      }
    } catch (e: any) {
      console.error("handleSetStatus Exception:", e);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="bg-white rounded-[24px] shadow-sm border border-[#eef2f6] p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[18px] font-black text-[#1a2332] tracking-tight">Pesanan Pending</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchMyOrders(); toast.success("Data diperbarui"); }}
              className="w-10 h-10 rounded-xl border border-[#eef2f6] flex items-center justify-center text-[#3478f6] hover:bg-slate-50 active:scale-95 transition-all"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => { fetchServices(); setIsModalOpen(true); }}
              className="px-4 h-10 rounded-xl bg-[#3478f6] text-white flex items-center justify-center text-[12px] font-bold active:scale-95 transition-all shadow-lg shadow-blue-100"
            >
              + Buat Pesanan
            </button>
          </div>
        </div>

        {pendingOrders.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#eef2f6]">
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider w-[50px]">SRV</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider">LAYANAN</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider">NOMOR</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider text-right">HARGA</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider text-center">STATUS</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider text-center">CODE</th>
                    <th className="pb-4 text-[10px] font-bold text-[#b0bec5] uppercase tracking-wider text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2f6]">
                  {pendingOrders.map((order, idx) => (
                    <tr key={order.order_id || idx} className="group transition-colors active:bg-slate-50">
                      <td className="py-4 text-[12px] font-medium text-[#b0bec5]">v2.0</td>
                      <td className="py-4 whitespace-nowrap">
                        <span className="text-[14px] font-bold text-[#1a2332]">{order.service_name}</span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-extrabold text-[#1a2332] font-mono tracking-tight">{order.phone_number}</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(order.phone_number); toast.success("Nomor disalin!"); }}
                              className="w-7 h-7 flex items-center justify-center bg-[#f8fafc] rounded-md text-[#b0bec5] hover:text-[#3478f6]"
                            >
                               <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                        </div>
                      </td>
                      <td className="py-4 text-[13px] font-extrabold text-[#1a2332] text-right whitespace-nowrap">
                        Rp{Number(order.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#fffdf5] text-[#ffb300] px-2.5 py-1 rounded-full border border-[#fff4d6]">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span className="text-[10px] font-black uppercase tracking-wider">
                              {(order.created_at ? new Date(order.created_at) : new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                      </td>
                      <td className="py-4 text-center whitespace-nowrap">
                        <span className={`text-[12px] font-extrabold ${order.otp ? "text-[#22c55e] text-[15px] font-black tracking-widest" : "text-[#ffb300]"}`}>
                            {order.otp || (order.status === "waiting" ? "Menunggu" : order.status)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                            {order.otp && (
                              <button 
                                onClick={() => { navigator.clipboard.writeText(order.otp || ""); toast.success("OTP disalin!"); }}
                                className="w-8 h-8 rounded-lg border border-[#e2e8f0] text-[#22c55e] flex items-center justify-center bg-white shadow-sm"
                              >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                            )}
                            {order.status === "waiting" && (
                              <button 
                                onClick={() => handleSetStatus(order.order_id, "cancel")}
                                className="w-8 h-8 rounded-lg border border-[#e2e8f0] text-[#ef4444] flex items-center justify-center bg-white shadow-sm"
                              >
                                <X size={14} strokeWidth={3} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : (
          <div className="mt-10 mb-8 flex flex-col items-center text-center">
            <p className="text-[12px] font-bold text-[#8696a7] mb-4">Tidak ada pesanan aktif</p>
            <button
              onClick={() => { fetchServices(); setIsModalOpen(true); }}
              className="bg-[#3478f6] text-white px-6 py-2.5 rounded-xl font-bold text-[12px] active:scale-95 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              + Buat Pesanan
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (!isLoading) { setIsModalOpen(false); setSelectedService(null); setSelectedCountry(null); }}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 pointer-events-auto" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[32px] max-w-[480px] mx-auto pointer-events-auto shadow-2xl">
              <div className="w-12 h-1.5 bg-[#eef2f6] rounded-full mx-auto mt-4 mb-2" />
              <div className="px-6 pb-12 max-h-[85vh] overflow-y-auto">
                
                {isDataLoading ? (
                  <div className="flex flex-col items-center py-20 text-[#8696a7]">
                    <Loader2 size={36} className="animate-spin mb-3" />
                    <span className="text-[11px] font-bold">Memuat data...</span>
                  </div>
                ) : !selectedService ? (
                  <>
                    <h4 className="fs-6 fw-semibold text-solid-theme mb-6 text-center">Pilih Layanan</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {services.map((s: any) => (
                        <button key={s.service_id || s.service_code || s.id} onClick={() => handleServiceSelect(s)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#f8fafc] border border-transparent hover:border-[#3478f6]/20 hover:bg-white transition-all active:scale-95 group">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                            <img src={s.service_img} alt={s.service_name} className="w-8 h-8 object-contain" />
                          </div>
                          <span className="text-[10px] fw-semibold text-solid-theme text-center leading-tight">{s.service_name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-left mb-6">
                      <h4 className="text-[20px] fw-semibold text-solid-theme leading-none mb-1">Beli Nomor Virtual</h4>
                      <p className="text-[13px] text-[#8696a7] font-medium transition-all">Pilih sebuah aplikasi dan negaranya</p>
                    </div>

                    <div className="card p-4 flex items-center justify-between mb-4 border border-[#eef2f6]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#f8fafc] flex items-center justify-center p-2.5">
                           <img src={selectedService.service_img} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="fs-6 fw-semibold text-solid-theme leading-none mb-1">{selectedService.service_name}</p>
                          <p className="text-[12px] text-[#8696a7] font-medium">Aplikasi yang dipilih</p>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedService(null); setSelectedCountry(null); }} className="text-[#8696a7]">
                        <ChevronRight size={18} className="rotate-180" />
                      </button>
                    </div>

                    <div className="relative mb-4">
                       <input 
                        type="text" 
                        placeholder="Cari nama negara..." 
                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-[#eef2f6] text-[14px] font-medium outline-none focus:border-[#3478f6]/30 transition-all"
                       />
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbd5e1]">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </div>
                    </div>

                    <div className="flex p-1 bg-[#f1f5f9] rounded-2xl mb-6">
                       <button className="flex-1 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center gap-2 text-[13px] font-bold text-[#3478f6]">
                          Rate
                       </button>
                       <button className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-[#8696a7]">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Harga
                       </button>
                    </div>

                    <div className="space-y-4">
                      {countries.map((c: any) => (
                        <div key={c.number_id} className="border-b border-[#eef2f6] pb-2 last:border-0 overflow-hidden">
                           <div className="flex items-center justify-between py-2 group cursor-pointer" onClick={() => setSelectedCountry(selectedCountry?.number_id === c.number_id ? null : c)}>
                              <div className="flex items-center gap-3">
                                 <img src={c.img} className="w-8 h-5 object-cover rounded shadow-sm" alt="" />
                                 <span className="text-[15px] fw-semibold text-solid-theme">{c.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                 <span className="text-[10px] font-bold text-[#8696a7] bg-[#f1f5f9] px-2 py-0.5 rounded-md uppercase">+{c.prefix}</span>
                                 <span className="text-[10px] font-bold text-[#8696a7] bg-[#f1f5f9] px-2 py-0.5 rounded-md uppercase">{c.iso}</span>
                                 <span className="text-[11px] font-bold text-[#8696a7] ml-1">Mulai {c.pricelist?.[0]?.price_format}</span>
                                 <ChevronRight size={14} className={`text-[#cbd5e1] transition-transform ${selectedCountry?.number_id === c.number_id ? "rotate-90" : ""}`} />
                              </div>
                           </div>

                           <AnimatePresence>
                              {selectedCountry?.number_id === c.number_id && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 pb-4 space-y-2">
                                    {c.pricelist.map((p: any, pIdx: number) => {
                                       const profit = Math.round(((p.price - p.price_original) / p.price_original) * 100);
                                       return (
                                          <div key={p.provider_id || pIdx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8fafc] transition-colors">
                                             <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-[#22c55e] bg-green-50 px-2 py-0.5 rounded-md uppercase">Server {p.version || "2.0"}</span>
                                                <span className="text-[10px] font-bold text-[#8696a7] bg-[#f1f5f9] px-2 py-0.5 rounded-md">ID: {p.provider_id}</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                {profit > 0 && (
                                                   <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">{profit}%</span>
                                                )}
                                                <span className="text-[14px] font-black text-solid-theme">{p.price_format}</span>
                                                <button 
                                                   onClick={(e) => { e.stopPropagation(); handleOrder(c, p); }}
                                                   disabled={isLoading}
                                                   className="bg-white border-2 border-[#eef2f6] hover:border-[#3478f6] hover:text-[#3478f6] text-solid-theme font-black text-[11px] px-3 py-1.5 rounded-xl transition-all active:scale-90"
                                                >
                                                   {isLoading ? "..." : "Order"}
                                                </button>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
