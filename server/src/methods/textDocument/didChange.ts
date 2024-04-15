import { NotificationMessage } from "../../server";
import log  from "../../log";
import { VersionedTextDocumentIdentifier } from "../../documents";
import { TextDocumentContentChangeEvent } from "../../documents";
import { documents } from "../../documents";


interface DidChangeTextDocumentParams{
    textDocument: VersionedTextDocumentIdentifier;
    contentChanges: TextDocumentContentChangeEvent[];
}
export const didChange: (message: NotificationMessage) => void = (message) => {
    const params = message.params as DidChangeTextDocumentParams | undefined;
    if (params) {
        const { textDocument, contentChanges } = params;
        if (textDocument && contentChanges && contentChanges.length > 0) {
            documents.set(textDocument.uri, contentChanges[0].text);
        } else {
            log.write("Invalid parameters for textDocument/didChange method.");
        }
    } else {
        log.write("Missing parameters for textDocument/didChange method.");
    }
};