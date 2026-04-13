import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "Hacking the Unhackable: A CTF Writeup",
    content: "In this writeup, I walk through exploiting a chain of vulnerabilities in a web application during a recent CTF competition...",
    tags: "CTF, Web Exploitation, XSS",
    created_at: "2025-01-15",
  },
  {
    id: "2",
    title: "OSINT Techniques for Bug Bounty Hunting",
    content: "Discover how to leverage open-source intelligence techniques to find hidden attack surfaces and maximize your bug bounty earnings...",
    tags: "OSINT, Bug Bounty, Recon",
    created_at: "2025-02-10",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading
          title="Blog / Writeups"
          subtitle="CTF writeups, security research, and findings"
        />

        <div className="space-y-6">
          {posts.map((post) => (
            <GlowCard key={post.id}>
              <h3 className="text-primary font-bold text-xl mb-2">{post.title}</h3>
              <div className="flex items-center gap-4 text-xs text-dim mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.created_at}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {post.tags}
                </span>
              </div>
              <p className="text-dim text-sm leading-relaxed line-clamp-3">{post.content}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
