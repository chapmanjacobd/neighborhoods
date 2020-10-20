function searchCity(searchString, items) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchOrigin?input=${searchString}`)
        .then((res) => res.json())
        .then((res) => {
          items.splice(items.indexOf((x) => x.id === 0));
          items.unshift({
            id: 0,
            n: "Search cities",
            searchResults: res.map((x) => ({
              ...x,
              n: x.displayname,
              u: x.displayname.substring(x.displayname.length - 3).slice(0, -1),
            })),
          });

          const el = document.querySelector("#selectCitiesAndNeighborhoods");
          el.__x.updateElements(el);
        });
    } catch (err) {
      console.log(err);
    }
  })();
}

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
    keys: ["n", "s", "u", "name"],
  }).slice(0, 20);
}

/**
 * @param {{ id: any; displayname: any; n: any; }} city
 */
async function loadNeighborhoods(country) {
  document.getElementById("loading").classList.add("active");
  if (!this.$store.d.all.find((x) => x.id === country.id)) {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getCities?k=${country.id}`)
        .then((res) => res.json())
        .then((res) => {
          this.$store.d.all.push({
            id: country.id,
            n: country.displayname || country.n,
            cities: res,
          });
        });
    } catch (err) {
      console.log(err);
    }
    document.getElementById("loading").classList.remove("active");
  }
}

async function loadNeighborhoodsMany() {
  document.getElementById("loading").classList.add("active");

  for await (const city of this.$store.s.cities) {
    console.log("loadNeighborhoodsMany", city);
    await loadNeighborhoods(city);
  }

  document.getElementById("loading").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function listNeighborhood(neighborhood, index) {
  if (index == 0) console.log("listNeighborhood", neighborhood.cityId, neighborhood.n);
  return `
    <div>
      <div>
        <i src="flags/blank.gif" class="flag flag-${neighborhood.u.toLowerCase()}"></i>
        ${neighborhood.n}
      </div>
      <div>
        <div :class="t ? d + ' active' : d" style="cursor: pointer;"
        x-data="{ t: false, d: 'pull-right toggle' }"
        @click.debounce.200="
        t=!t;
          t ? addNeighborhood(${neighborhood.cityId}, ${index})
          : removeNeighborhood('${neighborhood.n}')
        ">
          <div class="toggle-handle"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * @param {number} cityId
 * @param {number} index
 */
function addNeighborhood(cityId, index) {
  console.log("addNeighborhood", cityId, index);
  const city = this.$store.d.all.find((x) => x.id == cityId);
  const n = city.neighborhoods[index];
  this.$store.d.s.push(n);
  this.$store.d.s.sort((a, b) => b.interesting - a.interesting);

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

  this.$store.d.s.splice(this.$store.d.s.indexOf((x) => x.n === n));
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

/**
 * @param {string} neighborhood
 */
function comparePrintName(neighborhood) {
  return `
  <i src="flags/blank.gif" class="flag flag-${resolve("u", neighborhood).toLowerCase()}"></i>
  <h5 style="padding-left:8px;">${
    resolve("city", neighborhood) + " - " + resolve("n", neighborhood)
  }</h5>
   `;
}

function compareEveryColumn() {
  const hiddenKeys = [
    "n",
    "u",
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
  ];
  const priority = [
    "interesting",
    "boring",
    "danger",
    "safety",
    "food",
    "public_transport",
    "tourism",
  ].reverse();

  const keys = Object.keys(this.$store.d.s[0] || {})
    .filter((str) => !hiddenKeys.includes(str))
    .sort((a, b) => priority.indexOf(b) - priority.indexOf(a));

  return keys
    .map((col) => {
      return `
      <h3 style="display: flex;justify-content: center;">
        ${renameCountryProperties(col)}
      </h3>
    ${forEachNeighborhood(col)}
  `;
    })
    .join(" ");

  function forEachNeighborhood(col) {
    return this.$store.d.s
      .map((n) => {
        return `
      <div>
        <div style="display: flex; align-items: baseline;">
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
