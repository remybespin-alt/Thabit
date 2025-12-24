import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-emerald max-w-none break-words">
      <ReactMarkdown
        components={{
          // Override link to open in new tab
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline" {...props} />,
          // Style blockquotes specifically for islamic citations or emphasis
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-emerald-300 pl-4 italic bg-white/50 py-1 rounded-r my-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};