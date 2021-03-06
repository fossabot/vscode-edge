export class EdgeFormatter {
    newLine: string = "\n";
    indentPattern: string;

    constructor(options?: IEdgeFormatterOptions) {
        options = options || {};

        // options default value
        options.tabSize = options.tabSize || 4;
        if (typeof options.insertSpaces === "undefined") {
            options.insertSpaces = true;
        }

        this.indentPattern = (options.insertSpaces) ? " ".repeat(options.tabSize) : "\t";
    }

    format(inputText: string): string {

        let inComment: boolean = false;
        let output: string = inputText;

        // block pattern
        let patternBlock = /(\@)(inject|extends|section|hasSection|include|stop|endpush|endphp)/g;

        // edge format fix
        output = output.replace(patternBlock, function (match: string) {
            return "\n" + match;
        });

        output = output.replace(/(\s*)\@include/g, "\n" + this.indentPattern + "@include");
        output = output.replace(/(\s*)\@endsection/g, "\n@endsection\n");
        
        // Fix #65 empty new line after @extends and self-closing @section
        output = output.replace(/(\@(section|yield)\(.*\',.*|\@extends\(.*\))/g, function (match) {
            return match + "\n";
        });

        // fix #57 url extra space after formatting
        output = output.replace(/url\(\"(\s*)/g, "url\(\"");

        return output.trim();
    }
}

export interface IEdgeFormatterOptions {
    insertSpaces?: boolean;
    tabSize?: number;
}
