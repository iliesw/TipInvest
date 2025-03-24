import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  parseMarkdown?: boolean;
}

export default function TypeWriter({
  text,
  speed = 30,
  className = '',
  parseMarkdown = true,
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);
  
  useEffect(() => {
    if (!text) return;
    
    // If we haven't displayed all characters yet
    if (currentIndex < text.length) {
      // Set a timeout to add the next character
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      // Clean up the timeout
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);
  
  // Parse markdown to HTML if parseMarkdown is true
  if (parseMarkdown && displayedText) {
    const htmlContent = marked(displayedText);
    return <span className={className} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }
  
  // Regular text display without markdown parsing
  return <span className={className}>{displayedText}</span>;
}