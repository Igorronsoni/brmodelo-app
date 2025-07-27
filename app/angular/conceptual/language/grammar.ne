@lexer lexer

main -> declaration (_ declaration):*   {% ([first, rest]) => [first, ...rest.map(r => r[1])] %}
      | null                            {% () => [] %}

declaration ->  entity_command     {% id %}
              | assentity_command  {% id %}
              | rel_command        {% id %}
              | note_command       {% id %}
              | specialize_command {% id %}

# COMMANDS - ENTITY
entity_command -> %ENTITY _ %IDENTIFIER _ %LBRACE _ attributes _ %RBRACE {% ([,, name,,,, attrs,,]) => ({
                                                                            type: "entity",
                                                                            name: name.value,
                                                                            attributes: attrs,
                                                                            loc: { line: name.line, col: name.col, offset: name.offset 
                                                                          } }) %}

attributes -> attribute:*  {% (attrs) => attrs.flat() %}

attribute ->  %IDENTIFIER _ %SEMICOLON                                                                {% ([name]) => ({ 
                                                                                                        name: name.value, 
                                                                                                        type: "simple",
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}
            | %IDENTIFIER _ %LBRACK _ %ID _ %RBRACK _ %SEMICOLON                                      {% ([name]) => ({ 
                                                                                                        name: name.value, 
                                                                                                        type: "id",
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}
            | %IDENTIFIER _ %LBRACK _ %COMPOSED _ %RBRACK _ %LBRACE _ attributes_composed _ %RBRACE   {% ([name, _, _1, _2, _3, _4, _5, _6, _7, _8, attrs]) => ({
                                                                                                        name: name.value, 
                                                                                                        type: "composed",
                                                                                                        attributes: attrs ?? [],
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}

attributes_composed -> attribute_composed:*  {% (attrs) => attrs.flat() %}

attribute_composed -> %IDENTIFIER _ %SEMICOLON  {% ([name]) => ({
                                                    name: name.value,
                                                    type: "composed_att",
                                                    loc: { line: name.line, col: name.col, offset: name.offset }
                                                }) %}

# COMMANDS - ASSENTITY
assentity_command -> %ASSENTITY _ %IDENTIFIER _ %LBRACE _ attributes _ %RBRACE {% ([,, name,,,, attrs,,]) => ({
                                                                                  type: "assentity",
                                                                                  name: name.value,
                                                                                  attributes: attrs,
                                                                                  loc: { line: name.line, col: name.col, offset: name.offset 
                                                                                } }) %}

# COMMANDS - RELATIONSHIP
rel_command -> %REL _ %IDENTIFIER _ %GGT _ rel_entity _ %GT _ rel_entity _ %SEMICOLON   {% ([_, _1, name, _2, _3, _4, fromEntity, _5, _6, _7, toEntity]) => ({
                                                                                            type: "relationship",
                                                                                            name: name.value,
                                                                                            from: fromEntity,
                                                                                            to: toEntity,
                                                                                            loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                        }) %}

rel_entity -> %IDENTIFIER _ rel_cardinality _ optional_weak:? _ optional_role:?     {% ([name, , card, , weak, , role]) => ({
                                                                                        name: name.value,
                                                                                        type: "identifier",
                                                                                        cardinality: card.value,
                                                                                        weak: weak ?? false,
                                                                                        role: role ?? "",
                                                                                        loc: { line: name.line, col: name.col, offset: name.offset }
                                                                                    }) %}
            | entity_command _ rel_cardinality _ optional_weak:? _ optional_role:?  {% ([entity, , card, , weak, , role]) => ({
                                                                                        entity: entity,
                                                                                        type: "entity",
                                                                                        cardinality: card.value,
                                                                                        weak: weak ?? false,
                                                                                        role: role ?? "",
                                                                                        loc: { line: name.line, col: name.col, offset: name.offset }
                                                                                    }) %}

rel_cardinality -> %LPAREN _ rel_cardinal_pair _ %RPAREN  {% ([, , pair]) => ({ value: pair }) %}

rel_cardinal_pair -> zero_or_one _ %COMMA _ one_or_n {% ([left, , , , right]) => `${left.value},${right.value}` %}

zero_or_one ->  %ZERO {% ([token]) => ({ value: token.value }) %}
              | %ONE  {% ([token]) => ({ value: token.value }) %}

one_or_n ->  %ONE {% ([token]) => ({ value: token.value }) %}
           | %IDENTIFIER {% ([typeToken]) => {
                                                if (typeToken.value === 'n') {
                                                    return { value: typeToken.value };
                                                }
                                                throw new Error(`Syntax Error: Expected specialization type 'n', but got '${typeToken.value}' at line ${typeToken.line} col ${typeToken.col}.`);
                                            } %}
optional_weak -> %WEAK {% () => true %}

optional_role -> %STRING {% ([value]) => value.value %}

# COMMANDS - SPECIALIZE
specialize_command -> %SPECIALIZE _ %IDENTIFIER _ specialize_relationship _ ";" {% ([_, _1, string, _2, rel, _3, _4]) => ({
                                                                          type: "specialization",
                                                                          relationship: {
                                                                            type: rel.type,
                                                                            disjunction: rel.disjunction
                                                                          },
                                                                          loc: { line: string.line, col: string.col, offset: string.offset }
                                                                      }) %}


specialize_relationship -> "(" _ specialize_type _  "," _ specialize_disjunction _ ")" {% ([_, _1, type, _2, _3, _4, disjunction, _5, _6]) => ({
                                                                                  type: type.type,
                                                                                  disjunction: disjunction.disjunction
                                                                                }) %}
                          | null                                              {% ([_]) => ({
                                                                                    type: "t",
                                                                                    disjunction: "d"
                                                                                }) %}

specialize_type -> %IDENTIFIER {% ([typeToken]) => {
    if (typeToken.value === 't' || typeToken.value === 'p') {
        return { type: typeToken.value };
    }
    throw new Error(`Syntax Error: Expected specialization type 't' or 'p', but got '${typeToken.value}' at line ${typeToken.line} col ${typeToken.col}.`);
} %}

specialize_disjunction -> _ %IDENTIFIER _ {% ([_, disjunctionToken, _1]) => {
    if (disjunctionToken.value === 'd' || disjunctionToken.value === 'c') {
        return { disjunction: disjunctionToken.value };
    }
    throw new Error(`Syntax Error: Expected specialization disjunction 'd' or 'c', but got '${disjunctionToken.value}' at line ${disjunctionToken.line} col ${disjunctionToken.col}.`);
} %}

note_command -> %NOTE _ %STRING _ optional_color {% ([_, _1, string, _2, colorInfo]) => ({
                                        type: "note",
                                        value: string.value,
                                        color: colorInfo.color,
                                        loc: { line: string.line, col: string.col, offset: string.offset }
                                    }) %}


# RULES - NOTE
optional_color -> %IDENTIFIER _ ";"   {% ([color, _, _1]) => ({ color: color.value }) %}
                | ";"                 {% () => ({ color: null }) %}



optional_semicolon -> ";"   {% () => null %}
                    | null  {% () => null %}

_ -> %WHITESPACE:*  {% () => null %}

@{%
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
%}