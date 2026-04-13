import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "You can now log in. Ask the site owner to grant you admin access." });
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Access Denied", description: error.message, variant: "destructive" });
      } else {
        navigate("/admin");
      }
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
            <span className="text-xs text-dim ml-2">admin@rastthack</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary glow-text">
                {isSignUp ? "Create Account" : "Admin Login"}
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-dim mb-1">&gt; email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-dim mb-1">&gt; password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded font-semibold hover:bg-accent transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Access Dashboard"}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full mt-3 text-xs text-dim hover:text-primary transition-colors text-center"
            >
              {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
