const tokens = [
  {
    regex: "\\bentity\\b",
    token: "keyword"
  },
  {
    regex: "\\bPK\\b",
    token: "atom"
  },
  {
    regex: "//.*",
    token: "comment"
  },
];

export default tokens;
