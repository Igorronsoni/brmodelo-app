// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const moo = require('moo');

    let lexer = moo.compile({
        BLOCK_COMMENT: { match: /\/\*[^]*?\*\//, lineBreaks: true, value: x => null },
        COMMENT:    { match: /\/\/[^\n]*\n?/, lineBreaks: true, value: x => null },
        WHITESPACE: { match: /\s+/, lineBreaks: true },
        ENTITY:     "entity",
        REL:        "rel",
        ID:         "ID",
        IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/,
        "{":        "{",
        "}":        "}",
        "[":        "[",
        "]":        "]",
        ";":        ";",
        ">":        ">"
    });

    const originalLexerNext = lexer.next;
    lexer.next = function () {
        let token;
        while ((token = originalLexerNext.call(this))) {
            if (token.type !== 'COMMENT' && token.type !== 'BLOCK_COMMENT' && token.type !== 'WHITESPACE') {
                return token;
            }
        }
        return undefined;
    };
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["_", "declaration"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["declaration", "main$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(r => r[1])]},
    {"name": "main", "symbols": [], "postprocess": () => []},
    {"name": "declaration", "symbols": ["entity_command"], "postprocess": id},
    {"name": "declaration", "symbols": ["rel_command"], "postprocess": id},
    {"name": "entity_command", "symbols": [(lexer.has("ENTITY") ? {type: "ENTITY"} : ENTITY), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "optional_attributes_block", "_", {"literal":";"}], "postprocess":  ([_, _1, name, _2, attrs_block, _3, _4]) => ({
            type: "entity",
            name: name.value,
            attributes: attrs_block
        }) },
    {"name": "optional_attributes_block", "symbols": [{"literal":"{"}, "_", "attributes", "_", {"literal":"}"}], "postprocess": ([_, _1, attrs, _2, _3]) => attrs},
    {"name": "optional_attributes_block", "symbols": [], "postprocess": () => []},
    {"name": "attributes", "symbols": ["attribute"], "postprocess": ([a]) => [a]},
    {"name": "attributes", "symbols": ["attributes", "_", {"literal":";"}, "_", "attribute"], "postprocess": ([as, _, _1, _2, a]) => [...as, a]},
    {"name": "attributes", "symbols": ["attributes", "_", {"literal":";"}, "_"], "postprocess": ([as, _, _1, _2]) => as},
    {"name": "attributes", "symbols": [], "postprocess": () => []},
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "ID_designator"], "postprocess": ([name, _, id]) => ({ name: name.value, isID: id })},
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": ([name]) => ({ name: name.value, isID: false })},
    {"name": "ID_designator", "symbols": [{"literal":"["}, "_", (lexer.has("ID") ? {type: "ID"} : ID), "_", {"literal":"]"}], "postprocess": () => true},
    {"name": "rel_command", "symbols": [(lexer.has("REL") ? {type: "REL"} : REL), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", {"literal":">"}, "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", {"literal":";"}], "postprocess":  ([_, _1, fromEntity, _2, _3, _4, toEntity, _5, _6]) => ({
            type: "rel",
            from: fromEntity.value,
            to: toEntity.value
        }) },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("WHITESPACE") ? {type: "WHITESPACE"} : WHITESPACE)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
