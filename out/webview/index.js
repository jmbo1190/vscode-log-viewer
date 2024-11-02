"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const App = () => {
    const [log, setLog] = React.useState([]);
    React.useEffect(() => {
        const handleMessage = (event) => {
            const message = event.data;
            if (message.command === 'newChunk') {
                setLog((prevLog) => [...prevLog, message.chunk]);
            }
            else if (message.command === 'endOfFile') {
                setLog((prevLog) => [...prevLog, '--- End of File ---']);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    return (React.createElement("div", { style: { fontFamily: 'monospace', whiteSpace: 'pre-wrap' } }, log.map((line, index) => (React.createElement("div", { key: index }, line)))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
//# sourceMappingURL=index.js.map