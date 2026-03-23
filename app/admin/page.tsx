"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Database, 
  CreditCard, 
  TrendingUp, 
  LogOut, 
  Search, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Save, 
  Plus,
  RefreshCw,
  Bell,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  Loader2,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, Profiles, Settings, supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BootstrapAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // System Settings
  const [markupPercent, setMarkupPercent] = useState(15);
  const [markupFlat, setMarkupFlat] = useState(500);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState({
     totalUsers: 0,
     totalBalance: 0,
     activeOrders: 124
  });

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [topupAmount, setTopupAmount] = useState("0");

  const handleUpdateBalance = async () => {
     if (!selectedMember) return;
     const newBal = (selectedMember.balance || 0) + Number(topupAmount);
     const { error } = await Profiles.updateBalance(selectedMember.id, newBal);
     if (!error) {
        toast.success(`Berhasil tambah Rp${Number(topupAmount).toLocaleString("id-ID")}`);
        setShowEditModal(false);
        setTopupAmount("0");
        fetchData();
     } else {
        toast.error("Gagal update saldo.");
     }
  };

  const handleDeleteUser = async () => {
    if (!selectedMember) return;
    const { error } = await supabase.from("profiles").delete().eq("id", selectedMember.id);
    if (!error) {
       toast.success("User telah dihapus.");
       setShowDeleteModal(false);
       fetchData();
    } else {
       toast.error("Gagal menghapus user.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { user } = await auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile, error: profileErr } = await Profiles.get(user.id);
      
      const emailLower = user.email?.toLowerCase();
      const roleLower = String(profile?.role || "").toLowerCase();

      console.log("[ADMIN_SEC_DEBUG]", { 
         email: emailLower, 
         role: roleLower,
         error: profileErr?.message 
      });

      const isAuthorized = 
         emailLower === "admin@vanness.store" || 
         emailLower === "vanness.id@gmail.com" || 
         emailLower === "vannessvanness56@gmail.com" || 
         roleLower === "admin" || 
         roleLower === "superuser";

      if (!isAuthorized) {
        toast.error(`Akses Ditolak. Role saat ini: ${roleLower || "tidak ada"}`);
        router.push("/");
        return;
      }

      const { data: allUsers, error: usersError } = await Profiles.getAll();
      if (usersError) {
         console.error("Profiles error:", usersError);
         toast.error(`Database error: ${usersError.message}. Pastikan status RLS di Supabase sudah benar.`);
      }
      if (allUsers) {
        setMembers(allUsers);
        setStats(prev => ({
           ...prev,
           totalUsers: allUsers.length,
           totalBalance: allUsers.reduce((sum, u) => sum + (u.balance || 0), 0)
        }));
      }

      const { data: sys, error: sysError } = await Settings.get();
      if (!sysError && sys) {
         setMarkupPercent(Number(sys.markup_percent));
         setMarkupFlat(Number(sys.markup_flat));
         setMaintenanceMode(Boolean(sys.maintenance_mode));
      } else {
         console.warn("Using default settings (ID 1 missing or table not created yet).");
      }
    } catch (e: any) {
       console.error("Admin init error:", e);
       toast.error("Terjadi kesalahan sistem saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await Settings.update(markupPercent, markupFlat, maintenanceMode);
    if (!error) toast.success("Settings saved successfully.");
    setIsSaving(false);
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "members", label: "Master Users", icon: Users },
    { id: "settings", label: "Profit Settings", icon: TrendingUp },
    { id: "integrations", label: "API Integrations", icon: Database },
  ];

  if (loading && members.length === 0) return (
     <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
     </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex overflow-hidden font-sans">
      
      {/* --- BOOTSTRAP SIDEBAR --- */}
      <aside className={`bg-[#4e73df] flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} flex flex-col z-50`}>
        <div className="p-4 flex items-center justify-center gap-2 border-b border-white/10 mb-4 h-16">
           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4e73df]">
              <SettingsIcon size={20} />
           </div>
           {isSidebarOpen && <span className="text-white font-black tracking-widest text-sm italic">V-ADMIN</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
           {isSidebarOpen && <p className="text-[10px] font-black text-white/40 uppercase px-3 py-2">Navigasi Utama</p>}
           {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === item.id ? "bg-white text-[#4e73df] shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                 <item.icon size={18} />
                 {isSidebarOpen && <span>{item.label}</span>}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/10">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center text-white/50 hover:text-white py-2">
              <ChevronDown className={isSidebarOpen ? "rotate-90" : "-rotate-90"} size={20} />
           </button>
        </div>
      </aside>

      {/* --- MAIN WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
         
         {/* TOP NAVBAR */}
         <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 lg:hidden"><Menu size={20} /></button>
               <div className="relative hidden md:block">
                  <input type="text" placeholder="Search for..." className="bg-[#f8f9fc] border-none text-xs px-4 py-2.5 rounded-l-lg w-64 focus:ring-0" />
                  <button className="bg-[#4e73df] text-white px-3 py-2.5 rounded-r-lg"><Search size={14} /></button>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <Bell size={18} className="cursor-pointer hover:text-slate-500" />
                  <MessageSquare size={18} className="cursor-pointer hover:text-slate-500" />
               </div>
               <div className="h-8 w-px bg-slate-100 mx-2" />
               <div className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-slate-500 hidden sm:block">Vanness Store</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
               </div>
            </div>
         </header>

         {/* CONTENT BODY */}
         <main className="p-6">
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl text-[#5a5c69] font-normal capitalize">Dashboard Overview</h1>
               <button onClick={fetchData} disabled={loading} className="bg-[#4e73df] text-white text-xs font-bold px-3 py-2 rounded shadow-sm hover:bg-[#2e59d9] transition-all flex items-center gap-2">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> {loading ? "Memuat..." : "Refresh Data"}
               </button>
            </div>

            {activeTab === "overview" && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                     {[
                        { label: "REGISTERED USERS", val: stats.totalUsers, color: "border-l-[#4e73df] text-[#4e73df]", icon: Users },
                        { label: "CIRCULATING BALANCE", val: "Rp " + stats.totalBalance.toLocaleString(), color: "border-l-[#1cc88a] text-[#1cc88a]", icon: CreditCard },
                        { label: "SUCCESS RATE (EST)", val: "98%", color: "border-l-[#36b9cc] text-[#36b9cc]", icon: TrendingUp },
                        { label: "PENDING LOGS", val: "18", color: "border-l-[#f6c23e] text-[#f6c23e]", icon: Activity },
                     ].map((card, i) => (
                        <div key={i} className={`bg-white p-5 rounded border border-slate-200 border-l-4 ${card.color.split(" ")[0]} shadow-sm flex items-center justify-between`}>
                           <div>
                              <p className={`text-[10px] font-black uppercase ${card.color.split(" ")[1]} mb-1`}>{card.label}</p>
                              <p className="text-xl font-bold text-[#5a5c69]">{card.val}</p>
                           </div>
                           <card.icon size={28} className="text-slate-200" />
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <div className="lg:col-span-8 bg-white border border-slate-200 rounded shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                           <h6 className="m-0 font-bold text-[#4e73df] text-sm">Integrasi RumahOTP Status</h6>
                           <MoreHorizontal size={16} className="text-slate-300" />
                        </div>
                        <div className="p-5">
                           <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-xs mb-4">
                              Koneksi dengan RumahOTP berjalan normal. Margin profit aktif.
                           </div>
                           <div className="space-y-4">
                              <p className="text-sm text-slate-600">Gunakan panel navigasi di sebelah kiri untuk mengelola data anggota atau mengubah harga jual nomor virtual ke pelanggan.</p>
                              <div className="flex gap-2">
                                 <button onClick={() => setActiveTab("settings")} className="bg-[#4e73df] text-white text-xs px-4 py-2 rounded font-bold">Set Profit Margin</button>
                                 <button onClick={() => setActiveTab("members")} className="bg-[#1cc88a] text-white text-xs px-4 py-2 rounded font-bold">Lihat Semua User</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 bg-white border border-slate-200 rounded shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                           <h6 className="m-0 font-bold text-[#4e73df] text-sm">System Stats</h6>
                        </div>
                        <div className="p-5 space-y-4 text-xs font-bold text-slate-500 uppercase">
                           <div>
                              <div className="flex items-center justify-between mb-1"><span>Server Uptime</span><span>99%</span></div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[99%] h-full bg-[#e74a3b]" /></div>
                           </div>
                           <div>
                              <div className="flex items-center justify-between mb-1"><span>Database Usage</span><span>42%</span></div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[42%] h-full bg-[#f6c23e]" /></div>
                           </div>
                           <div>
                              <div className="flex items-center justify-between mb-1"><span>API Rate Limit</span><span>15%</span></div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[15%] h-full bg-[#1cc88a]" /></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}

            {activeTab === "members" && (
               <div className="bg-white border border-slate-200 rounded shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                     <h6 className="m-0 font-bold text-[#4e73df] text-sm">Data User & Saldo</h6>
                     <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder="Cari user..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="bg-white border border-slate-200 pl-8 pr-4 py-1.5 rounded text-xs outline-none focus:border-[#4e73df]" 
                        />
                     </div>
                  </div>
                  <div className="overflow-x-auto p-4">
                     <table className="w-full text-left border-collapse border border-slate-100">
                        <thead className="bg-[#f8f9fc] text-[11px] font-bold text-[#5a5c69] uppercase hover:bg-slate-50">
                           <tr className="border-b border-slate-200">
                              <th className="px-4 py-3 border-r border-slate-200">ID</th>
                              <th className="px-4 py-3 border-r border-slate-200">Nama User</th>
                              <th className="px-4 py-3 border-r border-slate-200">Saldo (IDR)</th>
                              <th className="px-4 py-3 border-r border-slate-200">Role</th>
                              <th className="px-4 py-3">Aksi</th>
                           </tr>
                        </thead>
                        <tbody className="text-[13px] text-slate-600">
                           {members.filter(m => m.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((m, i) => (
                              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                 <td className="px-4 py-3 border-r border-slate-100 font-mono text-[11px]">{m.id.slice(0, 8)}</td>
                                 <td className="px-4 py-3 border-r border-slate-100 font-bold">{m.full_name}</td>
                                 <td className="px-4 py-3 border-r border-slate-100 font-bold text-[#1cc88a]">Rp{(m.balance || 0).toLocaleString()}</td>
                                 <td className="px-4 py-3 border-r border-slate-100">
                                    <span className={`px-2 py-0.5 rounded text-[10px] text-white font-bold ${m.role === 'admin' ? 'bg-[#e74a3b]' : 'bg-[#4e73df]'}`}>
                                       {m.role || 'member'}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 flex gap-1">
                                    <button 
                                       onClick={() => {
                                          setSelectedMember(m);
                                          setShowEditModal(true);
                                       }}
                                       title="Edit Saldo"
                                       className="bg-[#4e73df] text-white p-1.5 rounded hover:bg-[#2e59d9]"
                                    >
                                       <Edit size={12} />
                                    </button>
                                    <button 
                                       onClick={() => {
                                          setSelectedMember(m);
                                          setShowDeleteModal(true);
                                       }}
                                       title="Hapus User"
                                       className="bg-[#e74a3b] text-white p-1.5 rounded hover:bg-[#be2617]"
                                    >
                                       <Trash2 size={12} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === "settings" && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded shadow-sm">
                     <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h6 className="m-0 font-bold text-[#4e73df] text-sm">Profit Strategy Settings</h6>
                     </div>
                     <div className="p-8 space-y-6">
                        {/* Bootstrap Success Alert */}
                        <AnimatePresence>
                           {isSaving === false && members.length > 0 && !loading && (
                              <motion.div 
                                 initial={{ opacity: 0, height: 0 }} 
                                 animate={{ opacity: 1, height: 'auto' }}
                                 exit={{ opacity: 0, height: 0 }}
                                 className="bg-[#d1e7dd] border border-[#badbcc] text-[#0f5132] px-4 py-3 rounded text-xs mb-4 flex items-center justify-between"
                              >
                                 <div><strong>Success!</strong> Profil keuntungan baru telah berhasil diterapkan ke sistem.</div>
                                 <button className="font-bold opacity-50">&times;</button>
                              </motion.div>
                           )}
                        </AnimatePresence>

                        <div>
                           <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">Markup Global (%)</label>
                           <div className="flex items-center gap-2">
                              <input 
                                 type="number" 
                                 value={markupPercent}
                                 onChange={(e) => setMarkupPercent(Number(e.target.value))}
                                 className="w-full border border-slate-200 p-2.5 rounded text-sm focus:border-[#4e73df] outline-none" 
                              />
                              <span className="font-bold text-slate-400">%</span>
                           </div>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">Biaya Admin Flat (IDR)</label>
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-400">Rp</span>
                              <input 
                                 type="number" 
                                 value={markupFlat}
                                 onChange={(e) => setMarkupFlat(Number(e.target.value))}
                                 className="w-full border border-slate-200 p-2.5 rounded text-sm focus:border-[#4e73df] outline-none" 
                              />
                           </div>
                        </div>

                        {/* Maintenance Mode Toggle */}
                        <div className="pt-4 border-t border-slate-100">
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-xs font-bold text-slate-700 uppercase">MAINTENANCE MODE</p>
                                 <p className="text-[10px] text-slate-400 font-bold">Matikan seluruh akses order user</p>
                              </div>
                              <button 
                                 onClick={() => setMaintenanceMode(!maintenanceMode)}
                                 className={`w-12 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                              >
                                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                              </button>
                           </div>
                        </div>

                        <button 
                           onClick={handleSave}
                           disabled={isSaving}
                           className="w-full bg-[#4e73df] text-white font-bold py-3 rounded hover:bg-[#2e59d9] transition-all flex items-center justify-center gap-2"
                        >
                           {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save System Config
                        </button>
                     </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded shadow-sm">
                     <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h6 className="m-0 font-bold text-[#4e73df] text-sm">Pricing Simulation</h6>
                     </div>
                     <div className="p-8">
                        <table className="w-full text-sm">
                           <tbody className="divide-y divide-slate-100">
                              <tr className="py-2 flex justify-between">
                                 <td className="text-slate-500">Harga Server (Contoh)</td>
                                 <td className="font-bold">Rp1.000</td>
                              </tr>
                              <tr className="py-2 flex justify-between">
                                 <td className="text-slate-500">Markup Persentase ({markupPercent}%)</td>
                                 <td className="font-bold text-blue-600">+Rp{(1000 * markupPercent / 100).toLocaleString()}</td>
                              </tr>
                              <tr className="py-2 flex justify-between">
                                 <td className="text-slate-500">Fixed Admin Fee</td>
                                 <td className="font-bold text-blue-600">+Rp{markupFlat.toLocaleString()}</td>
                              </tr>
                              <tr className="py-4 border-t-2 border-slate-200 flex justify-between">
                                 <td className="font-black text-[#5a5c69] uppercase">Harga Jual User</td>
                                 <td className="text-xl font-black text-[#4e73df]">Rp{(1000 + (1000 * markupPercent / 100) + markupFlat).toLocaleString()}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === "integrations" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "RumahOTP v2.0", type: "Provider OTP", status: "Connected", ping: "24ms", color: "#4e73df", icon: RefreshCw },
                    { name: "Supabase Database", type: "Storage & Auth", status: "Active", ping: "16ms", color: "#1cc88a", icon: Database }
                  ].map((api, i) => (
                     <div key={i} className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                        <div className="p-5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                 <api.icon size={20} />
                              </div>
                              <div>
                                 <h6 className="m-0 font-bold text-[#5a5c69]">{api.name}</h6>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{api.type}</p>
                              </div>
                           </div>
                           <span className={`px-2 py-1 rounded text-[9px] font-black uppercase text-white ${api.status === 'Connected' || api.status === 'Active' ? 'bg-[#1cc88a]' : 'bg-[#e74a3b]'}`}>
                              {api.status}
                           </span>
                        </div>
                        <div className="px-5 pb-5 space-y-3">
                           <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                              <span>System Latency</span>
                              <span className="text-[#5a5c69]">{api.ping}</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#36b9cc] w-[85%]" />
                           </div>
                           <div className="pt-4 border-t border-slate-50 flex gap-2">
                              <button className="flex-1 bg-slate-50 text-[10px] font-black uppercase py-2 rounded border border-slate-100 text-slate-400 hover:bg-white hover:text-[#4e73df] transition-all">Test Ping</button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

         </main>
         
         <footer className="bg-white py-4 px-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Copyright &copy; TOKO OTP Store 2026</p>
         </footer>
      </div>

      {/* --- CUSTOM BOOTSTRAP MODALS --- */}
      
      {/* Backdrop */}
      <AnimatePresence>
         {(showEditModal || showDeleteModal) && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" 
            />
         )}
      </AnimatePresence>

      {/* Edit Balance Modal */}
      <AnimatePresence>
         {showEditModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden"
               >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                     <h6 className="m-0 font-bold text-slate-700">Update Saldo Member</h6>
                     <button onClick={() => setShowEditModal(false)}><X size={18} className="text-slate-400 hover:text-red-500" /></button>
                  </div>
                  <div className="p-5">
                     <p className="text-xs text-slate-500 mb-4">Anda akan menambah saldo ke akun <strong>{selectedMember?.full_name}</strong>.</p>
                     <div className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded text-[11px] font-bold flex justify-between">
                           <span className="text-slate-400">SALDO SAAT INI</span>
                           <span className="text-slate-700">Rp{(selectedMember?.balance || 0).toLocaleString()}</span>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">JUMLAH TOP UP (IDR)</label>
                           <input 
                              type="number"
                              value={topupAmount}
                              onChange={(e) => setTopupAmount(e.target.value)}
                              className="w-full border border-slate-200 p-2.5 rounded text-sm outline-none focus:border-[#4e73df]" 
                              placeholder="Masukkan nominal..."
                              autoFocus
                           />
                        </div>
                     </div>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                     <button onClick={() => setShowEditModal(false)} className="bg-slate-500 text-white text-xs font-bold px-4 py-2 rounded">Cancel</button>
                     <button onClick={handleUpdateBalance} className="bg-[#4e73df] text-white text-xs font-bold px-4 py-2 rounded">Simpan Perubahan</button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Delete User Modal */}
      <AnimatePresence>
         {showDeleteModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded shadow-2xl w-full max-w-sm overflow-hidden"
               >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                     <h6 className="m-0 font-bold text-red-600">Hapus Profile Member</h6>
                     <button onClick={() => setShowDeleteModal(false)}><X size={18} className="text-slate-400 hover:text-red-500" /></button>
                  </div>
                  <div className="p-5 text-center">
                     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} />
                     </div>
                     <p className="text-sm font-bold text-slate-700 mb-1">Konfirmasi Penghapusan</p>
                     <p className="text-xs text-slate-500">Apakah anda yakin ingin menghapus akun <strong>{selectedMember?.full_name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-center gap-2">
                     <button onClick={() => setShowDeleteModal(false)} className="bg-slate-500 text-white text-xs font-bold px-6 py-2 rounded">Batal</button>
                     <button onClick={handleDeleteUser} className="bg-[#e74a3b] text-white text-xs font-bold px-6 py-2 rounded">Hapus Permanen</button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}

function MoreHorizontal({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
