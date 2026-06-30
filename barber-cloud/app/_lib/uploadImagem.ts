import { supabase } from './supabase'

export async function uploadImagem(arquivo: File, bucket: string, nomeArquivo: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(nomeArquivo, arquivo)

  if (error) {
    throw error
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(nomeArquivo)

  return urlData.publicUrl
}