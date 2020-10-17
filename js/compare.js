function searchCity(searchString) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchOrigin?input=${searchString}`)
        .then((res) => res.json())
        .then((res) => {
          console.log($store.d.all);
          console.log($store.d.s);
          $store.d.all.splice($store.d.all.indexOf((x) => x.id === 0));
          $store.d.all.push({
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
      <div>
        <i src="flags/blank.gif" class="flag flag-${city.u.toLowerCase()}"></i>
        ${city.n}
      </div>
      <div x-data="{ t: false, d: 'pull-right toggle' }">
        <div :class="t ? d + ' active' : d" style="cursor: pointer;" @click="t=!t">
          <div class="toggle-handle"></div>
        </div>
      </div>
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
          $store.s.cities = [...$store.s.cities, city];
        });
    } catch (err) {
      console.log(err);
    }
  }

  document.getElementById("loading").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  if (index == 1) console.log("listNeighborhood", neighborhood.cityId, neighborhood.n);
  return `
    <div>
      <div>
        <i src="flags/blank.gif" class="flag flag-${neighborhood.u.toLowerCase()}"></i>
        ${neighborhood.n}
      </div>
      <div x-data="{ t: ${autoSelectNeighborhoods()}, d: 'pull-right toggle' }">
        <div :class="t ? d + ' active' : d" style="cursor: pointer;" @click.debounce.500="t=!t;
        t ? addNeighborhood(${neighborhood.cityId}, ${index})
          : removeNeighborhood('${neighborhood.n}')
          ">
          <div class="toggle-handle"></div>
        </div>
      </div>
    </div>
  `;

  function autoSelectNeighborhoods() {
    if (index < 10 && Math.random() >= 0.75) {
      addNeighborhood(neighborhood.cityId, index);
      return "true";
    }
    return "false";
  }
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
