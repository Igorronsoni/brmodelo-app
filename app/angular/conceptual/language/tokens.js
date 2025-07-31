const tokens = [
	{ regex: /\bentity\b/, token: "keyword" },
  { regex: /\bspecialize\b/, token: "keyword" },
	{ regex: /\brel\b/, token: "keyword" },
  { regex: /\bassentity\b/, token: "keyword" },
  { regex: /\bnote\b/, token: "keyword" },
	{ regex: /\bID\b/, token: "keyword" },
	{ regex: /\bCOMPOSED\b/, token: "keyword" },
  { regex: /\bWEAK\b/, token: "keyword" },
	{ regex: />>/, token: "keyword" },
	{ regex: /"(?:[^"\\]|\\.)*?"/, token: "string" },
	{ regex: /'(?:[^'\\]|\\.)*?'/, token: "string" },
];

export default tokens;
