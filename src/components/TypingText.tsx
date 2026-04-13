import { useState, useEffect } from "react";

interface TypingTextProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  className?: string;
}

const TypingText = ({ lines, typingSpeed = 50, lineDelay = 500, className = "" }: TypingTextProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    if (currentChar < lines[currentLine].length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = (updated[currentLine] || "") + lines[currentLine][currentChar];
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, lines, typingSpeed, lineDelay]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      {displayedLines.map((line, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-accent select-none">&gt;</span>
          <span>{line}</span>
          {i === currentLine && currentLine < lines.length && (
            <span className={`inline-block w-2.5 h-5 bg-primary ${showCursor ? "opacity-100" : "opacity-0"}`} />
          )}
        </div>
      ))}
      {currentLine >= lines.length && (
        <div className="flex items-center gap-1">
          <span className="text-accent select-none">&gt;</span>
          <span className={`inline-block w-2.5 h-5 bg-primary ${showCursor ? "opacity-100" : "opacity-0"}`} />
        </div>
      )}
    </div>
  );
};

export default TypingText;
