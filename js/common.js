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
  cities: [],
  neighborhood: {},
};

Spruce.store("s", {});
Spruce.store("d", { all: [], s: [], search: [] });

function JSONParse(text, reviver) {
  try {
    return JSON.parse(text, reviver);
  } catch (ex) {
    return null;
  }
}

// get s
if (typeof gotSFromURL === "undefined") {
  window.gotSFromURL = true;

  var urlParams = new URLSearchParams(window.location.search);

  let sFromURL = {};
  Object.keys(defaultS).forEach((key, index) => {
    if (urlParams.has(key)) {
      var sParam = JSONParse(urlParams.get(key));

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

  R = (R * (100 + Number(percent))) / 100;
  G = (G * (100 + Number(percent))) / 100;
  B = (B * (100 + Number(percent))) / 100;

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

const c = (str) => (str ? str.toLowerCase().replace(/\s/g, "") : "");

// -----------------

function countryDisplay(s) {
  if (!s) return [];

  const sortedBy = [
    "dist",
    "food",
    "public_transport",
    "toilets",
    "tourismcount",
    "flickr2_lowview_count_total_sum",
    "flickr2_medview_count_total_sum",
    "flickr2_highview_count_total_sum",
    "popghs",
    "osm_interesting_interesting_sum_sum",
    "osm_boring_boring_sum",
    "interesting",
    "boring",
    "safety",
    "danger",
    "coastline",
    "noise",
    "rain",
    "tmp",
    "wind",
    "glob_forest",
    "glob_urban",
    "glob_crop",
    "glob_ve",
    "glob_wet",
  ].reverse();

  return Object.entries(s)
    .filter((x) => sortedBy.includes(x[0]))
    .filter((x) => x[1])
    .filter((x) => (typeof x[1] === "object" ? x[1].reduce((a, b) => a + b) !== 0 : true))
    .map((x) => ({
      p: x[0],
      dp: renameCountryProperties(x[0]),
      v: renameCountryValues(x[0], x[1]),
    }))
    .sort((b, a) => sortedBy.indexOf(a.p) - sortedBy.indexOf(b.p));
}

function renameCountryProperties(p) {
  if (p == "big_city") return "Large city";
  if (p == "s") return "State";
  if (p == "noise") return "Noise";
  if (p == "pop_avg") return "Population";
  if (p == "avg_dist") return "Avg city neighborhood to center distance (km)";
  if (p == "dist") return "Distance to city center";
  if (p == "avg_noise") return "Avg Noise (dB)";
  if (p == "pop_max") return "Largest city Population";
  if (p == "rain") return "Rainfall";
  if (p == "co_var") return "co var";
  if (p == "tmp") return "Temperature";
  if (p == "srad") return "Sun";
  if (p == "wind") return "Wind";
  if (p == "interesting") return "Interesting features";
  if (p == "boring") return "Boring features";
  if (p == "safety") return "Safety features";
  if (p == "danger") return "Risk features";
  if (p == "coastline") return "Coastline";
  if (p == "tourismcount") return "Tourism";
  if (p == "public_transport") return "Public transport";
  if (p == "slope_mean") return "Avg slope";
  if (p == "popghs") return "Population (GHS)";
  if (p == "osmpop") return "Population (OSM)";
  if (p == "built") return "Avg Built-up";
  if (p == "groads_count") return "# of Large roads";
  if (p == "groads_avg_length") return "Length of highways";
  if (p == "toilets") return "Public toilets";
  if (p == "food") return "<span class='icon la la-hamburger'></span> Restaurants";
  if (p == "accessibility_to_city") return "Accessibility to city";
  if (p == "glob_urban_min") return "glob urban min";
  if (p == "glob_urban_avg") return "glob urban avg";
  if (p == "glob_urban_max") return "glob urban max";
  if (p == "glob_crop_min") return "glob crop min";
  if (p == "glob_crop_avg") return "glob crop avg";
  if (p == "glob_crop_max") return "glob crop max";
  if (p == "forest_min") return "forest min";
  if (p == "forest_avg") return "forest avg";
  if (p == "forest_max") return "forest max";
  if (p == "glob_ve_min") return "glob ve min";
  if (p == "glob_ve_avg") return "glob ve avg";
  if (p == "glob_ve_max") return "glob ve max";
  if (p == "glob_wet_min") return "glob wet min";
  if (p == "glob_wet_avg") return "glob wet avg";
  if (p == "glob_wet_max") return "glob wet max";
  if (p == "interesting_comp") return "interesting comp";
  if (p == "boring_comp") return "boring comp";
  if (p == "safe_comp") return "safe comp";
  if (p == "danger_comp") return "danger comp";
  if (p == "slope") return "Slope";
  if (p == "elevation") return "Elevation";
  if (p == "osmpopulation_avg") return "Population (OSM)";
  if (p == "built_env") return "Built-up";
  if (p == "osmn") return "osmn";
  if (p == "popc") return "popc";
  if (p == "popd_sum") return "popd sum";
  if (p == "ppp") return "ppp";
  if (p == "nightlights") return "nightlights";
  if (p == "groads") return "groads";
  if (p == "glob_crop") return "glob croplands";
  if (p == "glob_forest") return "glob forest";
  if (p == "glob_ve") return "glob vegetation";
  if (p == "glob_wet") return "glob wetlands";
  if (p == "glob_urban") return "glob urban";
  if (p == "navw") return "navw";
  if (p == "popd") return "popd";
  if (p == "osm_interesting_interesting_sum_sum") return "Total interesting features";
  if (p == "osm_boring_boring_sum") return "Total boring features";
  if (p == "osm_safe_safety_sum") return "Total safety features";
  if (p == "danger_sum") return "Total risky features";
  if (p == "coastline_100m_count_sum") return "coastline 100m Total";
  if (p == "flickr2_lowview_count_total_sum") return "Solo tourists";
  if (p == "flickr2_medview_count_total_sum") return "Family tourists";
  if (p == "flickr2_highview_count_total_sum") return "Celebrity tourists";
  if (p == "public_transport_sum") return "Total public transport";
  if (p == "slope100m__mean_sum") return "Total slope100m  ";
  if (p == "ghs_gpw_pop_2015__sum_sum") return "ghs gpw pop 2015  sum sum";
  if (p == "ghs_built_lds__mean_sum") return "Total ghs built lds  ";
  if (p == "toilets_sum") return "toilets sum";
  if (p == "food_sum") return "food sum";
  if (p == "access_50k_mean_sum") return "access Total 50k ";
  if (p == "navwater2009__mean_sum") return "Total navwater2009  ";
  if (p == "globcover_urban_sum") return "globcover urban sum";
  if (p == "globcover_irrigated_cropland_sum") return "globcover irrigated cropland sum";
  if (p == "globcover_rainfed_cropland_sum") return "globcover rainfed cropland sum";
  if (p == "globcover_mosiac_cropland_sum") return "globcover mosiac cropland sum";
  if (p == "dryadv3croplands1992_mean_sum") return "Total dryadv3croplands1992 ";
  if (p == "globcover_semideciduous_sum") return "globcover semideciduous sum";
  if (p == "globcover_closed_needleleaved_sum") return "globcover closed needleleaved sum";
  if (p == "globcover_shrubland_sum") return "globcover shrubland sum";
  if (p == "globcover_herbaceous_vegetation_sum") return "globcover herbaceous vegetation sum";
  if (p == "globcover_mosiac_vegetation_sum") return "globcover mosiac vegetation sum";
  if (p == "globcover_bare_sum") return "globcover bare sum";
  if (p == "gm_ve_v2__mean_sum") return "gm ve Total v2  ";
  if (p == "globcover_regularly_flooded_forest_sum")
    return "globcover regularly flooded forest sum";
  if (p == "globcover_permanently_flooded_forest_sum")
    return "globcover permanently flooded forest sum";
  if (p == "globcover_marsh_sum") return "globcover marsh sum";
  if (p == "globcover_water_sum") return "globcover water sum";
  if (p == "hotels_com_price_avg") return "hotels com price avg";
  if (p == "hotels_com_price_min") return "hotels com price min";
  if (p == "hotels_com_count") return "hotels com count";
  if (p == "hcid") return "hcid";
  if (p == "hc_count") return "hc count";
  // console.log(`if (p == "${p}") return "${p.replace(/_/g,' ')}";`);

  return p;
}

function renameCountryValues(p, v) {
  if (!v) return "";
  if (typeof v == "string") return v;

  if (v.length == 3) return minMaxChart(p, v);
  if (v.length == 12) return monthChart(p, v);

  if (p == "dist") return Math.floor(v / 1000) + " km";
  if (p == "noise") return v + " (dB)";
  if (p == "food") return singleValueChart(p, v);
  if (typeof v == "number") return singleValueChart(p, v);

  return v;

  function singleValueChart(p, v) {
    const maximum = getMaximum();
    const P = Math.max(0, (v / maximum) * 100);

    return `
      <div style="display:flex; justify-content: space-between;">
        <p>${(v || 0).toLocaleString()}</p>
      </div>
      <div style="display: -webkit-box;">
        <div class="chart" style="width: ${P}%;background: ${shadeColor(rbcl, -10)};"></div>
      </div>
    `;

    function getMaximum() {
      if (p == "public_transport") return 20;
      if (p == "co_var") return 80000;
      if (p == "interesting") return 400;
      if (p == "boring") return 300;
      if (p == "safety") return 4000;
      if (p == "danger") return 800;
      if (p == "coastline") return 100;
      if (p == "tourismcount") return 8000;
      if (p == "slope_mean") return 20545;
      if (p == "popghs") return 60410;
      if (p == "osmpop") return 3029485;
      if (p == "built") return 1242571;
      if (p == "groads_count") return 30;
      if (p == "groads_avg_length") return 50;
      if (p == "toilets") return 30;
      if (p == "food") return 40;
      if (p == "elevation") return 800;
      if (p == "popc") return 15795;
      if (p == "popd_sum") return 19632;
      if (p == "osm_interesting_interesting_sum_sum") return 910695;
      if (p == "osm_boring_boring_sum") return 1424238;
      if (p == "flickr2_lowview_count_total_sum") return 6014;
      if (p == "flickr2_medview_count_total_sum") return 6675;
      if (p == "flickr2_highview_count_total_sum") return 232;

      // console.log(`if (p == "${p}") return ${ Math.floor(v /.7)};`)

      return v;
    }
  }

  function minMaxChart(p, v) {
    const maximum = getMaximum();
    const midP = v.map((x) => Math.max(0, (x / maximum) * 100));

    return `
      <div style="display:flex; justify-content: space-between;">
        <p>${(v[1] || 0).toLocaleString()}</p>
        <p>${(v[2] || 0).toLocaleString()}</p>
      </div>
      <div style="display: -webkit-box;">
        <div class="chart" style="width: ${midP[0]}%;"></div>
        <div class="chart" style="width: ${midP[1]}%;background: ${shadeColor(rbcl, -20)};"></div>
        <div class="chart" style="width: ${midP[2]}%;background: ${shadeColor(rbcl, 30)};"></div>
      </div>
    `;

    function getMaximum() {
      if (p == "co_var") return 80000;
      if (p == "interesting") return 8000;
      if (p == "boring") return 5000;
      if (p == "safety") return 8000;
      if (p == "danger") return 16000;
      if (p == "coastline") return 100;
      if (p == "tourismcount") return 8000;
      if (p == "public_transport") return 250;
      if (p == "slope_mean") return 20545;
      if (p == "popghs") return 60410;
      if (p == "osmpop") return 3029485;
      if (p == "built") return 1242571;
      if (p == "groads_count") return 30;
      if (p == "groads_avg_length") return 120;
      if (p == "toilets") return 80;
      if (p == "food") return 100;
      if (p == "accessibility_to_city") return 1742;
      if (p == "glob_urban_min") return 0;
      if (p == "glob_urban_avg") return 25;
      if (p == "glob_urban_max") return 142;
      if (p == "glob_crop_min") return 245;
      if (p == "glob_crop_avg") return 367;
      if (p == "glob_crop_max") return 447;
      if (p == "forest_min") return 130;
      if (p == "forest_avg") return 270;
      if (p == "forest_max") return 425;
      if (p == "glob_ve_min") return 191;
      if (p == "glob_ve_avg") return 372;
      if (p == "glob_ve_max") return 491;
      if (p == "glob_wet_min") return 15;
      if (p == "glob_wet_avg") return 200;
      if (p == "glob_wet_max") return 584;

      if (p == "slope") return 5901;
      if (p == "built_env") return 57360;
      if (p == "ppp") return 1338;

      // console.log(`if (p == "${p}") return ${ Math.floor(Math.max(...v) /.7)};`)

      return Math.max(...v);
    }
  }

  function monthChart(p, v) {
    const low = v.map((a) => a[0]);
    const mid = v.map((a) => a[1]);
    const upp = v.map((a) => a[2]);

    const avg = (mid.reduce((a, b) => a + b) / 12).toFixed(0);
    const maximum = getMaximum();
    const midP = mid.map((x) => (x / Number(maximum)) * 100);
    const uppP = upp.map((x) => (x / Number(maximum)) * 100);
    const lowP = low.map((x) => (x / Number(maximum)) * 100);

    return `
    <ul class="sparklist">
        <li>
         <span class="sparkline" style="top: 2rem;">
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[0]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[1]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[2]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[3]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[4]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[5]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[6]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[7]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[8]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[9]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[10]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #eee;height: ${uppP[11]}%;"> </span> </span>
          </span>
          <!-- Average: ${avg} -->
          <span class="sparkline">
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[0]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[1]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[2]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[3]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[4]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[5]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[6]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[7]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[8]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[9]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[10]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: ${rbcl};height: ${midP[11]}%;"> </span> </span>
          </span>
          <span class="sparkline" style="top: -2rem;">
            <span class="index"><span class="count" style="background: #444;height: ${lowP[0]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[1]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[2]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[3]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[4]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[5]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[6]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[7]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[8]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[9]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[10]}%;">  </span> </span>
            <span class="index"><span class="count" style="background: #444;height: ${lowP[11]}%;"> </span> </span>
          </span>
        </li>
    </ul>
    `;

    function getMaximum() {
      if (p == "rain") return 160;
      if (p == "tmp") return 2400;
      if (p == "srad") return 15000;
      if (p == "wind") return 60000;

      return Math.max(...mid);
    }
  }
}

function getData() {
  return { items: [], filterString: "", s: {} };
}

function getColumn(items, column) {
  if (!items) return [];
  if (!column) return [];
  return items
    .map((x) => {
      return {
        col: plural(renameCountryProperties(column), 2),
        country: x.c,
        city: x.n,
        id: x.cityId,
        n: x.n,
        u: x.u,
        v: x[column],
        value: renameCountryValues(column, x[column]),
      };
    })
    .sort((b, a) => niceSum(a.v) - niceSum(b.v));
}

function niceSum(val) {
  if (!val) return val;
  if (val[1] == null) return val;
  if (val[1].length > 1 && val[2].length > 1)
    return Number(
      Math.floor(val[1].reduce((s, c) => s + c) / val[1].length) +
        "." +
        Math.floor(val[2].reduce((s, c) => s + c) / val[2].length)
          .toString()
          .padStart(10, "0")
    );
  if (val[1].length > 1) return val[1].reduce((s, c) => s + c) / val[1].length;
  if (val[1] && val[2])
    return Number(Math.floor(val[1]) + "." + Math.floor(val[2]).toString().padStart(10, "0"));
  if (val[1]) return val[1];
  if (isIterable(val)) return Math.max(...val);

  return val;
}

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}
