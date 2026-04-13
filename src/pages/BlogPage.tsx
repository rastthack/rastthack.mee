import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Calendar, Tag } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string | null;
  tags: string | null;
  created_at: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Blog / Writeups" subtitle="CTF writeups, security research, and findings" />

        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-dim text-center">Blog posts coming soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <GlowCard key={post.id}>
                <h3 className="text-primary font-bold text-xl mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-xs text-dim mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
                  {post.tags && <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{post.tags}</span>}
                </div>
                <p className="text-dim text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </GlowCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
