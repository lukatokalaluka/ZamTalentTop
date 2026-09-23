import { supabase } from '../lib/supabase';

function throwOnError(error) {
  if (error) throw new Error(error.message || 'The request could not be completed.');
}

export async function getProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').eq('status', 'ACTIVE');
  throwOnError(error);
  return { profiles: data || [] };
}

export async function getProfile(slug) {
  const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
  throwOnError(error);
  if (!data) throw new Error('Profile was not found.');
  return { profile: data };
}

export async function getMarketplaceProducts() {
  const { data, error } = await supabase.from('marketplace_products').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false });
  throwOnError(error);
  return { products: data || [] };
}

export async function createBooking(booking) {
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  throwOnError(error);
  return { booking: data };
}
