import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, FolderOpen, FileText, Mail, Info, Wrench, Award, LogOut, Users, BookOpen, FileDown, Layers, ToggleLeft, Trophy, Share2, Briefcase } from "lucide-react";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminBlogPosts from "@/components/admin/AdminBlogPosts";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminCertifications from "@/components/admin/AdminCertifications";
import AdminExtracurricular from "@/components/admin/AdminExtracurricular";
import AdminCV from "@/components/admin/AdminCV";
import AdminPapers from "@/components/admin/AdminPapers";
import AdminCustomSections from "@/components/admin/AdminCustomSections";
import AdminVisibility from "@/components/admin/AdminVisibility";
import AdminAchievements from "@/components/admin/AdminAchievements";
import AdminSocialLinks from "@/components/admin/AdminSocialLinks";
import AdminServices from "@/components/admin/AdminServices";

type Tab = "projects" | "blog" | "messages" | "about" | "achievements" | "social" | "skills" | "services" | "certs" | "extra" | "cv" | "papers" | "custom" | "visibility";

const tabs: { key: Tab; label: string; icon: typeof FolderOpen }[] = [
  { key: "projects", label: "Projects", icon: FolderOpen },
  { key: "blog", label: "Blog Posts", icon: FileText },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "about", label: "About", icon: Info },
  { key: "achievements", label: "Achievements", icon: Trophy },
  { key: "social", label: "Social Links", icon: Share2 },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "certs", label: "Certifications", icon: Award },
  { key: "extra", label: "Extracurricular", icon: Users },
  { key: "cv", label: "CV / Resume", icon: FileDown },
  { key: "papers", label: "Papers", icon: BookOpen },
  { key: "custom", label: "Custom Sections", icon: Layers },
  { key: "visibility", label: "Visibility", icon: ToggleLeft },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/x9k7m2/auth");
        return;
      }
      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
        await supabase.auth.signOut();
        navigate("/x9k7m2/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/x9k7m2/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary animate-glow-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary glow-text">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 text-sm text-dim hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-primary/10 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-t transition-all ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-dim hover:text-primary hover:bg-primary/5"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "blog" && <AdminBlogPosts />}
        {activeTab === "messages" && <AdminMessages />}
        {activeTab === "about" && <AdminAbout />}
        {activeTab === "achievements" && <AdminAchievements />}
        {activeTab === "social" && <AdminSocialLinks />}
        {activeTab === "skills" && <AdminSkills />}
        {activeTab === "services" && <AdminServices />}
        {activeTab === "certs" && <AdminCertifications />}
        {activeTab === "extra" && <AdminExtracurricular />}
        {activeTab === "cv" && <AdminCV />}
        {activeTab === "papers" && <AdminPapers />}
        {activeTab === "custom" && <AdminCustomSections />}
        {activeTab === "visibility" && <AdminVisibility />}
      </div>
    </div>
  );
};

export default AdminDashboard;
