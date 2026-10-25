import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/certifications", label: "Certifications" },
  { to: "/extracurricular", label: "Extracurricular" },
  { to: "/papers", label: "Papers" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50 border-b border-primary/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="h-6 w-6 text-neon transition-all group-hover:drop-shadow-[0_0_8px_hsl(152_100%_50%/0.6)]" />
          <span className="text-lg font-bold text-primary glow-text">RASTTHACK</span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-1 px-1 py-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to || (link.to === "/about" && location.pathname === "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  active
                    ? "bg-secondary/80 border border-primary/20 text-primary shadow-[0_0_12px_hsl(186_100%_50%/0.15)]"
                    : "border border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="xl:hidden text-primary"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-primary/10 bg-background/95 backdrop-blur-xl">
          {navLinks.map((link) => {
            const active = location.pathname === link.to || (link.to === "/about" && location.pathname === "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-sm tracking-wide border-b border-primary/5 transition-all duration-200 ${
                  active
                    ? "text-primary bg-secondary/70 border-l-2 border-l-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
