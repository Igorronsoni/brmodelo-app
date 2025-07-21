@lexer lexer

main -> declaration (_ declaration):*   {% ([first, rest]) => [first, ...rest.map(r => r[1])] %}
      | null                            {% () => [] %}

declaration -> entity_command   {% id %}
             | rel_command      {% id %}
             | note_command      {% id %}
# COMMANDS
entity_command -> %ENTITY _ %IDENTIFIER _ optional_attributes_block {% ([_, _1, name, _2, attrs_block]) => ({
    type: "entity",
    name: name.value,
    attributes: attrs_block,
    loc: { line: name.line, col: name.col, offset: name.offset } }) %}

rel_command -> %REL _ %IDENTIFIER _ ">" _ %IDENTIFIER _ ";"   {% ([_, _1, fromEntity, _2, _3, _4, toEntity, _5, _6]) => ({
                                                                  type: "relationship",
                                                                  from: fromEntity.value,
                                                                  to: toEntity.value,
                                                                  loc: { line: fromEntity.line, col: fromEntity.col, offset: fromEntity.offset } 
                                                              }) %}

note_command -> %NOTE _ %STRING _ %IDENTIFIER _ ";" {% ([_, _1, string, _2, color, _3, _4]) => ({
                                        type: "note",
                                        value: string.value,
                                        color: color.value,
                                        loc: { line: string.line, col: string.col, offset: string.offset }
                                    }) %}

note_command -> %NOTE _ %STRING _ optional_color {% ([_, _1, string, _2, colorInfo]) => ({
                                        type: "note",
                                        value: string.value,
                                        color: colorInfo.color,
                                        loc: { line: string.line, col: string.col, offset: string.offset }
                                    }) %}

# RULES - ENTITY
optional_attributes_block -> "{" _ attributes _ "}" {% ([_, _1, attrs, _2, _3]) => attrs %}
                           | ";"                    {% () => [] %}

attributes -> attribute_item                {% ([a]) => [a] %}
            | attributes _ attribute_item   {% ([as, _, a]) => [...as, a] %}
            | null                          {% () => [] %}

attribute_item -> attribute_basic _ ";"   {% ([attr, _]) => attr %}
                | attribute_composed      {% id %}
                | attribute_basic         {% id %}

attribute_basic -> %IDENTIFIER _ ID_designator  {% ([name, _, _1]) => ({
                                                    name: name.value,
                                                    type: "id",
                                                    loc: { line: name.line, col: name.col, offset: name.offset }
                                                }) %}
                 | %IDENTIFIER                  {% ([name]) => ({
                                                    name: name.value,
                                                    type: "simple",
                                                    loc: { line: name.line, col: name.col, offset: name.offset }
                                                }) %}

attribute_composed -> %IDENTIFIER _ COMPOSED_designator {% ([name, _, composed_attrs]) => ({
                                                            name: name.value,
                                                            type: "composed",
                                                            attributes: composed_attrs,
                                                            loc: { line: name.line, col: name.col, offset: name.offset }
                                                        }) %}

ID_designator -> "[" _ %ID _ "]"  {% () => true %}

COMPOSED_designator -> "[" _ %COMPOSED _ "]" _ "{" _ composed_attributes _ "}" {% ([_,_1,_2,_3,_4,_5,_6,_7, attrs, _8,_9]) => attrs %}

composed_attributes -> composed_attribute_item                        {% ([a]) => [a] %}
                     | composed_attributes _ composed_attribute_item  {% ([as, _, a]) => [...as, a] %}
                     | null                                           {% () => [] %}

composed_attribute_item -> composed_attribute_basic _ ";"   {% ([attr, _]) => attr %}
                         | composed_attribute_composed      {% id %}
                         | composed_attribute_basic         {% id %} 

composed_attribute_basic -> %IDENTIFIER   {% ([name]) => ({
                                              name: name.value,
                                              type: "composed_att",
                                              loc: { line: name.line, col: name.col, offset: name.offset }
                                          }) %}

composed_attribute_composed -> %IDENTIFIER _ COMPOSED_designator  {% ([name, _, composed_attrs]) => ({
                                                                      name: name.value,
                                                                      type: "composed",
                                                                      attributes: composed_attrs,
                                                                      loc: { line: name.line, col: name.col, offset: name.offset }
                                                                  }) %}

# RULES - RELATIONSHIP

# RULES - NOTE
optional_color -> %IDENTIFIER _ ";"   {% ([color, _, _1]) => ({ color: color.value }) %}
                | ";"                 {% () => ({ color: null }) %}

# RULES - COMMON
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
        REL:            "rel",
        NOTE:            "note",
        ID:             "ID",
        COMPOSED:       "COMPOSED",
        IDENTIFIER:     /[a-zA-Z_][a-zA-Z0-9_]*/,
        STRING:         {
                          match: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
                          value: x => x.substring(1, x.length - 1)
                        },
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
%}