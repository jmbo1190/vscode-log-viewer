"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    const startWithFileCommand = vscode.commands.registerCommand('logReader.startWithFile', (uri) => {
        const panel = vscode.window.createWebviewPanel('logReader', 'Log Reader', vscode.ViewColumn.One, { enableScripts: true });
        const webviewUri = vscode.Uri.file(context.extensionPath + '/out/webview.js');
        const scriptUri = panel.webview.asWebviewUri(webviewUri);
        panel.webview.html = getWebviewContent(scriptUri);
        const filePath = uri.fsPath; // Get the file path from the right-clicked file
        const chunkSize = 1024;
        // Read and send file content in chunks to the webview
        const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: chunkSize });
        stream.on('data', (chunk) => {
            panel.webview.postMessage({ command: 'newChunk', chunk });
        });
        stream.on('end', () => {
            panel.webview.postMessage({ command: 'endOfFile' });
        });
    });
    context.subscriptions.push(startWithFileCommand);
}
function getWebviewContent(scriptUri) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log Reader</title>
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}
//# sourceMappingURL=extension.js.map