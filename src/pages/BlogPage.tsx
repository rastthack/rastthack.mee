import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Tag, X, ChevronRight } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";

interface Post {
  id: string;
  title: string;
  content: string | null;
  tags: string | null;
  cover_image: string | null;
  created_at: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setPosts(data as Post[]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Blog / Writeups" subtitle="CTF writeups, security research, and findings — click any post to read" />

        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-dim text-center">Blog posts coming soon.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <button
                  onClick={() => setSelected(post)}
                  className="w-full text-left bg-card border border-primary/10 rounded-lg p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 glow-border hover:glow-border-hover flex items-center gap-4 group"
                >
                  {post.cover_image && (
                    <img
                      src={toDirectImageUrl(post.cover_image)}
                      alt=""
                      className="hidden sm:block w-20 h-20 object-cover rounded border border-primary/10 flex-shrink-0"
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-primary font-bold text-base md:text-lg truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-dim mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.tags && <span className="flex items-center gap-1 truncate"><Tag className="h-3 w-3" />{post.tags}</span>}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-card border border-primary/30 rounded-lg w-full max-w-3xl my-8 glow-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-3 right-3 p-2 rounded text-dim hover:text-primary hover:bg-primary/10 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary glow-text mb-3 pr-10">{selected.title}</h2>
              <div className="flex items-center gap-4 text-xs text-dim mb-6">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(selected.created_at).toLocaleDateString()}</span>
                {selected.tags && <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{selected.tags}</span>}
              </div>

              {selected.cover_image && (
                <img
                  src={toDirectImageUrl(selected.cover_image)}
                  alt={selected.title}
                  className="rounded mb-6 w-full max-h-96 object-contain bg-terminal border border-primary/10"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}

              <div className="prose prose-invert prose-sm md:prose-base max-w-none text-foreground/90
                prose-headings:text-primary prose-headings:glow-text prose-headings:font-bold
                prose-a:text-accent hover:prose-a:text-primary
                prose-strong:text-primary
                prose-code:text-accent prose-code:bg-terminal prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-terminal prose-pre:border prose-pre:border-primary/20
                prose-blockquote:border-l-primary prose-blockquote:text-dim
                prose-img:rounded prose-img:border prose-img:border-primary/10 prose-img:my-4
                prose-hr:border-primary/20">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => (
                      <img
                        src={toDirectImageUrl(typeof src === "string" ? src : "")}
                        alt={alt || ""}
                        loading="lazy"
                        className="rounded border border-primary/10 my-4 max-w-full h-auto"
                      />
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                  }}
                >
                  {selected.content || "*No content*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
