import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const refs = {
  listEl: document.querySelector('.country-list'),
  countryDivEl: document.querySelector('.country-info'),
  searchBox: document.querySelector('#search-box'),
};

Notify.init({
  position: 'center-top',
  width: '450px',
  timeout: 3000,
  cssAnimationDuration: 600,
  cssAnimationStyle: 'zoom',
  // useFontAwesome: true,
  fontAwesomeIconStyle: 'shadow',
  showOnlyTheLastOne: true,
});

refs.searchBox.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value.trim() === '') {
      return;
    }

    fetchCountries(event.target.value.trim())
      .then(countries => {
        if (countries.length > 1 && countries.length <= 10) {
          renderCountriesList(countries);
        } else if (countries.length > 10) {
          refs.listEl.innerHTML = '';
          refs.countryDivEl.innerHTML = '';
          Notify.info(
            `Too many matches found. Please enter a more specific name.`
          );
        } else {
          renderCountry(countries[0]);
        }
      })
      .catch(error => {
        refs.listEl.innerHTML = '';
        refs.countryDivEl.innerHTML = '';
        Notify.failure(`Oops! There is no country with that name`);
      });
  }),
  DEBOUNCE_DELAY
);

function renderCountriesList(countries) {
  refs.listEl.innerHTML = '';
  refs.countryDivEl.innerHTML = '';

  const markup = countries
    .map(country => {
      return `<li class="countries-item" >
                <span class="flag-wrapper">
                   <img class="country-item-flag" src="${country.flags.svg}" alt="Flag of the ${country.name}">
                </span>
                <p class="country-item-name">${country.name}</p>
              </li>`;
    })
    .join('');
  refs.listEl.innerHTML = markup;
  document.querySelectorAll('.countries-item').forEach(element =>
    element.addEventListener('click', event => {
      const substr = event.currentTarget
        .querySelector('p')
        .textContent.split(' ');

      fetchCountries(substr[0])
        .then(countries => {
          if (countries.length > 1 && countries.length < 10) {
            renderCountriesList(countries);
          } else if (countries.length > 10) {
            refs.listEl.innerHTML = '';
            refs.countryDivEl.innerHTML = '';
            Notify.info(
              `There is too many countries found. Please specify the search query!`
            );
          } else {
            renderCountry(countries[0]);
          }
        })
        .catch(error => {
          refs.listEl.innerHTML = '';
          refs.countryDivEl.innerHTML = '';
          Notify.failure(`Oops! There is no country with that name`);
        });
    })
  );
}

function renderCountry(country) {
  refs.listEl.innerHTML = '';
  refs.countryDivEl.innerHTML = '';
  refs.countryDivEl.innerHTML = `
    <img class="country-item-flag" src="${
      country.flags.svg
    }" alt="Flag of the ${country.name}">
    <h2 class="country-name">${country.name}</h2>
    <p class="country-capital"><b>Capital:</b> ${country.capital}</p>
    <p class="country-population"><b>Population:</b> ${country.population}</p>
    <p class="country-languages"><b>Languages:</b> ${country.languages
      .map(language => `${language.name}`)
      .join(', ')}</p>`;
}
