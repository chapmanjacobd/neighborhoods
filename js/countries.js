function getCountry(items, country) {
  return items.filter((i) => i.u === country)[0];
}


function getCountryURLFormat(items, country) {
  const c = getCountry(items, country);
  if (!c) return "";
  return { id: c.u, n: c.c };
}


function itemR(item) {
  return `
    <a class="push-right">
    <i src="flags/blank.gif" class="flag flag-${item.u.toLowerCase()}"></i>
        ${item.c}
    </a>
`;
}

function filterItems(filterString, items) {
  if (!filterString) return items;

  return matchSorter(items, filterString, {
    keys: ["u", "c"],
  });
}
