// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const moo = require('moo');

    let lexer = moo.compile({
        BLOCK_COMMENT:  { match: /\/\*[^]*?\*\//, lineBreaks: true, value: x => null },
        COMMENT:        { match: /\/\/[^\n]*\n?/, lineBreaks: true, value: x => null },
        WHITESPACE:     { match: /\s+/, lineBreaks: true },
        ENTITY:         "entity",
        REL:            "rel",
        ID:             "ID",
        COMPOSED:       "COMPOSED",
        IDENTIFIER:     /[a-zA-Z_][a-zA-Z0-9_]*/,
        "{":            "{",
        "}":            "}",
        "[":            "[",
        "]":            "]",
        ";":            ";",
        ">":            ">"
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
    {"name": "entity_command", "symbols": [(lexer.has("ENTITY") ? {type: "ENTITY"} : ENTITY), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "optional_attributes_block"], "postprocess":  ([_, _1, name, _2, attrs_block]) => ({
        type: "entity",
        name: name.value,
        attributes: attrs_block,
        loc: { line: name.line, col: name.col, offset: name.offset } }) },
    {"name": "rel_command", "symbols": [(lexer.has("REL") ? {type: "REL"} : REL), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", {"literal":">"}, "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", {"literal":";"}], "postprocess":  ([_, _1, fromEntity, _2, _3, _4, toEntity, _5, _6]) => ({
            type: "rel",
            from: fromEntity.value,
            to: toEntity.value,
            loc: { line: fromEntity.line, col: fromEntity.col, offset: fromEntity.offset } 
        }) },
    {"name": "optional_attributes_block", "symbols": [{"literal":"{"}, "_", "attributes", "_", {"literal":"}"}], "postprocess": ([_, _1, attrs, _2, _3]) => attrs},
    {"name": "optional_attributes_block", "symbols": [{"literal":";"}], "postprocess": () => []},
    {"name": "attributes", "symbols": ["attribute_item"], "postprocess": ([a]) => [a]},
    {"name": "attributes", "symbols": ["attributes", "_", "attribute_item"], "postprocess": ([as, _, a]) => [...as, a]},
    {"name": "attributes", "symbols": [], "postprocess": () => []},
    {"name": "attribute_item", "symbols": ["attribute_basic", "_", {"literal":";"}], "postprocess": ([attr, _]) => attr},
    {"name": "attribute_item", "symbols": ["attribute_composed"], "postprocess": id},
    {"name": "attribute_item", "symbols": ["attribute_basic"], "postprocess": id},
    {"name": "attribute_basic", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "ID_designator"], "postprocess":  ([name, _, _1]) => ({
            name: name.value,
            type: "id",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "attribute_basic", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([name]) => ({
            name: name.value,
            type: "simple",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "attribute_composed", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "COMPOSED_designator"], "postprocess":  ([name, _, composed_attrs]) => ({
            name: name.value,
            type: "composed",
            attributes: composed_attrs,
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "ID_designator", "symbols": [{"literal":"["}, "_", (lexer.has("ID") ? {type: "ID"} : ID), "_", {"literal":"]"}], "postprocess": () => true},
    {"name": "COMPOSED_designator", "symbols": [{"literal":"["}, "_", (lexer.has("COMPOSED") ? {type: "COMPOSED"} : COMPOSED), "_", {"literal":"]"}, "_", {"literal":"{"}, "_", "composed_attributes", "_", {"literal":"}"}], "postprocess": ([_,_1,_2,_3,_4,_5,_6,_7, attrs, _8,_9]) => attrs},
    {"name": "composed_attributes", "symbols": ["composed_attribute_item"], "postprocess": ([a]) => [a]},
    {"name": "composed_attributes", "symbols": ["composed_attributes", "_", "composed_attribute_item"], "postprocess": ([as, _, a]) => [...as, a]},
    {"name": "composed_attributes", "symbols": [], "postprocess": () => []},
    {"name": "composed_attribute_item", "symbols": ["composed_attribute_basic", "_", {"literal":";"}], "postprocess": ([attr, _]) => attr},
    {"name": "composed_attribute_item", "symbols": ["composed_attribute_composed"], "postprocess": id},
    {"name": "composed_attribute_item", "symbols": ["composed_attribute_basic"], "postprocess": id},
    {"name": "composed_attribute_basic", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([name]) => ({
            name: name.value,
            type: "composed_att",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "composed_attribute_composed", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "COMPOSED_designator"], "postprocess":  ([name, _, composed_attrs]) => ({
            name: name.value,
            type: "composed",
            attributes: composed_attrs,
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "optional_semicolon", "symbols": [{"literal":";"}], "postprocess": () => null},
    {"name": "optional_semicolon", "symbols": [], "postprocess": () => null},
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
