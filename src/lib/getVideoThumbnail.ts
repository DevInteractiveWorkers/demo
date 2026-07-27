// lib/getVideoThumbnail.ts
export function getVideoThumbnail(
  src: string,
  time?: number,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.crossOrigin = "anonymous";
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const cleanup = () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    const onLoaded = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        video.currentTime = Math.min(
          time ?? 0,
          Math.max(video.duration - 0.05, 0),
        );
      }
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);

        cleanup();
        resolve(thumbnail);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const onError = () => {
      cleanup();
      resolve(null);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
  });
}
