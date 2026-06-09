export async function uploadToGHL(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/upload-media", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return response.json();
}
