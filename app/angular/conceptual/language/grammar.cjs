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
        WEAK:           "weak",
        IDENTIFIER:     /[a-zA-Z_][a-zA-Z0-9_]*/,
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
        GT:             ">",
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
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([name]) => ({ 
          name: name.value, 
          type: "simple",
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("LBRACK") ? {type: "LBRACK"} : LBRACK), "_", (lexer.has("ID") ? {type: "ID"} : ID), "_", (lexer.has("RBRACK") ? {type: "RBRACK"} : RBRACK), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([name]) => ({ 
          name: name.value, 
          type: "id",
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "attribute", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("LBRACK") ? {type: "LBRACK"} : LBRACK), "_", (lexer.has("COMPOSED") ? {type: "COMPOSED"} : COMPOSED), "_", (lexer.has("RBRACK") ? {type: "RBRACK"} : RBRACK), "_", (lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "_", "attributes_composed", "_", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess":  ([name, _, _1, _2, _3, _4, _5, _6, _7, _8, attrs]) => ({
          name: name.value, 
          type: "composed",
          attributes: attrs ?? [],
          loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "attributes_composed$ebnf$1", "symbols": []},
    {"name": "attributes_composed$ebnf$1", "symbols": ["attributes_composed$ebnf$1", "attribute_composed"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes_composed", "symbols": ["attributes_composed$ebnf$1"], "postprocess": (attrs) => attrs.flat()},
    {"name": "attribute_composed", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([name]) => ({
            name: name.value,
            type: "composed_att",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "assentity_command", "symbols": [(lexer.has("ASSENTITY") ? {type: "ASSENTITY"} : ASSENTITY), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "_", "attributes", "_", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess":  ([,, name,,,, attrs,,]) => ({
          type: "assentity",
          name: name.value,
          attributes: attrs,
          loc: { line: name.line, col: name.col, offset: name.offset 
        } }) },
    {"name": "rel_command", "symbols": [(lexer.has("REL") ? {type: "REL"} : REL), "_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", (lexer.has("GGT") ? {type: "GGT"} : GGT), "_", "rel_entity", "_", (lexer.has("GT") ? {type: "GT"} : GT), "_", "rel_entity", "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([_, _1, name, _2, _3, _4, fromEntity, _5, _6, _7, toEntity]) => ({
            type: "relationship",
            name: name.value,
            from: fromEntity,
            to: toEntity,
            loc: { line: name.line, col: name.col, offset: name.offset } 
        }) },
    {"name": "rel_entity$ebnf$1", "symbols": ["optional_weak"], "postprocess": id},
    {"name": "rel_entity$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity$ebnf$2", "symbols": ["optional_role"], "postprocess": id},
    {"name": "rel_entity$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_", "rel_cardinality", "_", "rel_entity$ebnf$1", "_", "rel_entity$ebnf$2"], "postprocess":  ([name, , card, , weak, , role]) => ({
            name: name.value,
            type: "identifier",
            cardinality: card.value,
            weak: weak ?? false,
            role: role ?? "",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "rel_entity$ebnf$3", "symbols": ["optional_weak"], "postprocess": id},
    {"name": "rel_entity$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity$ebnf$4", "symbols": ["optional_role"], "postprocess": id},
    {"name": "rel_entity$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rel_entity", "symbols": ["entity_command", "_", "rel_cardinality", "_", "rel_entity$ebnf$3", "_", "rel_entity$ebnf$4"], "postprocess":  ([entity, , card, , weak, , role]) => ({
            entity: entity,
            type: "entity",
            cardinality: card.value,
            weak: weak ?? false,
            role: role ?? "",
            loc: { line: name.line, col: name.col, offset: name.offset }
        }) },
    {"name": "rel_cardinality", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "_", "rel_cardinal_pair", "_", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": ([, , pair]) => ({ value: pair })},
    {"name": "rel_cardinal_pair", "symbols": ["zero_or_one", "_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "one_or_n"], "postprocess": ([left, , , , right]) => `${left.value},${right.value}`},
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
    {"name": "specialize_command$ebnf$1", "symbols": ["specialize_notation"], "postprocess": id},
    {"name": "specialize_command$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "specialize_command", "symbols": [(lexer.has("SPECIALIZE") ? {type: "SPECIALIZE"} : SPECIALIZE), "_", "specialize_entity_ref", "_", "specialize_command$ebnf$1", "_", (lexer.has("GGT") ? {type: "GGT"} : GGT), "specialize_entity_list", "_", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  ([command, _1, ref, _2, notation, _3, _4, list]) => ({
            type: "specialization",
            ref: ref,
            notation: notation || { type: "t", disjunction: "d" },
            specs: list,
            loc: { line: command.line, col: command.col, offset: command.offset }
        }) },
    {"name": "specialize_entity_list$ebnf$1", "symbols": []},
    {"name": "specialize_entity_list$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "specialize_entity_ref"]},
    {"name": "specialize_entity_list$ebnf$1", "symbols": ["specialize_entity_list$ebnf$1", "specialize_entity_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "specialize_entity_list", "symbols": ["specialize_entity_ref", "specialize_entity_list$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(r => r[3])]},
    {"name": "specialize_entity_ref", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess": ([name]) => ({ type: "ref", name: name.value, loc: { line: name.line, col: name.col, offset: name.offset } })},
    {"name": "specialize_entity_ref", "symbols": ["entity_command"], "postprocess": id},
    {"name": "specialize_notation", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "_", "specialize_type", "_", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "_", "specialize_disjunction", "_", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess":  ([_, _1, type, _2, _3, _4, disjunction, _5, _6]) => ({
          type: type.type,
          disjunction: disjunction.disjunction
        }) },
    {"name": "specialize_type", "symbols": [(lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER)], "postprocess":  ([typeToken]) => {
            if (typeToken.value === 't' || typeToken.value === 'p') {
                return { type: typeToken.value };
            }
            throw new Error(`Syntax Error: Expected specialization type 't' or 'p', but got '${typeToken.value}' at line ${typeToken.line} col ${typeToken.col}.`);
        } },
    {"name": "specialize_disjunction", "symbols": ["_", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), "_"], "postprocess":  ([_, disjunctionToken, _1]) => {
            if (disjunctionToken.value === 'd' || disjunctionToken.value === 'c') {
                return { disjunction: disjunctionToken.value };
            }
            throw new Error(`Syntax Error: Expected specialization disjunction 'd' or 'c', but got '${disjunctionToken.value}' at line ${disjunctionToken.line} col ${disjunctionToken.col}.`);
        } },
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
