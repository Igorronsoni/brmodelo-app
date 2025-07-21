const tokens = [
	{
		regex: /\bentity\b/,
		token: "keyword",
	},
  {
		regex: /\brel\b/,
		token: "keyword",
	},
	{
		regex: /\bID\b/,
		token: "atom",
	},
  {
		regex: /\bCOMPOSED\b/,
		token: "atom",
	},
  {
		regex: />/,
		token: "keyword",
	}
];

export default tokens;
