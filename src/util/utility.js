/* all kinds of helper functions and fixed data arrays (e.g. for ordering or colouring elements) */

const classMapping = [
  { class: 'black metal', color: "#ad494a" },
  { class: 'death metal', color: "#e69e57" },
  { class: 'gothic metal', color: "#14a5b5" },
  { class: 'industrial', color: "#9467bd" },
  { class: 'industrial metal', color: "#fccde5" },
  { class: 'metal', color: "#a6cee3" },
  { class: 'power metal', color: "#b2df8a" },
  { class: 'folk metal', color: "#33a02c" },
  { class: 9, color: "#fb9a99" },
  { class: 10, color: "#e31a1c" },
  { class: 11, color: "#fdbf6f" },
  { class: 12, color: "#ff7f00" },
  { class: 13, color: "#cab2d6" },
  { class: 14, color: "#6a3d9a" },
  { class: 15, color: "#ffff99" },
  { class: 16, color: "#b15928" }
];

export const getClassColor = field => {
  return classMapping.find(e => e.class === field)
    ? classMapping.find(e => e.class === field).color
    : "#989aa1"; // default color class
};

export const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          let [key, value] = param.split("=");
          params[key] = value ? value : "";
          return params;
        }, {})
    : {};
};
