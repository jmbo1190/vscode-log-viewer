import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const [log, setLog] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.command === 'newChunk') {
        setLog((prevLog) => [...prevLog, message.chunk]);
      } else if (message.command === 'endOfFile') {
        setLog((prevLog) => [...prevLog, '--- End of File ---']);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {log.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
