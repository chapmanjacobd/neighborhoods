function searchCity(searchString, items) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchOrigin?input=${searchString}`)
        .then((res) => res.json())
        .then((res) => {
          items.splice(items.indexOf((x) => x.id === 0));
          items.push({
            id: 0,
            n: "Search cities",
            searchResults: res.map((x) => ({
              ...x,
              n: x.displayname,
              u: x.displayname.substring(x.displayname.length - 3).slice(0, -1),
            })),
          });
        });
    } catch (err) {
      console.log(err);
    }
  })();
}

function listCity(city) {
  console.log("listCity");
  return `
    <div>
      <i src="flags/blank.gif" class="flag flag-${city.u.toLowerCase()}"></i>
      ${city.n}
    </div>
  `;
}

function removeCity(cityId) {
  try {
    $store.d.all = $store.d.all.filter((x) => x.id !== cityId);
    $store.s.cities = $store.s.cities.filter((x) => x.id !== cityId);
  } catch (err) {
    console.log(err);
  }
}

function filterItems(filterString, items = []) {
  if (!filterString) return items;

  return matchSorter(items, filterString, {
    keys: ["n", "s", "u", "name"],
  });
}

/**
 * @param {{ id: any; displayname: any; n: any; }} city
 */
async function loadNeighborhoods(city) {
  document.getElementById("loading").classList.add("active");
  if (!$store.d.all.find((x) => x.id === city.id)) {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getNeighborhoods?k=${city.id}`)
        .then((res) => res.json())
        .then((res) => {
          $store.d.all.push({
            id: city.id,
            n: city.displayname || city.n,
            neighborhoods: res.map((x) => ({ ...x, city: city.displayname, cityId: city.id })),
          });
          $store.s.cities = [...$store.s.cities, { id: city.id, displayname: city.displayname }];
        });
    } catch (err) {
      console.log(err);
    }
    document.getElementById("loading").classList.remove("active");
  }
}

async function loadNeighborhoodsMany() {
  document.getElementById("loading").classList.add("active");

  // this will probably cause weird concurrency bugs
  for await (const city of $store.s.cities) {
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
      <div x-data="{ t: false, d: 'pull-right toggle' }">
        <div :class="t ? d + ' active' : d" style="cursor: pointer;" @click.debounce.500="t=!t;
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
  const city = $store.d.all.find((x) => x.id == cityId);
  const n = city.neighborhoods[index];
  $store.d.s.push(n);
}

function removeNeighborhood(n) {
  console.log("removed", n);

  $store.d.s.splice($store.d.s.indexOf((x) => x.n === n));
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

function comparePrintName(neighborhood) {
  return `
  <i src="flags/blank.gif" class="flag flag-${resolve("u", neighborhood).toLowerCase()}"></i>
  <h6 style="padding-left:8px;">${
    resolve("city", neighborhood) + " - " + resolve("n", neighborhood)
  }</h6>
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
    "popd_sum",
    "nightlights",
    "glob_crop",
    "glob_forest",
    "glob_ve",
    "glob_wet",
    "glob_urban",
  ];
  const keys = Object.keys($store.d.s[0] || {}).filter((str) => !hiddenKeys.includes(str));

  return keys
    .map((col) => {
      return `
      <h3>${renameCountryProperties(col)}</h3>
    ${forEachNeighborhood(col)}
  `;
    })
    .join(" ");

  function forEachNeighborhood(col) {
    const neighborhoods = $store.d.s;
    return neighborhoods
      .map((n) => {
        return `
      <div>
        <div style="display: flex; justify-content: center; align-items: baseline;">
          ${comparePrintName(n)}
        </div>

        <li class="table-view-cell media">
          <div class=" media-body">
            ${getColumn([n], col)[0].n}
            <p>${getColumn([n], col)[0].value}</p>
          </div>
        </li>
      </div>`;
      })
      .join(" ");
  }
}
