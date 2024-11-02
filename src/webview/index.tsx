import React, { useEffect, useState } from 'react';
// import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';  // Import from react-dom/client


const App: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Listen for messages from the extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      switch (message.command) {
        case 'newChunk':
          // Append new chunk to content
          setContent(prevContent => prevContent + message.chunk);
          break;
        case 'endOfFile':
          setContent(prevContent => prevContent + '\n--- End of File ---');
          break;
        case 'restoreContent':
          // Restore full content when switching back to this webview
          setContent(message.content);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div id="root" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{content}</div>
  );
};

//ReactDOM.render(<App />, document.getElementById('root'));

// Use createRoot to render the component
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);  // Create root
  root.render(<App />);  // Render the App component
}