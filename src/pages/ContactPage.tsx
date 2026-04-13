import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Try again.", variant: "destructive" });
    } else {
      toast({ title: "Message Sent", description: "Thanks for reaching out!" });
      setForm({ name: "", email: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-xl">
        <SectionHeading title="Contact" subtitle="Have a question or want to work together?" />
        <GlowCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-dim mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Your name" maxLength={100} />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="your@email.com" maxLength={255} />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none" placeholder="Your message..." maxLength={1000} />
            </div>
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded font-semibold hover:bg-accent transition-colors disabled:opacity-50">
              <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </GlowCard>
      </div>
    </div>
  );
};

export default ContactPage;
