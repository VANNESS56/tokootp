import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { data, error };
  },

  async signIn(identifier: string, password: string) {
    let email = identifier;

    // Check if identifier is NOT an email (doesn't contain @)
    if (!identifier.includes("@")) {
      const { data: foundEmail, error: rpcError } = await supabase.rpc('get_user_email_by_username', {
        username_input: identifier
      });

      if (rpcError || !foundEmail) {
        return { data: null, error: new Error("Username tidak ditemukan.") };
      }
      email = foundEmail;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Profile & Balance Management
export const Profiles = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  async updateBalance(userId: string, newBalance: number) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", userId);
    return { data, error };
  },

  async ensureProfile(userId: string, fullName?: string) {
    const { data: profile } = await this.get(userId);
    if (!profile) {
      // If fullName not provided, try to get it from auth metadata
      let finalName = fullName;
      if (!finalName) {
        const { user } = await auth.getUser();
        finalName = user?.user_metadata?.full_name || "User";
      }

      const { data, error } = await supabase.from("profiles").insert([
        { id: userId, full_name: finalName, balance: 0, role: "member" }
      ]);
      return { data, error };
    }
    return { data: profile, error: null };
  },

  async getAll() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });
    return { data, error };
  },

  async updateRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);
    return { data, error };
  }
};

// Global System Settings
export const Settings = {
  async get() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    return { data, error };
  },

  async update(markupPercent: number, markupFlat: number, maintenanceMode?: boolean) {
    const { data, error } = await supabase
      .from("settings")
      .upsert({ 
        id: 1, 
        markup_percent: markupPercent, 
        markup_flat: markupFlat,
        maintenance_mode: maintenanceMode
      });
    return { data, error };
  }
};

// Order Persistence
export const Orders = {
  async getAllForUser(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  async create(orderData: any) {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData]);
    return { data, error };
  },

  async updateStatus(orderId: string, status: string, otp?: string) {
    const updateData: any = { status };
    if (otp) updateData.otp = otp;
    
    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId);
    return { data, error };
  }
};
