import { supabase } from '../lib/supabase';

function throwOnError(error) {
  if (error) throw new Error(error.message || 'The request could not be completed.');
}

const publicProfileColumns = 'id,user_id,slug,name,display_name,title,category,bio,location,province,town,latitude,longitude,image_url,avatar_url,cover_url,skills,services,portfolio_media,social_links,status,availability,price,rating,reviews,created_at,updated_at';

function normalizeProfile(profile) {
  if (!profile) return null;

  const legalName = profile.legal_name || profile.name || profile.display_name || 'Unnamed professional';
  const artistName = profile.artist_name || '';
  const organisationName = profile.organisation_name || '';
  const preferredName = profile.display_preference === 'artist_name' ? artistName
    : profile.display_preference === 'organisation_name' ? organisationName
      : profile.display_preference === 'both' ? [legalName, artistName || organisationName].filter(Boolean).join(' · ')
        : legalName;

  return {
    ...profile,
    name: preferredName,
    legal_name: legalName,
    display_name: preferredName,
    image: profile.image || profile.image_url || '',
    image_url: profile.image_url || profile.image || '',
    cover: profile.cover || profile.cover_url || '',
    skills: profile.skills || [],
    services: profile.services || [],
    socialLinks: profile.social_links || profile.socialLinks || {},
    avatar_url: profile.avatar_url || profile.image_url || '',
  };
}

export async function getProfiles() {
  const { data, error } = await supabase.from('profiles').select(publicProfileColumns).eq('status', 'ACTIVE');
  throwOnError(error);
  return { profiles: (data || []).map(normalizeProfile) };
}

export async function getProfile(slug) {
  const { data, error } = await supabase.from('profiles').select(publicProfileColumns).eq('slug', slug).maybeSingle();
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

export async function uploadAvatar(userId, file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${userId}/avatar-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  throwOnError(uploadError);
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMedia(userId, file, folder = 'portfolio') {
  const path = `${userId}/${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, '-')}`;
  const { error } = await supabase.storage.from('creator-media').upload(path, file, { cacheControl: '3600', upsert: false });
  throwOnError(error);
  return supabase.storage.from('creator-media').getPublicUrl(path).data.publicUrl;
}

export async function createMarketplaceProduct(product) {
  const { data, error } = await supabase.from('marketplace_products').insert(product).select().single();
  throwOnError(error);
  return { product: data };
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
