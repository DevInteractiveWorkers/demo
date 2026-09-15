// lib/uploadMedia.ts
import { uploadFile } from "./useBuckets";

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

    const uploaded = result.value;

    urls[`${key}Url`] = uploaded.url;
  });

  return urls;
}
