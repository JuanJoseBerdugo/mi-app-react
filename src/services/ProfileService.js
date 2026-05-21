import { supabase } from '../lib/supabase';

const PROFILE_TABLE = 'pokemon_profiles';
const AVATAR_BUCKET = 'avatars';

function getDisplayNameFallback(user) {
  return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Trader';
}

function normalizeProfile(user, profile = null) {
  return {
    id: user.id,
    email: user.email,
    displayName: profile?.display_name || getDisplayNameFallback(user),
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    avatarPath: profile?.avatar_path || user.user_metadata?.avatar_path || '',
    favoriteCrypto: profile?.favorite_crypto || user.user_metadata?.favorite_crypto || 'BTC',
    country: profile?.country || user.user_metadata?.country || '',
    baseCurrency: profile?.base_currency || user.user_metadata?.base_currency || 'USD',
  };
}

function getSafeFileName(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
  const baseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 36);

  return `${baseName || 'avatar'}.${extension}`;
}

export async function getPokemonProfile(user) {
  const fallbackProfile = normalizeProfile(user);

  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select('id, email, display_name, avatar_path, avatar_url, favorite_crypto, country, base_currency')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    return fallbackProfile;
  }

  if (data) {
    return normalizeProfile(user, data);
  }

  const { data: createdProfile, error: createError } = await supabase
    .from(PROFILE_TABLE)
    .upsert(
      {
        id: user.id,
        email: user.email,
        display_name: fallbackProfile.displayName,
        favorite_crypto: fallbackProfile.favoriteCrypto,
        country: fallbackProfile.country,
        base_currency: fallbackProfile.baseCurrency,
      },
      { onConflict: 'id' }
    )
    .select('id, email, display_name, avatar_path, avatar_url, favorite_crypto, country, base_currency')
    .single();

  if (createError) {
    return fallbackProfile;
  }

  return normalizeProfile(user, createdProfile);
}

export async function savePokemonProfile(currentUser, profileInput) {
  const payload = {
    id: currentUser.id,
    email: currentUser.email,
    display_name: profileInput.displayName,
    favorite_crypto: profileInput.favoriteCrypto,
    country: profileInput.country,
    base_currency: profileInput.baseCurrency,
    updated_at: new Date().toISOString(),
  };

  if (profileInput.avatarPath !== undefined) {
    payload.avatar_path = profileInput.avatarPath;
  }

  if (profileInput.avatarUrl !== undefined) {
    payload.avatar_url = profileInput.avatarUrl;
  }

  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .upsert(payload, { onConflict: 'id' })
    .select('id, email, display_name, avatar_path, avatar_url, favorite_crypto, country, base_currency')
    .single();

  if (error) {
    throw error;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      avatar_path: data.avatar_path,
      favorite_crypto: data.favorite_crypto,
      country: data.country,
      base_currency: data.base_currency,
    },
  });

  if (metadataError) {
    throw metadataError;
  }

  return normalizeProfile(currentUser, data);
}

export async function uploadPokemonAvatar(userId, file) {
  const path = `profiles/${userId}/${Date.now()}-${getSafeFileName(file)}`;

  const { data, error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(data.path);

  return {
    avatarPath: data.path,
    avatarUrl: publicUrl,
  };
}
