@lexer lexer

main -> declaration (_ declaration):* {% ([first, rest]) => [first, ...rest.map(r => r[1])] %}
      | null {% () => [] %}

declaration -> entity_command {% id %}
             | rel_command {% id %}

entity_command -> %ENTITY _ %IDENTIFIER _ optional_attributes_block _ ";" {% ([_, _1, name, _2, attrs_block, _3, _4]) => ({
    type: "entity",
    name: name.value,
    attributes: attrs_block
}) %}

optional_attributes_block -> "{" _ attributes _ "}" {% ([_, _1, attrs, _2, _3]) => attrs %}
                           | null {% () => [] %}

attributes -> attribute {% ([a]) => [a] %}
            | attributes _ ";" _ attribute {% ([as, _, _1, _2, a]) => [...as, a] %}
            | attributes _ ";" _         {% ([as, _, _1, _2]) => as %}
            | null                       {% () => [] %}

attribute -> %IDENTIFIER _ ID_designator {% ([name, _, id]) => ({ name: name.value, isID: id }) %}
           | %IDENTIFIER                {% ([name]) => ({ name: name.value, isID: false }) %}

ID_designator -> "[" _ %ID _ "]" {% () => true %}

rel_command -> %REL _ %IDENTIFIER _ ">" _ %IDENTIFIER _ ";" {% ([_, _1, fromEntity, _2, _3, _4, toEntity, _5, _6]) => ({
    type: "rel",
    from: fromEntity.value,
    to: toEntity.value
}) %}


_ -> %WHITESPACE:* {% () => null %}

@{%
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
%}