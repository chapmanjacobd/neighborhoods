function getCity(items, city) {
  return items.filter((i) => i.id === city)[0];
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
    keys: ["n", "s", "u", "c"],
  });
}

function searchCountry(searchString, items) {
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/searchCountry?input=${searchString}`)
        .then((res) => res.json())
        .then((res) =>
          items.push(
            ...res.map((x) => ({
              ...x,
              n: x.displayname,
              u: x.id.toLowerCase(),
            }))
          )
        );
    } catch (err) {
      console.log(err);
    }
  })();
}

function loadCountry(item, items) {
  document.getElementById("loading").classList.add("active");
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getCities?k=${item.id}`)
        .then((res) => res.json())
        .then((res) => {
          items.splice(0);
          items.push(...res);
          $store.s.country = { id: item.id, n: item.displayname };
        });
    } catch (err) {
      console.log(err);
    }

    document.getElementById("loading").classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  })();
}

function loadCity(item, items) {
  document.getElementById("loading").classList.add("active");
  (async function () {
    try {
      await fetch(`https://unli.xyz/neighbourhoods/api/getCities?k=${item.id}`)
        .then((res) => res.json())
        .then((res) => {
          items.splice(0);
          items.push(...res);
          $store.s.city = { id: item.id, n: item.displayname };
        });
    } catch (err) {
      console.log(err);
    }

    document.getElementById("loading").classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  })();
}
