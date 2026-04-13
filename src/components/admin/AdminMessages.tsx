import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import GlowCard from "@/components/GlowCard";
import { Mail, MailOpen, Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean | null;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (msg: Message) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-dim text-sm">{messages.filter(m => !m.read).length} unread messages</p>
      {messages.map((m) => (
        <GlowCard key={m.id} className={m.read ? "opacity-60" : ""}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary font-semibold text-sm">{m.name}</span>
                <span className="text-dim text-xs">{m.email}</span>
              </div>
              <p className="text-dim text-sm whitespace-pre-wrap">{m.message}</p>
              <p className="text-xs text-dim/50 mt-2">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleRead(m)} className="p-1.5 text-dim hover:text-primary transition-colors" title={m.read ? "Mark unread" : "Mark read"}>
                {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
              </button>
              <button onClick={() => remove(m.id)} className="p-1.5 text-dim hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {messages.length === 0 && <p className="text-dim text-sm text-center py-8">No messages yet.</p>}
    </div>
  );
};

export default AdminMessages;
