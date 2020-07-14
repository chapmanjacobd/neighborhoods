function getData() {
  return { items: [], filterString: "", s: {} };
}

function getCountry(items, country) {
  return items.filter((i) => i.n === country)[0];
}

function getColumn(items, column) {
  if (!items) return [];
  if (!column) return [];
  return items.map((x) => {
    return {
      col: plural(renameCountryProperties(column), 2),
      cityId: x.cityId,
      n: x.n,
      u: x.u,
      v: x[column],
      value: renameCountryValues(column, x[column]),
    };
  });
}

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
  if (p == "glob_crop") return "glob crop";
  if (p == "glob_forest") return "glob forest";
  if (p == "glob_ve") return "glob ve";
  if (p == "glob_wet") return "glob wet";
  if (p == "glob_urban") return "glob urban";
  if (p == "navw") return "navw";
  if (p == "popd") return "popd";

  // console.log(`if (p == "${p}") return "${p.replace(/_/g,' ')}";`);

  return p;
}

function itemR(item) {
  return `
    <a class="push-right">
    <i src="flags/blank.gif" class="flag flag-${item.u.toLowerCase()}"></i>
        ${item.n}
    </a>
`;
}

const c = (str) => (str ? str.toLowerCase().replace(/\s/g, "") : "");

function filterItems(filterString, items) {
  if (!filterString) return items;

  console.log("filter", items);

  return matchSorter(items, filterString, {
    keys: ["n", "s", "u", "name"],
  });
}

function searchCity(searchString, items) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchOrigin?input=${searchString}`)
        .then((res) => res.json())
        .then((res) =>
          items.push(
            ...res.map((x) => ({
              ...x,
              n: x.displayname,
              u: x.displayname.substring(x.displayname.length - 3).slice(0, -1),
            }))
          )
        );
    } catch (err) {
      console.log(err);
    }
  })();
}

function loadCity(item, items) {
  document.getElementById("loading").classList.add("active");
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getNeighborhoods?k=${item.id}`)
        .then((res) => res.json())
        .then((res) => {
          items.splice(0);
          items.push(...res.map((x) => ({ ...x, city: item.displayname, cityId: item.id })));
          $store.s.city = { id: item.id, n: item.displayname || item.n };
        });
    } catch (err) {
      console.log(err);
    }

    document.getElementById("loading").classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  })();
}
