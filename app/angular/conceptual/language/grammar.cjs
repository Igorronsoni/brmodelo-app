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
        ASSENTITY:      "assentity",
        REL:            "rel",
        SPECIALIZE:     "specialize",
        NOTE:           "note",
        ID:             "ID",
        COMPOSED:       "COMPOSED",
        ZERO:           "0",
        ONE:            "1",
        WEAK:           "WEAK",
        IDENTIFIER:     /[a-zA-Z_]\w*/,
        STRING:         {
                          match: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
                          value: x => x.substring(1, x.length - 1)
                        },
        LBRACE:         "{",
        RBRACE:         "}",
        LBRACK:         "[",
        RBRACK:         "]",
        SEMICOLON:      ";",
        LPAREN:         "(",
        RPAREN:         ")",
        GGT:            ">>",
        COMMA:          ",",
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
    {"name": "declaration", "symbols": ["assentity_command"], "postprocess": id},
    {"name": "declaration", "symbols": ["rel_command"], "postprocess": id},
    {"name": "declaration", "symbols": ["note_command"], "postprocess": id},
    {"name": "declaration", "symbols": ["specialize_command"], "postprocess": id},
    {"name": "entity_command", "symbols": [(lexer.has("ENTITY") ? {type: "ENTITY"} : ENTITY), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "_", "attributes", "_", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess":  ([,, name,,,, attrs,,]) => ({
          type: "entity",
          name: name.value,
          attributes: attrs,
          loc: { line: name.line, col: name.col, offset: name.offset 
        } }) },
    {"name": "attributes$ebnf$1", "symbols": []},
    {"name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes", "symbols": ["attributes$ebnf$1"], "postprocess": (attrs) => attrs.flat()},
    {"name": "attribute$ebnf$1", "symbols": ["cardinality"], "postprocess": id},
    {"name": "attribute$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attribute", "symbols": ["attribute$ebnf$1", "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([card, , name]) => ({ 
          name: name.value, 
          type: "simple",
          cardinality: card ?? { min: "1", max: "1" },
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("ID") ? {type: "ID"} : ID), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([name]) => ({ 
          name: name.value, 
          type: "id",
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("COMPOSED") ? {type: "COMPOSED"} : COMPOSED), "_", (lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "_", "attributes_composed", "_", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess":  ([name, _, _1, _2, _3, _4, attrs]) => ({
          name: name.value, 
          type: "composed",
          attributes: attrs ?? [],
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "cardinality", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "_", "zero_or_one", "_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "one_or_n", "_", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess":  ([, , min, , , , max]) => ({
            min: min.value,
            max: max.value
        }) },
    {"name": "attributes_composed$ebnf$1", "symbols": []},
    {"name": "attributes_composed$ebnf$1", "symbols": ["attributes_composed$ebnf$1", "attribute_composed"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes_composed", "symbols": ["attributes_composed$ebnf$1"], "postprocess": (attrs) => attrs.flat()},
    {"name": "attribute_composed", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([name]) => ({
            name: name.value,
            type: "composed_att",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "assentity_command", "symbols": [(lexer.has("ASSENTITY") ? {type: "ASSENTITY"} : ASSENTITY), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([,, name]) => ({
          type: "assentity",
          relationship: name.value,
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "rel_command$ebnf$1", "symbols": ["rel_attributes"], "postprocess": id},
    {"name": "rel_command$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_command", "symbols": [(lexer.has("REL") ? {type: "REL"} : REL), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "rel_command$ebnf$1", "_", (lexer.has("GGT") ? {type: "GGT"} : GGT), "_", "rel_entities", "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([,, name,, attrs,,,, refs]) => ({
            type: "relationship",
            name: name.value,
            attributes: attrs,
            refs: refs,
            loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "rel_attributes", "symbols": [(lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "_", "attributes", "_", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess": ([,, attrs]) => attrs},
    {"name": "rel_entities$ebnf$1", "symbols": []},
    {"name": "rel_entities$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "rel_entity_ref"]},
    {"name": "rel_entities$ebnf$1", "symbols": ["rel_entities$ebnf$1", "rel_entities$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "rel_entities", "symbols": ["rel_entity_ref", "rel_entities$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(r => r[3])]},
    {"name": "rel_entity_ref$ebnf$1", "symbols": ["cardinality"], "postprocess": id},
    {"name": "rel_entity_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity_ref$ebnf$2", "symbols": ["optional_weak"], "postprocess": id},
    {"name": "rel_entity_ref$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity_ref$ebnf$3", "symbols": ["optional_role"], "postprocess": id},
    {"name": "rel_entity_ref$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity_ref", "symbols": ["rel_entity_ref$ebnf$1", "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "rel_entity_ref$ebnf$2", "_", "rel_entity_ref$ebnf$3"], "postprocess":  ([card, , name, ,weak, ,role]) => ({
            type: "entity_ref",
            name: name.value,
            cardinality: card ?? { min: "0", max: "n" },
            weak: weak ?? false,
            role: role ?? null,
            loc: { line: name.line, col: name.col, offset: name.offset }  
        }) },
    {"name": "zero_or_one", "symbols": [(lexer.has("ZERO") ? {type: "ZERO"} : ZERO)], "postprocess": ([token]) => ({ value: token.value })},
    {"name": "zero_or_one", "symbols": [(lexer.has("ONE") ? {type: "ONE"} : ONE)], "postprocess": ([token]) => ({ value: token.value })},
    {"name": "one_or_n", "symbols": [(lexer.has("ONE") ? {type: "ONE"} : ONE)], "postprocess": ([token]) => ({ value: token.value })},
    {"name": "one_or_n", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([typeToken]) => {
            if (typeToken.value === 'n') {
                return { value: typeToken.value };
            }
            throw new Error(`Syntax Error: Expected specialization type 'n', but got '${typeToken.value}' at line ${typeToken.line} col ${typeToken.col}.`);
        } },
    {"name": "optional_weak", "symbols": [(lexer.has("WEAK") ? {type: "WEAK"} : WEAK)], "postprocess": () => true},
    {"name": "optional_role", "symbols": [(lexer.has("STRING") ? {type: "STRING"} : STRING)], "postprocess": ([value]) => value.value},
    {"name": "specialize_command$ebnf$1", "symbols": ["specialize_types"], "postprocess": id},
    {"name": "specialize_command$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "specialize_command", "symbols": [(lexer.has("SPECIALIZE") ? {type: "SPECIALIZE"} : SPECIALIZE), "_", "specialize_command$ebnf$1", "_", "specialize_entity_ref", "_", (lexer.has("GGT") ? {type: "GGT"} : GGT), "_", "specialize_entity_list", "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([command,, notation,, ref,,,, list]) => ({
          type: "specialize",
          ref: ref,
          notation: notation || { type: "t", disjunction: "d" },
          specs: list,
          loc: { line: command.line, col: command.col, offset: command.offset }
        }) },
    {"name": "specialize_types", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "_", "t_or_p", "_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "d_or_c", "_", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess":  ([,, type,,,, disjunction]) => ({
            type: type.value,
            disjunction: disjunction.value
        }) },
    {"name": "t_or_p", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([token]) => {
            if (token.value === 't' || token.value === 'p') {
                return { value: token.value };
            }
            throw new Error(`Syntax Error: Expected specialization type 't' or 'p', but got '${token.value}' at line ${token.line} col ${token.col}.`);
        } },
    {"name": "d_or_c", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([token]) => {
            if (token.value === 'd' || token.value === 'c') {
                return { value: token.value };
            }
            throw new Error(`Syntax Error: Expected specialization type 'd' or 'c', but got '${token.value}' at line ${token.line} col ${token.col}.`);
        } },
    {"name": "specialize_entity_list$ebnf$1", "symbols": []},
    {"name": "specialize_entity_list$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "specialize_entity_ref"]},
    {"name": "specialize_entity_list$ebnf$1", "symbols": ["specialize_entity_list$ebnf$1", "specialize_entity_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "specialize_entity_list", "symbols": ["specialize_entity_ref", "specialize_entity_list$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(r => r[3])]},
    {"name": "specialize_entity_ref", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": ([name]) => ({ type: "ref", name: name.value, loc: { line: name.line, col: name.col, offset: name.offset } })},
    {"name": "specialize_entity_ref", "symbols": ["entity_command"], "postprocess": id},
    {"name": "note_command$ebnf$1", "symbols": ["optional_color"], "postprocess": id},
    {"name": "note_command$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "note_command", "symbols": [(lexer.has("NOTE") ? {type: "NOTE"} : NOTE), "_", (lexer.has("STRING") ? {type: "STRING"} : STRING), "_", "note_command$ebnf$1", "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([_, , string, , color]) => ({
            type: "note",
            value: string.value,
            color: color ?? null,
            loc: { line: string.line, col: string.col, offset: string.offset }
        }) },
    {"name": "optional_color", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": ([value]) => value.value},
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
