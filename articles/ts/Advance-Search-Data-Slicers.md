# Advance Search with Data Slicer
> Below snippet is a proof-of-concept
Wanted to build a interactive dashboard using data-slicers. Data slicer is a set of data grouped by a common
title. When an element is active/disactive, every widget on the page is updated.

```ts
/* == Advance search with Data slicers ==
 * author: Jeremy Travis 2022
 * built using typescriptlang.org/play
 * TS version: 4.6.4
 */

// == Data Slicer
// could be a list checkboxes or a single input field
const slicers = [
  {
      title: "States",
      data: [
        { text: "OH", value: "OH", selected: false },
        { text: "KY", value: "KY", selected: false }
      ],
  },
  {
      title: "Last Name",
      data: "",
  }
];

// ---------------------

// == data fetch from API
const data = [
  { first: "Fred", last: "Flintstone", state: "OH" },
  { first: "Barney", last: "Rumble", state: "KY" }
];

// == searches model to store selected filters from slicers
// !! properties must match the data properties
const searches = {
  first: new Array<string>(),
  last: new Array<string>(),
  state: new Array<string>(),
} as any

// == add searches based on selection
slicers.forEach((x) => {
  if (typeof x.data === "string") {
    switch (x.title) {
       case "Last Name":
        if (x.data && x.data.length > 0) {
          searches.last.push(x.data.toLowerCase());
        }
        break;
      default:
    } 
  } else if (Array.isArray(x.data)) {
    switch (x.title) {
        case "States":
        searches.state = new Array<string>();
          x.data.forEach((y) => {
            if (y.selected) {
              searches.state.push(y.value.toLowerCase());
            }
          })
          break;
        default:
      }
  }
})

/** Predicate Search Logic */
const predicate = (item: any) => {
  /* == Rules:
   * count the active search properties
   * count the weighted matches
   * if both equal, expression passes
   */

  // NOTE: AND statements 'between' properties
  //       OR statement 'within' properties
  let searchPropertyCnt = 0;
  let totalMatch = 0;

  // ESLINT rule said NOT to use For..In loop :P
  //Object.entries(searches).forEach((x) => console.log(x));
  //Object.keys(searches).forEach((x) => console.log(x));
  //Object.values(searches).forEach((x) => console.log(x));

  for (let key in searches) {
    //console.log(key, searches[key], item[key].toLowerCase());

    // == count the active searches
    if (searches[key].length > 0) {
        searchPropertyCnt += 1;
    }

    // == if a match is found, add to total
    if (item[key] !== undefined && searches[key].length > 0) {
        // check matches for Array types
        if (searches[key].includes(item[key].toLowerCase())) {
            totalMatch += 1;
        } else if (item[key].toLowerCase().includes(searches[key])) {
            // check matches for String types
            totalMatch += 1;
        }
    }
  }

  //console.log(searchPropertyCnt, totalMatch);
  return searchPropertyCnt === totalMatch;
};

const results = data.filter(predicate);

console.log(
   results
);

```