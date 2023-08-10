/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/react-csv/react-csv
export const isJsons = (array: any): any =>
  Array.isArray(array) &&
  array.every((row) => typeof row === "object" && !(row instanceof Array));

export const jsonsHeaders = (array: any): any =>
  Array.from(
    array
      .map((json: any) => Object.keys(json))
      .reduce((a: any, b: any) => new Set([...a, ...b]), [])
  );
export const getHeaderValue = (property: any, obj: any): any => {
  const foundValue = property
    .replace(/\[([^\]]+)]/g, ".$1")
    .split(".")
    .reduce(function (o: any, p: any, i: any, arr: any) {
      // if at any point the nested keys passed do not exist, splice the array so it doesnt keep reducing
      const value = o[p];
      if (value === undefined || value === null) {
        arr.splice(1);
      } else {
        return value;
      }
    }, obj);
  // if at any point the nested keys passed do not exist then looks for key `property` in object obj
  return foundValue === undefined
    ? property in obj
      ? obj[property]
      : ""
    : foundValue;
};
export const jsons2arrays = (jsons: any, headers: any): any => {
  headers = headers || jsonsHeaders(jsons);

  // allow headers to have custom labels, defaulting to having the header data key be the label
  let headerLabels = headers;
  let headerKeys = headers;
  if (isJsons(headers)) {
    headerLabels = headers.map((header: any) => header.label);
    headerKeys = headers.map((header: any) => header.key);
  }

  const data = jsons.map((object: any) =>
    headerKeys.map((header: any) => getHeaderValue(header, object))
  );
  return [headerLabels, ...data];
};

export const elementOrEmpty = (element: any): any =>
  typeof element === "undefined" || element === null ? "" : element;
export const joiner = (
  data: any,
  separator = ",",
  enclosingCharacter = '"'
): any => {
  return data
    .filter((e: any) => e)
    .map((row: any) =>
      row
        .map((element: any) => elementOrEmpty(element))
        .map(
          (column: any) => `${enclosingCharacter}${column}${enclosingCharacter}`
        )
        .join(separator)
    )
    .join(`\n`);
};

export const toCSV = (data: any, headers: any): any =>
  joiner(jsons2arrays(data, headers));
