/**
 * TOKO OTP API Utilities - Version 2 (Optimized with Server Proxy)
 */


/**
 * Utility for RumahOTP calls (now proxied via /api/rumahotp)
 */
async function fetchRumahOTP(endpoint: string, params: Record<string, string | number> = {}, version: "v1" | "v2" = "v2") {
  const url = new URL(`${window.location.origin}/api/rumahotp`);
  
  // Add path and version to internal proxy
  url.searchParams.append("path", endpoint);
  url.searchParams.append("v", version);
  
  // Add other params
  Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    return await response.json();
  } catch (error) {
    console.error(`RumahOTP Proxy Call Error:`, error);
    return { success: false, data: null };
  }
}

/**
 * Markup Configuration (Price for User)
 */
const MARKUP_PERCENT = 10; // 10% markup
const MARKUP_FLAT = 1000;  // static markup Rp 1.000

function applyMarkup(price: number) {
  // Formula: (Base + Flat) + Percent
  const withFlat = price + MARKUP_FLAT;
  const withPercent = withFlat + (withFlat * (MARKUP_PERCENT / 100));
  // Round up to nearest 100
  return Math.ceil(withPercent / 100) * 100;
}

export const RumahOTP = {
  // --- Services & Countries ---
  
  async getServices() {
    return await fetchRumahOTP("services");
  },

  async getCountries(serviceId: string) {
    const res = await fetchRumahOTP("countries", { service_id: serviceId });
    if (res.success && res.data) {
      // Map prices with markup for the user
      res.data = res.data.map((country: any) => ({
        ...country,
        pricelist: country.pricelist.map((p: any) => {
          const markedPrice = applyMarkup(p.price);
          return {
            ...p,
            price_original: p.price, // keep for internal use
            price: markedPrice,
            price_format: `Rp${markedPrice.toLocaleString("id-ID")}`
          };
        })
      }));
    }
    return res;
  },

  async getOperators(countryName: string, providerId: string) {
    return await fetchRumahOTP("operators", { country: countryName, provider_id: providerId });
  },

  // --- Orders ---

  async orderNumber(numberId: number, providerId: number, operatorId: number) {
    return await fetchRumahOTP("orders", { 
      number_id: numberId, 
      provider_id: providerId, 
      operator_id: operatorId 
    });
  },

  async getOrderStatus(orderId: string) {
    return await fetchRumahOTP("orders/get_status", { order_id: orderId }, "v1");
  },

  async setOrderStatus(orderId: string, status: "cancel" | "done" | "resend") {
    return await fetchRumahOTP("orders/set_status", { order_id: orderId, status }, "v1");
  },

  // --- User & Deposit ---

  async getBalance() {
    return await fetchRumahOTP("user/balance", {}, "v1");
  },

  async createDeposit(amount: number, paymentId: string = "qris") {
    return await fetchRumahOTP("deposit/create", { amount, payment_id: paymentId });
  },

  async getDepositStatus(depositId: string) {
    return await fetchRumahOTP("deposit/get_status", { deposit_id: depositId });
  },

  async cancelDeposit(depositId: string) {
    return await fetchRumahOTP("deposit/cancel", { deposit_id: depositId }, "v1");
  }
};
