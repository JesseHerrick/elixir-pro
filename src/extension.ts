// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fstat, open } from 'fs';
import { openStdin } from 'process';
import { TextEncoder } from 'util';
import * as vscode from 'vscode';

export function openFile(path: string, newFileText: string): Thenable<any> {
	let fileUri: vscode.Uri = vscode.Uri.file(path);

	return vscode.workspace.fs.stat(fileUri)
	  .then(
			() => 0,
			() => vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(newFileText))
		)
		.then(_details => vscode.workspace.openTextDocument(fileUri))
		.then(document => vscode.window.showTextDocument(document));
}

function getModuleName(line: string): string {
	let match: any = line.match(/^defmodule ([a-zA-Z\.]+) do$/);

	if (match.length === 2) {
		return match[1];
	} else {
		return "";
	}
}

function getTestModuleName(line: string): string {
	let matches = line.match(/^defmodule ([a-zA-Z\.]+)Test do$/)

	return returnMatch(matches);
}

function buildTestModuleDefinition(moduleName: string): string {
	return `defmodule ${moduleName}Test do\n  \nend`;
}

function returnMatch(matches: Array<string> | null): string {
	if (matches?.length === 2) {
		return matches[1];
	} else {
		return "";
	}
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
		if (vscode.window.activeTextEditor?.document.languageId === 'elixir') {
			let firstLine = vscode.window.activeTextEditor?.document?.lineAt(0)?.text || '';
			let moduleName = getModuleName(firstLine);
			let testModuleDefinition = buildTestModuleDefinition(moduleName);

			let filename = vscode.window.activeTextEditor?.document.fileName;

			if (filename !== undefined) {
				let testFilename: string = filename.replace(/lib\//, "test/").replace(/\.ex/, "_test.exs");

				openFile(testFilename, testModuleDefinition);
			}
		}
	});

	let findElixirFile = vscode.commands.registerCommand('elixir-pro.gotoElixirFile', () => {
		let testFilename = vscode.window.activeTextEditor?.document.fileName;

		if (testFilename !== undefined) {
			let filename: string = testFilename.replace(/test\//, "lib/").replace(/_test\.exs/, ".ex");

			openFile(filename, "");
		}
	});

	context.subscriptions.push(findElixirTestFile, findElixirFile);
}

// this method is called when your extension is deactivated
export function deactivate() { }
