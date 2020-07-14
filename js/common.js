const setQueryStringParameter = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);

  const url = decodeURIComponent(`${window.location.pathname}?${params}`);
  window.history.pushState({}, "", url);

  return url;
};

let defaultS = {
  page: "l",
  column: {},
  country: {},
  city: {},
  neighborhood: {},
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

      if (sParam != "undefined" && sParam != null) {
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
//

function countryDisplay(s) {
  if (!s) return [];

  const sortedBy = [
    "dist",
    "food",
    "public_transport",
    "toilets",
    "popghs",
    "interesting",
    "boring",
    "safety",
    "danger",
    "coastline",
  ].reverse();

  return Object.entries(s)
    .filter(
      (x) =>
        ![
          "lon",
          "lat",
          "u",
          "c",
          "n",
          "s",
          "id",
          "big_city",
          "co_var",
          "accessibility_to_city",
          "navw",
          "glob_urban_min",
          "glob_urban_avg",
          "glob_urban_max",
          "glob_crop_min",
          // "glob_crop_avg",
          "glob_crop_max",
          "forest_min",
          "nightlights",
          "cityId",
          "forest_avg",
          "forest_max",
          "glob_ve_min",
          "glob_ve_avg",
          "glob_ve_max",
          "glob_wet_min",
          "glob_wet_avg",
          "glob_wet_max",
          "interesting_comp",
          "boring_comp",
          "safe_comp",
          "danger_comp",
          "osmn",
          "popd",
          "rain",
          "tmp",
          "srad",
          "wind",
        ].includes(x[0])
    )
    .filter((x) => x[1])
    .filter((x) => (typeof x[1] === "object" ? x[1].reduce((a, b) => a + b) !== 0 : true))
    .map((x) => ({
      p: x[0],
      dp: renameCountryProperties(x[0]),
      v: renameCountryValues(x[0], x[1]),
    }))
    .sort((b, a) => sortedBy.indexOf(a.p) - sortedBy.indexOf(b.p));
}

//

function stripHTML(text) {
  if (!text) return "";
  if (typeof text !== "string") return text;
  return text
    .replace(/<style[^>]*>.*<\/style>/gm, "")
    .replace(/<script[^>]*>.*<\/script>/gm, "")
    .replace(/<[^>]+>/gm, "")
    .replace(/([\r\n]+ +)+/gm, "");
}

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

// .sort(fieldSort(["Stat", "-down", "-Px"]))
function fieldSort(fields) {
  var dir = [],
    i,
    l = fields.length;
  fields = fields.map(function (o, i) {
    if (o[0] === "-") {
      dir[i] = -1;
      o = o.substring(1);
    } else {
      dir[i] = 1;
    }
    return o;
  });

  return function (a, b) {
    for (i = 0; i < l; i++) {
      var o = fields[i];
      if (a[o] > b[o]) return dir[i];
      if (a[o] < b[o]) return -dir[i];
    }
    return 0;
  };
}

console.log(
  "%chello",
  [
    'background-image: url("https://unli.xyz/unli.png")',
    "background-size: cover",
    "color: #fff",
    "padding: 10px 20px",
    "line-height: 35px",
    "width : 70px",
    "height : 70px",
    "border : 5px solid black",
  ].join(";")
);

const colors = ["#FF8E8E", "#E994AB", "#7BA7E1"];
const rbcl = colors[Math.floor(Math.random() * colors.length)];

function shadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function resolve(path, obj = "", separator = ".") {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}
