
export interface FileUpdateMessage {file: string, content: string, type: string}
export interface FileChangeMessage {file: string, newContent: string, start: number, length: number}

export function replaceRange(original: string, newContent: string, start: number, length: number) {
    return original.substring(0, start) + newContent + original.substr(start+length);
}