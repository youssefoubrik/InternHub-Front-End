import api from "@/lib/axios";
import { getValidToken } from "@/utils/auth";

function authHeaders() {
  const token = getValidToken();
  if (!token) throw new Error("You must be signed in to manage files");
  return { Authorization: `Bearer ${token}` };
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<{ publicUrl: string }>("/storage/images", formData, {
    headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
  });
  return data.publicUrl;
}

export async function deleteFile(publicUrl: string): Promise<void> {
  if (!publicUrl) return;
  await api.delete("/storage/images", {
    params: { publicUrl },
    headers: authHeaders(),
  });
}
