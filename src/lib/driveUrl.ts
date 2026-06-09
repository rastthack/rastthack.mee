// Convert Google Drive share URLs into direct-image URLs that can render in <img>.
// Accepts formats like:
//   https://drive.google.com/file/d/<ID>/view?usp=sharing
//   https://drive.google.com/open?id=<ID>
//   https://drive.google.com/uc?id=<ID>
// Returns the original URL unchanged when no Drive ID is found.
export const toDirectImageUrl = (url?: string | null): string => {
  if (!url) return "";
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const id = fileMatch?.[1] || idMatch?.[1];
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w1200`;
  return url;
};
