import { supabase } from '../lib/supabase';

const PROFILE_TABLE = 'pokemon_profiles';
const AVATAR_BUCKET = 'avatars';
const DEFAULT_XP_RANK = 1000;

function getDisplayNameFallback(user) {
  return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Pokemon Trainer';
}

function normalizeProfile(user, profile = null) {
  return {
    id: user.id,
    email: user.email,
    displayName: profile?.display_name || getDisplayNameFallback(user),
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    avatarPath: profile?.avatar_path || user.user_metadata?.avatar_path || '',
    xpRank: Number(profile?.xp_rank || user.user_metadata?.xp_rank || DEFAULT_XP_RANK),
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
    .select('id, email, display_name, xp_rank, avatar_path, avatar_url')
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
        xp_rank: fallbackProfile.xpRank,
      },
      { onConflict: 'id' }
    )
    .select('id, email, display_name, xp_rank, avatar_path, avatar_url')
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
    xp_rank: profileInput.xpRank,
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
    .select('id, email, display_name, xp_rank, avatar_path, avatar_url')
    .single();

  if (error) {
    throw error;
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      avatar_path: data.avatar_path,
      xp_rank: data.xp_rank,
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
