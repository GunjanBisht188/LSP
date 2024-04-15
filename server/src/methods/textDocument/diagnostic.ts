import { RequestMessage } from "../../server";
import { Range } from "../../types";
import * as fs from "fs";
import log from "../../log";
import { TextDocumentIdentifier} from "../../documents";
import { documents } from "../../documents";


const filePath = "C:/Users/bishtgun/Downloads/words.txt"; 
const words = fs.readFileSync(filePath, 'utf8').split(/\r?\n/); 

interface DocumentDiagnosticParams{
    textDocument: TextDocumentIdentifier;
}
namespace DiagnosticSeverity {
    export const Error: 1 = 1;
    export const Warning: 2 = 2;
    export const Information: 3 = 3;
    export const Hint: 4 = 4;
}

type DiagnosticSeverity = 1 | 2 | 3 | 4;

interface Diagnostic {
    range: Range;
    severity: DiagnosticSeverity;
    source: string;
    message: string;
    data?: unknown;
}

interface FullDocumentDiagnosticReport {
    kind: "full";
    items: Diagnostic[];
}

export const diagnostic = (
    message: RequestMessage
): FullDocumentDiagnosticReport | null => {
    log.write("Inside the method");
    const params = message.params as DocumentDiagnosticParams;
    const content = documents.get(params.textDocument.uri);
    if(!content)
        {
            return null;
        }
    const wordsInDocument = content.split(/\W/);

    const invalidWords = wordsInDocument.filter(
        (word) => !words.includes(word)
    );
    const items: Diagnostic[] = []
    invalidWords.forEach((invalidWord)=>{
        items.push({
            source:"lsp-from-scratch",
            severity: DiagnosticSeverity.Error,
            range: {
                start: { line : 0, character: 0},
                end: { line: 0, character: 10},
        },
        message: `${invalidWord} is not in the dictionary`
        });
    });
    return {
        kind: "full",
        items,
    };
};