import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const startWithFileCommand = vscode.commands.registerCommand('logReader.startWithFile', (uri: vscode.Uri) => {
    const panel = vscode.window.createWebviewPanel(
      'logReader',
      `Log Reader - ${uri.path.split('/').pop()}`,  // Display the file name in the title
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true  // Retain webview content even when hidden
      }
    );

    const webviewUri = vscode.Uri.file(context.extensionPath + '/out/webview.js');
    const scriptUri = panel.webview.asWebviewUri(webviewUri);
    panel.webview.html = getWebviewContent(scriptUri);

    const filePath = uri.fsPath;
    const chunkSize = 1024;
    let currentContent = '';  // Variable to store current file content for this instance

    // Read and send file content in chunks to the webview
    const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: chunkSize });
    stream.on('data', (chunk) => {
      currentContent += chunk;  // Append to the current content
      panel.webview.postMessage({ command: 'newChunk', chunk });
    });

    stream.on('end', () => {
      panel.webview.postMessage({ command: 'endOfFile' });
      stream.close(); // Close the stream here
    });

    stream.on('error', (error) => {
      console.error('Error reading file:', error);
      stream.close(); // Close the stream on error
   });
   

    // Restore content if the view is reactivated
    panel.onDidChangeViewState((event) => {
      if (event.webviewPanel.visible) {
        panel.webview.postMessage({ command: 'restoreContent', content: currentContent });
      }
    });

    // Clear resources on dispose
    panel.onDidDispose(() => {
      // Also close the stream when the webview is disposed.
      // This handles scenarios where the user might switch away from the webview before it ends.
      stream.close();
    });
  });

  context.subscriptions.push(startWithFileCommand);
}

function getWebviewContent(scriptUri: vscode.Uri): string {
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
