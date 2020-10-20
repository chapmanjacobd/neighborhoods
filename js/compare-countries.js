function listCity(city) {
  console.log("listCity");
  return `
    <div style="cursor: pointer;">
      <i src="flags/blank.gif" class="flag flag-${city.u.toLowerCase()}"></i>
      ${city.c}
    </div>
  `;
}

function removeCity(cityId) {
  try {
    this.$store.d.all = this.$store.d.all.filter((x) => x.id !== cityId);
    this.$store.s.cities = this.$store.s.cities.filter((x) => x.id !== cityId);
  } catch (err) {
    console.log(err);
  }
}

function filterItems(filterString, items = []) {
  if (!filterString) return items.slice(0, 20);

  return matchSorter(items, filterString, {
    keys: ["n", "s", "u", "c"],
  }).slice(0, 20);
}

async function loadNeighborhoods(country) {
  document.getElementById("loading").classList.add("active");
  if (!this.$store.d.all.find((x) => x.u === country.u)) {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getCities?k=${country.u}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.$store.d.all.push({
            u: country.u,
            n: country.c,
            cities: res,
          });
        });
    } catch (err) {
      console.log(err);
    }
    document.getElementById("loading").classList.remove("active");
    setTimeout(() => (location.href = `#${country.u}`), 50);
  }
}

function listNeighborhood(city) {
  return `
    <div
      style="display: flex; justify-content: space-between;align-items: center;"
    >
      <div>
        <i src="flags/blank.gif" class="flag flag-${city.u.toLowerCase()}"></i>
        ${city.n}
      </div>
      <div
        :class="t ? d + ' active' : d"
        style="cursor: pointer;"
        x-data="{ t: false, d: 'pull-right toggle' }"
        @click.debounce.200="
        t=!t;
          t ? addNeighborhood('${city.u}', ${city.id})
          : removeNeighborhood(${city.id})
        "
      >
        <div class="toggle-handle"></div>
      </div>
    </div>
  `;
}

function addNeighborhood(ISOA2, cityId) {
  console.log("addNeighborhood", ISOA2, cityId);
  const city = this.$store.d.all.find((x) => x.u == ISOA2);
  const n = city.cities.find((x) => x.id == cityId);
  this.$store.d.s.push(n);
  this.$store.d.s.sort(
    (a, b) => b.osm_interesting_interesting_sum_sum - a.osm_interesting_interesting_sum_sum
  );

  // this.$store.s.cities = [...this.$store.s.cities, { id: city.id, displayname: city.displayname }];

  // // remove duplicate cities
  // const result = [];
  // const map = new Map();
  // for (const item of this.$store.s.cities) {
  //   if (!map.has(item.id)) {
  //     map.set(item.id, true); // set any value to Map
  //     result.push(item);
  //   }
  // }
  // this.$store.s.cities = result;
}

function removeNeighborhood(n) {
  console.log("removed", n);

  this.$store.d.s.splice(this.$store.d.s.indexOf((x) => x.id === n));
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

function comparePrintName(city) {
  return `
  <i src="flags/blank.gif" class="flag flag-${resolve("u", city).toLowerCase()}"></i>
  <h5 style="padding-left:8px;">${resolve("c", city) + " - " + resolve("n", city)}</h5>
   `;
}

function compareEveryColumn() {
  const hiddenKeys = [
    "id",
    "n",
    "u",
    "c",
    "s",
    "lat",
    "lon",
    "noise",
    "co_var",
    "interesting_comp",
    "boring_comp",
    "safe_comp",
    "danger_comp",
    "osmn",
    "popc",
    "popc",
    "navw",
    "city",
    "cityId",
    "ppp",
    "popd",
    "nightlights",
    "glob_crop",
    "glob_forest",
    "glob_ve",
    "glob_wet",
    "glob_urban",
    "ghs_gpw_pop_2015__sum_sum",
    "ghs_built_lds__mean_sum",
    "access_50k_mean_sum",
    "navwater2009__mean_sum",
    "dryadv3croplands1992_mean_sum",
    "glwd_2_count_sum",
    "glwd_2_area_sum",
    "glwd_2_perim_sum",
    "globcover_nodata_sum",
    "glwd3_50_100_wetland_sum",
    "glwd3_25_50_wetland_sum",
    "glwd3_0_25_wetland_sum",
    "hcid",
  ];
  const priority = [
    "interesting",
    "boring",
    "danger",
    "safety",
    "food",
    "food_sum",
    "public_transport",
    "public_transport_sum",
    "tourism",
    "tourismcount",
    "flickr2_lowview_count_total_sum",
    "flickr2_medview_count_total_sum",
    "flickr2_highview_count_total_sum",
    "toilets_sum",
    "coastline_100m_count_sum",
    "osm_interesting_interesting_sum_sum",
    "osm_boring_boring_sum",
    "osm_safe_safety_sum",
    "danger_sum",
    "slope100m__mean_sum",
    "gm_ve_v2__mean_sum",
  ].reverse();

  const keys = Object.keys(this.$store.d.s[0] || {})
    .filter((str) => !hiddenKeys.includes(str))
    .sort((a, b) => priority.indexOf(b) - priority.indexOf(a));

  return keys
    .map((col) => {
      return `
      <h3 style="display: flex;justify-content: center;">${renameCountryProperties(col)}</h3>
      ${
        col == "interesting"
          ? `<div class="content-padded">
              <p>
                We use geospatial data to summarize places. For example, what is the minimum number of interesting
                places within any neighborhood in a city? How many interesting places does the most interesting
                neighborhood have? The idea relates to both density and variation in neighborhoods within city
                boundaries.
              </p>
            </div>`
          : ""
      }
    ${forEachNeighborhood(col)}
  `;
    })
    .join(" ");

  function forEachNeighborhood(col) {
    return this.$store.d.s
      .map((n) => {
        return `
      <div>
        <div style="display: flex; align-items: baseline;" class="content-padded" >
          ${comparePrintName(n)}
        </div>

        <li class="table-view-cell media">
          <div class=" media-body">
            <p>${getColumn([n], col)[0].value || "No data found"}</p>
          </div>
        </li>
      </div>`;
      })
      .join(" ");
  }
}
