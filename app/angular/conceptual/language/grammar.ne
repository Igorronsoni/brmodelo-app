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

attribute ->  cardinality:? _ %IDENTIFIER  _ %SEMICOLON                                               {% ([card, , name]) => ({ 
                                                                                                        name: name.value, 
                                                                                                        type: "simple",
                                                                                                        cardinality: card ?? { min: "1", max: "1" },
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}
            | %IDENTIFIER _ %KEY _ %SEMICOLON                                                          {% ([name]) => ({ 
                                                                                                        name: name.value, 
                                                                                                        type: "identifier",
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}
            | %IDENTIFIER _ %COMPOSED  _ %LBRACE _ attributes_composed _ %RBRACE                      {% ([name, _, _1, _2, _3, _4, attrs]) => ({
                                                                                                        name: name.value, 
                                                                                                        type: "composed",
                                                                                                        attributes: attrs ?? [],
                                                                                                        loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                      }) %}

cardinality -> %LPAREN _ zero_or_one _ %COMMA _ one_or_n _ %RPAREN    {% ([, , min, , , , max]) => ({
                                                                          min: min.value,
                                                                          max: max.value
                                                                      }) %} 


attributes_composed -> attribute_composed:*  {% (attrs) => attrs.flat() %}

attribute_composed -> cardinality:? _ %IDENTIFIER _ %SEMICOLON  {% ([card, , name]) => ({
                                                    name: name.value,
                                                    type: "composed_att",
                                                    cardinality: card ?? { min: "1", max: "1" },
                                                    loc: { line: name.line, col: name.col, offset: name.offset }
                                                }) %}

# COMMANDS - ASSENTITY
assentity_command -> %ASSENTITY _ %IDENTIFIER _ %SEMICOLON    {% ([,, name]) => ({
                                                                type: "assentity",
                                                                relationship: name.value,
                                                                loc: { line: name.line, col: name.col, offset: name.offset } 
                                                              }) %}

# COMMANDS - RELATIONSHIP
rel_command -> %REL _ %IDENTIFIER _ rel_attributes:? _ %GGT _ rel_entities _ %SEMICOLON   {% ([,, name,, attrs,,,, refs]) => ({
                                                                                                            type: "relationship",
                                                                                                            name: name.value,
                                                                                                            attributes: attrs ?? [],
                                                                                                            refs: refs,
                                                                                                            loc: { line: name.line, col: name.col, offset: name.offset } 
                                                                                                        }) %}
rel_attributes -> %LBRACE _ attributes _ %RBRACE  {% ([,, attrs]) => attrs %}

rel_entities -> rel_entity_ref (_ %COMMA _ rel_entity_ref):* {% ([first, rest]) => [first, ...rest.map(r => r[3])] %}

rel_entity_ref -> cardinality:? _ %IDENTIFIER _ optional_weak:? _ optional_role:?   {% ([card, , name, ,weak, ,role]) => ({
                                                                                        type: "entity_ref",
                                                                                        name: name.value,
                                                                                        cardinality: card ?? { min: "0", max: "n" },
                                                                                        weak: weak ?? false,
                                                                                        role: role ?? null,
                                                                                        loc: { line: name.line, col: name.col, offset: name.offset }  
                                                                                    }) %}

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
specialize_command -> %SPECIALIZE _ specialize_types:? _ specialize_entity_ref _ %GGT _ specialize_entity_list _ %SEMICOLON  {% ([command,, notation,, ref,,,, list]) => ({
                                                                                                                                type: "specialize",
                                                                                                                                ref: ref,
                                                                                                                                notation: notation || { type: "t", disjunction: "d" },
                                                                                                                                specs: list,
                                                                                                                                loc: { line: command.line, col: command.col, offset: command.offset }
                                                                                                                              }) %}

specialize_types -> %LPAREN _ t_or_p _ %COMMA _ d_or_c _ %RPAREN    {% ([,, type,,,, disjunction]) => ({
                                                                        type: type.value,
                                                                        disjunction: disjunction.value
                                                                    }) %}

t_or_p ->  %IDENTIFIER  {% ([token]) => {
                            if (token.value === 't' || token.value === 'p') {
                                return { value: token.value };
                            }
                            throw new Error(`Syntax Error: Expected specialization type 't' or 'p', but got '${token.value}' at line ${token.line} col ${token.col}.`);
                        } %}

d_or_c ->  %IDENTIFIER  {% ([token]) => {
                            if (token.value === 'd' || token.value === 'c') {
                                return { value: token.value };
                            }
                            throw new Error(`Syntax Error: Expected specialization type 'd' or 'c', but got '${token.value}' at line ${token.line} col ${token.col}.`);
                        } %}

specialize_entity_list -> specialize_entity_ref (_ %COMMA _ specialize_entity_ref):* {% ([first, rest]) => [first, ...rest.map(r => r[3])] %}

specialize_entity_ref ->  %IDENTIFIER         {% ([name]) => ({ type: "ref", name: name.value, loc: { line: name.line, col: name.col, offset: name.offset } }) %}
                        | entity_command      {% id %}


# COMMANDS - NOTE
note_command -> %NOTE _ %STRING _ optional_color:? _ %SEMICOLON {% ([_, , string, , color]) => ({
                                        type: "note",
                                        value: string.value,
                                        color: color ?? null,
                                        loc: { line: string.line, col: string.col, offset: string.offset }
                                    }) %}

optional_color -> %IDENTIFIER {% ([value]) => value.value %}

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
        KEY:             "KEY",
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
%}