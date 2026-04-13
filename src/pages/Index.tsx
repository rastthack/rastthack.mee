import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "RASTTHACK | Ethical Hacker & Security Researcher";
  }, []);
  
  // Redirect handled by App.tsx routes
  return null;
};

export default Index;
