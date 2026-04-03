import { supabase } from '../lib/supabase';

export const authService = {
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async isAdmin() {
    try {
      const user = await this.getUser();
      if (!user) return false;
      
      // For now, we allow any authenticated user to access the admin area
      // To restrict access, you can add authorized emails here
      return true;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
