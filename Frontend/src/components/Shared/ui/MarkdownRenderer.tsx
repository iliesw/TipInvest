import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const MarkdownRenderer = ({ markdown, className = '' }: MarkdownRendererProps) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Parse markdown to HTML
    if (markdown) {
      try {
        const parsedHtml = marked.parse(markdown);
        setHtml(parsedHtml as string);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setHtml(markdown); // Fallback to raw text if parsing fails
      }
    } else {
      setHtml('');
    }
  }, [markdown]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;