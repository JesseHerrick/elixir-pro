// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function openFile(path: string) {
	let fileUri: vscode.Uri = vscode.Uri.parse(path);

	vscode.workspace.openTextDocument(fileUri)
		.then((document: vscode.TextDocument) => {
			vscode.window.showTextDocument(document);
		});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "elixir-pro" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let findElixirTestFile = vscode.commands.registerCommand('elixir-pro.gotoElixirTest', () => {
		let filename = vscode.window.activeTextEditor?.document.fileName;

		if (filename != undefined) {
			let testFilename: string = filename.replace(/lib\//, "test/").replace(/\.ex/, "_test.exs");

			openFile(testFilename);
		}
	});

	let findElixirFile = vscode.commands.registerCommand('elixir-pro.gotoElixirFile', () => {
		let testFilename = vscode.window.activeTextEditor?.document.fileName;

		if (testFilename != undefined) {
			let filename: string = testFilename.replace(/test\//, "lib/").replace(/_test\.exs/, ".ex");

			openFile(filename);
		}
	});

	context.subscriptions.push(findElixirTestFile, findElixirFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}
