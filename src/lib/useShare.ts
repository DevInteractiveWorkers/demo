export const handleShare = async ({
  url,
  title = "Demo InteractiveWorkers",
}: {
  url: string;
  title?: string;
}) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};
