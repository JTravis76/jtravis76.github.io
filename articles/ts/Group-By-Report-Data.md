# Group By - Report Data
The goal here is to fetch some report data from a server, inject the year and month value based on
any date field. Finally, group the data based on year then into months.

```ts
function groupBy<T extends Record<PropertyKey, any>>(
  arr: T[],
  key: keyof T,
): any {
  return arr.reduce((accumulator, val) => {
    const groupedKey = val[key];
    if (!accumulator[groupedKey]) {
      accumulator[groupedKey] = [];
    }
    accumulator[groupedKey].push(val);
    return accumulator;
  }, {} as any);
}

/* == Report Data
 * This data is fetch from a server via API, etc.
 * Thought would be to inject the year, month values based on any date field.
 * This could be done either by the back-end or front-end application
 */
const reportData = [
    { visitDate: "2021-02-05", visitDateYear: 2021, visitDateMonth: 6, apptCode: 1 },
    { visitDate: "2021-02-05", visitDateYear: 2022, visitDateMonth: 1, apptCode: 3 },
    { visitDate: "2021-03-05", visitDateYear: 2021, visitDateMonth: 3, apptCode: 2 },
    { visitDate: "2021-02-05", visitDateYear: 2020, visitDateMonth: 2, apptCode: 1 },
];

// == 1st: collect data by year
const byYear = groupBy(reportData,"visitDateYear");
Object.keys(byYear)
.forEach((year) => {
    // == 2th: Is there additional filtering ??
    const result = false
        ? byYear[year].filter((x: any) => x.apptCode === 1)
        : byYear[year];

    // == 3rd: collect data by month
    const byMonth = groupBy(
        result,
        "visitDateMonth",
    );

    let monthlyData = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
    } as {[key: string]: number};

    // == 4th: Count the total records for each month
    Object.keys(byMonth)
    .forEach((x) => {
        monthlyData[x] = byMonth[x].length;
    });

    // == 5th: display the year and it's monthly totals
    console.log(
        year, Object.values(monthlyData)
    );
});
```
