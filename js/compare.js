function getCountry(items, country) {
  return items.filter((i) => i.n === country)[0];
}

function itemR(cityId, item, index) {
  return `
    <div>
      <div>
        <i src="flags/blank.gif" class="flag flag-${item.u.toLowerCase()}"></i>
        ${item.n}
      </div>
      <div x-data="{ t: ${
        index < 10 && Math.random() >= 0.75 ? addNeighborhood(cityId, index) + "true" : "false"
      }, d: 'pull-right toggle' }">
        <div :class="t ? d + ' active' : d" style="cursor: pointer;" @click="t=!t;
        t ? addNeighborhood(${cityId}, ${index}) : removeNeighborhood('${item.n}');
        console.log(${item.id})">
          <div class="toggle-handle"></div>
        </div>
      </div>
    </div>
  `;
}

function addNeighborhood(cityId, index) {
  console.log("wioo", cityId, index);

  $store.d.s.push($store.d.all.find((x) => x.id == cityId).neighborhoods[index]);
}

function removeNeighborhood(n) {
  console.log("wioo", n);

  $store.d.s.splice($store.d.s.indexOf((x) => x.n === n));
}

function filterItems(filterString, items) {
  if (!filterString) return items;

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

function searchCityMany(searchString) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchOrigin?input=${searchString}`)
        .then((res) => res.json())
        .then((res) => {
          $store.d.all.splice($store.d.all.indexOf((x) => x.id === 0));
          $store.d.all.push({
            id: 0,
            n: "Search cities",
            neighborhoods: res.map((x) => ({
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

/**
 * @param {{ id: any; displayname: any; n: any; }} city
 */
function loadNeighborhoods(city) {
  document.getElementById("loading").classList.add("active");
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getNeighborhoods?k=${city.id}`)
        .then((res) => res.json())
        .then((res) => {
          $store.d.all.splice($store.d.s.indexOf((x) => x.id === city.id));
          $store.d.all.push({
            id: city.id,
            n: city.displayname || city.n,
            neighborhoods: res.map((x) => ({ ...x, city: city.displayname, cityId: city.id })),
          });
        });
    } catch (err) {
      console.log(err);
    }

    document.getElementById("loading").classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  })();
}

function loadNeighborhoodsMany() {
  document.getElementById("loading").classList.add("active");

  // this will probably cause weird concurrency bugs
  for (const item of $store.s.cities) {
    loadNeighborhoods(item);
  }

  document.getElementById("loading").classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function removeCity(cityId, items) {
  try {
    items = items.filter((x) => x.id !== cityId);
    $store.s.cities = $store.s.cities.filter((x) => x !== cityId);
  } catch (err) {
    console.log(err);
  }
}
