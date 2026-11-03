// lib/uploadMedia.ts
// Browser-side upload helpers. Files go straight to S3 via a presigned PUT
// URL issued by /api/upload-url (S3 credentials never reach the client).

export type MediaFiles = {
  resume?: File | null;
  video?: File | null;
  thumbnail?: File | null;
};

export type MediaUrls = {
  resumeUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
};

async function uploadFile(file: File) {
  const contentType = file.type || "application/octet-stream";

  // Step 1: ask our server for a presigned PUT URL (small JSON request,
  // never hits Vercel's body-size limit).
  let presignData: {
    success: boolean;
    uploadUrl: string;
    url: string;
    error?: string;
  };

  try {
    const presignRes = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType }),
    });

    presignData = await presignRes.json();

    if (!presignRes.ok || !presignData.success) {
      throw new Error(presignData.error ?? "Failed to obtain upload URL");
    }
  } catch (error) {
    throw new Error(
      `Could not prepare upload for "${file.name}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  // Step 2: PUT the file directly to S3/RustFS, bypassing Vercel entirely.
  try {
    const putRes = await fetch(presignData.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Storage rejected the upload (status ${putRes.status})`);
    }
  } catch (error) {
    throw new Error(
      `Failed to upload "${file.name}" to storage: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return { url: presignData.url };
}

/**
 * Uploads any provided files in parallel and returns the resulting URLs,
 * falling back to `fallbackUrls` for any field that had no file.
 *
 * Throws if a file was provided but its upload failed.
 */
export async function uploadMediaFiles(
  files: MediaFiles,
  fallbackUrls: Partial<MediaUrls> = {},
): Promise<MediaUrls> {
  const entries = (Object.keys(files) as (keyof MediaFiles)[]).filter(
    (key) => files[key],
  );

  const results = await Promise.allSettled(
    entries.map((key) => uploadFile(files[key] as File)),
  );

  const urls: MediaUrls = {
    resumeUrl: fallbackUrls.resumeUrl ?? "",
    videoUrl: fallbackUrls.videoUrl ?? "",
    thumbnailUrl: fallbackUrls.thumbnailUrl ?? "",
  };

  entries.forEach((key, i) => {
    const result = results[i];

    if (result.status !== "fulfilled" || !result.value) {
      throw new Error(`${key} upload failed`);
    }

    urls[`${key}Url`] = result.value.url;
  });

  return urls;
}
