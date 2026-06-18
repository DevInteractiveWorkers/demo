export async function uploadToGHL(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://services.leadconnectorhq.com/medias/upload-file",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GHL_TOKEN}`,
        Version: "2021-07-28",
      },
      body: formData,
    },
  );

  const text = await response.text();

  console.log("GHL STATUS:", response.status);
  console.log("GHL RESPONSE:", text);

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}
