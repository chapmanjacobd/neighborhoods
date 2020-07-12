const setQueryStringParameter = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);

  const url = decodeURIComponent(`${window.location.pathname}?${params}`);
  window.history.replaceState({}, "", url);

  return url;
};

let defaultS = {
  page: "l",
  country: {},
  column: {},
};

Spruce.store("s", {});

// get s
if (typeof gotSFromURL === "undefined") {
  window.gotSFromURL = true;

  var urlParams = new URLSearchParams(window.location.search);

  let sFromURL = {};
  Object.keys(defaultS).forEach((key, index) => {
    if (urlParams.has(key)) {
      var sParam = JSON.parse(urlParams.get(key));

      if (sParam != null) {
        Object.assign(sFromURL, { [key]: sParam });
      }
    } else {
      Object.assign(sFromURL, { [key]: defaultS[key] });
    }
  });
  Spruce.reset("s", sFromURL);
}

// save s
Object.keys(defaultS).forEach((key, index) => {
  Spruce.watch(`s.${key}`, (old, next) => {
    setQueryStringParameter(key, encodeURIComponent(JSON.stringify(next)));
  });
});

function plural(word, amount) {
  if (amount !== undefined && amount === 1) {
    return word;
  }
  if (!word || typeof word != "string") return word;
  const plural = {
    "(quiz)$": "$1zes",
    "^(ox)$": "$1en",
    "([m|l])ouse$": "$1ice",
    "(matr|vert|ind)ix|ex$": "$1ices",
    "(x|ch|ss|sh)$": "$1es",
    "([^aeiouy]|qu)y$": "$1ies",
    "(hive)$": "$1s",
    "(?:([^f])fe|([lr])f)$": "$1$2ves",
    "(shea|lea|loa|thie)f$": "$1ves",
    sis$: "ses",
    "([ti])um$": "$1a",
    "(tomat|potat|ech|her|vet)o$": "$1oes",
    "(bu)s$": "$1ses",
    "(alias)$": "$1es",
    "(octop)us$": "$1i",
    "(ax|test)is$": "$1es",
    "(us)$": "$1es",
    "([^s]+)$": "$1s",
  };
  const irregular = {
    move: "moves",
    foot: "feet",
    goose: "geese",
    sex: "sexes",
    child: "children",
    man: "men",
    tooth: "teeth",
    person: "people",
  };
  const uncountable = [
    "sheep",
    "fish",
    "deer",
    "moose",
    "series",
    "species",
    "money",
    "rice",
    "information",
    "equipment",
    "bison",
    "cod",
    "offspring",
    "pike",
    "salmon",
    "shrimp",
    "swine",
    "trout",
    "aircraft",
    "hovercraft",
    "spacecraft",
    "sugar",
    "tuna",
    "you",
    "wood",
  ];
  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(word.toLowerCase()) >= 0) {
    return word;
  }
  // check for irregular forms
  for (const w in irregular) {
    const pattern = new RegExp(`${w}$`, "i");
    const replace = irregular[w];
    if (pattern.test(word)) {
      return word.replace(pattern, replace);
    }
  }
  // check for matches using regular expressions
  for (const reg in plural) {
    const pattern = new RegExp(reg, "i");
    if (pattern.test(word)) {
      return word.replace(pattern, plural[reg]);
    }
  }
  return word;
}
