import { RequestMessage } from "../../server"; 
import { documents, TextDocumentIdentifier } from "../../documents";
import * as fs from "fs";
import log from "../../log";
import { Position } from "../../types";

const MAX_LENGTH = 1000;

// Correct the file path and ensure it is accessible
const filePath = "C:/Users/bishtgun/Downloads/words.txt"; // Adjust the path as necessary
const words = fs.readFileSync(filePath, 'utf8').split(/\r?\n/); // Handles both Windows and Unix line endings



type CompletionItem = {
    label : string;
};

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}
interface TextDocumentpositionParams {
    textDocument: TextDocumentIdentifier;
    position: Position;

}
export interface CompletionParams extends TextDocumentpositionParams {

}
export const completion = (message: RequestMessage): CompletionList |null =>{
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri);
    if(!content)
    {
        return null;
    }
    const currentLine = content.split("\n")[params.position.line];

    const lineUntilCursor = currentLine.slice(0,params.position.character);
    const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");
    const items = words
        .filter((word) => {
            return word.startsWith(currentPrefix);
        })
        .slice(0,MAX_LENGTH)
        .map((word)=> {
            return { label: word};
        });
        
    
    return{
        isIncomplete: items.length === MAX_LENGTH,
        items,
    };
};
