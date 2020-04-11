import debounce from 'lodash.debounce';
import fetchCountriesList from './fetchCountries';
import countriesInfo from '../templates/countriesInfo.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';

const refs = {
  input: document.querySelector('.input'),
  countriesList: document.querySelector('.countriesList'),
  resultCountry: document.querySelector('.resultCountry'),
};

refs.input.addEventListener('input', debounce(searchCountry, 500));
refs.input.addEventListener('blur', clearSearch);
refs.input.addEventListener('keydown', clearBackSpace);
refs.input.addEventListener('focus', clearResult);

function searchCountry(e) {
  e.preventDefault();
  const searchQuery = e.target.value;

  fetchCountriesList(searchQuery)
    .then(data => {
      if (data.length >= 2 && data.length <= 10) {
        allNames(data);
        PNotify.closeAll();
      } else if (data.length === 1) {
        allInfo(data);
        PNotify.closeAll();
      } else if (data.length > 10) {
        const error = PNotify.error({
          title: 'Oh No!',
          text: 'Too many matches found. Please enter a more specific query!',
          modules: {
            Buttons: {
              closer: false,
              sticker: false,
            },
          },
        });
        error.on('click', function () {
          error.close();
        });
      }
    })
    .catch(error => console.error('ERROR---', error));
}

function clearSearch() {
  refs.input.value = '';
}

function template({ name }) {
  return `
  <li class="CountriesList__item">
  <p>${name}</p>
  </li>
  `;
}

function allNames(data) {
  const list = data.map(country => template(country)).join('');
  refs.countriesList.insertAdjacentHTML('beforeend', list);
}

function allInfo(data) {
  const markup = data.map(country => countriesInfo(country)).join('');
  refs.resultCountry.insertAdjacentHTML('beforeend', markup);
}

function clearBackSpace(e) {
  if (e.keyCode === 8) {
    clearSearch();
  }
}

function clearResult() {
  refs.resultCountry.innerHTML = '';
  refs.countriesList.innerHTML = '';
}
