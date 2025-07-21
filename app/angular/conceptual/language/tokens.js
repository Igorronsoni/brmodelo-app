const tokens = [
	{ regex: /\bentity\b/, token: "keyword" },
	{ regex: /\brel\b/, token: "keyword" },
	{ regex: /\bID\b/, token: "atom" },
	{ regex: /\bCOMPOSED\b/, token: "atom" },
	{ regex: />/, token: "keyword" },
	{ regex: /"(?:[^"\\]|\\.)*?"/, token: "string" },
	{ regex: /'(?:[^'\\]|\\.)*?'/, token: "string" },
];

export default tokens;
