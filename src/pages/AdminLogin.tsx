import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const attemptsRef = useRef(0);
  const lockTimeRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout
    if (locked) {
      const remaining = lockTimeRef.current
        ? Math.ceil((LOCKOUT_DURATION - (Date.now() - lockTimeRef.current)) / 1000)
        : 0;
      if (remaining > 0) {
        toast({
          title: "Too many attempts",
          description: `Account locked. Try again in ${Math.ceil(remaining / 60)} minute(s).`,
          variant: "destructive",
        });
        return;
      }
      // Lockout expired
      setLocked(false);
      attemptsRef.current = 0;
      lockTimeRef.current = null;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setLocked(true);
        lockTimeRef.current = Date.now();
        toast({
          title: "Account Locked",
          description: "Too many failed attempts. Try again in 5 minutes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid credentials.",
          variant: "destructive",
        });
      }
    } else {
      attemptsRef.current = 0;
      navigate("/x9k7m2");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-terminal border border-primary/20 rounded-lg overflow-hidden glow-border">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/10 bg-primary/5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-accent/40" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <span className="text-xs text-dim ml-2">secure-terminal</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary glow-text">Authentication</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-dim mb-1">&gt; identity:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs text-dim mb-1">&gt; passphrase:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={loading || locked}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded font-semibold hover:bg-accent transition-colors disabled:opacity-50"
              >
                {locked ? "Locked" : loading ? "Authenticating..." : "Authenticate"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
