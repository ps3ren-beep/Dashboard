import { supabase } from '@/lib/supabaseClient';

async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });
  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId: string, file: File) {
  const path = `${userId}/avatar-${Date.now()}`;
  return uploadFile('avatars', path, file);
}

export async function uploadMemberAvatar(memberId: string, file: File) {
  const path = `${memberId}/avatar-${Date.now()}`;
  return uploadFile('avatars', path, file);
}

export async function uploadCardLogo(accountId: string, file: File) {
  const path = `${accountId}/logo-${Date.now()}`;
  return uploadFile('cards', path, file);
}

