import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";
import { idFromSlug, postSlug } from "@/lib/slug";

interface Post {
  id: string;
  title: string;
  content: string | null;
  tags: string | null;
  cover_image: string | null;
  created_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      const idSuffix = slug ? idFromSlug(slug) : null;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      const posts = (data || []) as Post[];
      let found: Post | undefined;
      if (idSuffix) found = posts.find((p) => p.id.startsWith(idSuffix));
      if (!found && slug) found = posts.find((p) => postSlug(p.title, p.id) === slug);
      if (found) {
        setPost(found);
        document.title = `${found.title} — Blog`;
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <p className="text-dim text-center animate-glow-pulse">Loading post...</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 container mx-auto px-4 max-w-3xl text-center">
        <p className="text-dim mb-4">Post not found.</p>
        <Link to="/blog" className="text-primary hover:text-accent inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="text-dim hover:text-primary inline-flex items-center gap-1 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-primary glow-text mb-3">{post.title}</h1>
        <div className="flex items-center gap-4 text-xs text-dim mb-6">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
          {post.tags && <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{post.tags}</span>}
        </div>

        {post.cover_image && (
          <img
            src={toDirectImageUrl(post.cover_image)}
            alt={post.title}
            className="rounded mb-6 w-full max-h-96 object-contain bg-terminal border border-primary/10"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <article className="prose prose-invert prose-sm md:prose-base max-w-none text-foreground/90
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
            {post.content || "*No content*"}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
