const baseUrl = 'https://restcountries.eu/rest/v2';

function fetchCountriesList(searchQuery) {
  return fetch(`${baseUrl}/name/${searchQuery}`,
  {
    method: "GET",
    "Content-Type": "application/javascript"
  }
  ).then(response =>
    response.json(),
  );
}

export default fetchCountriesList;
