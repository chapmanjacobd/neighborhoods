function getCountry(items, country) {
  return items.filter((i) => i.n === country)[0];
}


function itemR(item) {
  return `
    <a class="push-right">
    <i src="flags/blank.gif" class="flag flag-${item.u.toLowerCase()}"></i>
        ${item.n}
    </a>
`;
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
