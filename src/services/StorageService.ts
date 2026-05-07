import { supabase } from "../lib/supabase";

const BUCKET_NAME = "avatars";

function getSafeFileName(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`;

  return `uploads/${uniqueId}-${baseName || "archivo"}.${extension}`;
}

export async function uploadToVault(file: File) {
  const path = getSafeFileName(file);

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return {
    bucket: BUCKET_NAME,
    path: data.path,
    publicUrl,
  };
}
