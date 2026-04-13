import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-primary/10 py-8 mt-20">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dim">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-primary font-semibold tracking-wider">RASTTHACK</span>
      </div>
      <p>&copy; {new Date().getFullYear()} Raduan Ahamed. All rights reserved.</p>
      <p className="text-xs italic">"Breaking systems to secure them."</p>
    </div>
  </footer>
);

export default Footer;
