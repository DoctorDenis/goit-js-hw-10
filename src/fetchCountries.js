export const fetchCountries = (query) => {
  // console.log(query);
  return fetch(`https://restcountries.com/v2/name/${query}?fields=name,capital,population,flags,languages`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  )
}