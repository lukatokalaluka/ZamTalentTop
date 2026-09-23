import { supabase } from '../lib/supabase';

function throwOnError(error) {
  if (error) throw new Error(error.message || 'The request could not be completed.');
}

function normalizeProfile(profile) {
  if (!profile) return null;

  return {
    ...profile,
    name: profile.name || profile.display_name || 'Unnamed professional',
    display_name: profile.display_name || profile.name || 'Unnamed professional',
    image: profile.image || profile.image_url || '',
    image_url: profile.image_url || profile.image || '',
    cover: profile.cover || profile.cover_url || '',
    skills: profile.skills || [],
    services: profile.services || [],
    socialLinks: profile.social_links || profile.socialLinks || {},
  };
}

export async function getProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').eq('status', 'ACTIVE');
  throwOnError(error);
  return { profiles: (data || []).map(normalizeProfile) };
}

export async function getProfile(slug) {
  const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
  throwOnError(error);
  if (!data) throw new Error('Profile was not found.');
  return { profile: normalizeProfile(data) };
}

export async function getProfileByUserId(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  throwOnError(error);
  return { profile: normalizeProfile(data) };
}

export async function saveProfile(userId, profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' })
    .select()
    .single();
  throwOnError(error);
  return { profile: normalizeProfile(data) };
}

export async function getUserBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  throwOnError(error);
  return { bookings: data || [] };
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
