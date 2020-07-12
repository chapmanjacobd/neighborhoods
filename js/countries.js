function getData() {
  return { items: [], filterString: "", s: {} };
}

function getCountry(items, country) {
  return items.filter((i) => i.u === country)[0];
}

function getColumn(items, column) {
  if (!items) return [];
  if (!column) return [];
  return items.map((x) => {
    return {
      col: plural(renameCountryProperties(column), 2),
      country: x.c,
      u: x.u,
      value: renameCountryValues(x[column]),
    };
  });
}

function countryDisplay(s) {
  if (!s) return [];

  return Object.entries(s)
    .filter((x) => !["lon", "lat", "u", "c"].includes(x[0]))
    .map((x) => ({ p: x[0], dp: renameCountryProperties(x[0]), v: renameCountryValues(x[1]) }));
}

function renameCountryValues(v) {
  if (!v) return "";
  if (v.length == 3) return "<div> minavgmax </div>";
  if (v.length == 12) return "<div> monthlydata </div>";
  if (typeof v == "number") return v.toLocaleString();

  return v;
}

function renameCountryProperties(p) {
  if (p == "big_city") return "Large city";
  if (p == "pop_avg") return "Avg city population";
  if (p == "avg_dist") return "Avg city neighborhood to center distance";
  if (p == "avg_noise") return "Avg Noise";

  return p;
}

function itemR(item) {
  return `
    <a class="push-right">
        ${item.c}
    </a>
`;
}

const c = (str) => str.toLowerCase().replace(/\s/g, "");

function filterItems(filterString, items) {
  if (filterString)
    return items.filter((i) =>
      [c(i.c), c(i.u)].filter(Boolean).some((s) => s.includes(c(filterString)))
    );

  return items;
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
