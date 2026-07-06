import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import { Calendar, Tag, ChevronRight } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";
import { postSlug } from "@/lib/slug";

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
                <Link
                  to={`/blog/${postSlug(post.title, post.id)}`}
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
