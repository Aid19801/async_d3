d3.queue()
  .defer(d3.json, "./countries.json")
  .defer(d3.csv, "./my.csv", formatter)
  .await((error, countriesRes, citiesRes) => {
    if (error) throw error;
    // matching the cities' countryCode with country.countryCode
    var data = countriesRes.geonames.map((country, i) => {
      country.cities = citiesRes.filter(
        (city) => city.countryCode === country.countryCode
      );
      return country;
    });
    // so now data is basically countries[] but with cities included.

    var countrySelection = d3
      .select("body")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div");

    countrySelection.append("h3").text((d) => d.countryName);

    countrySelection.append("ul").html((d) =>
      d.cities
        .map((city) => {
          var percentage = (city.population / d.population) * 100;
          return `<li>${city.cityName} - ${percentage.toFixed(2)}% </li>`;
        })
        .join("")
    );
  });

// d3.json("./countries.json", function (error, data) {
//   if (error) throw error;

//   console.log("DATA 2", data);

//   d3.select("body")
//     .selectAll("h3")
//     .data(data.geonames)
//     .enter()
//     .append("h3")
//     .text((d) => d.countryName);
// });

function formatter(row) {
  if (row.pop < 10000) {
    return;
  } else {
    return {
      cityName: row.city,
      countryCode: row.iso2,
      population: +row.pop,
    };
  }
}

// d3.csv("./my.csv", formatter, (error, data) => {
//   if (error) throw error;
//   console.log("DATA 2", data);
// });
