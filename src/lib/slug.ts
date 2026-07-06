export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "post";

export const postSlug = (title: string, id: string): string =>
  `${slugify(title)}-${id.slice(0, 8)}`;

export const idFromSlug = (slug: string): string | null => {
  const match = slug.match(/-([a-f0-9]{8})$/i);
  return match ? match[1] : null;
};
