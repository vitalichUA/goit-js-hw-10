import '../css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');


inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function clearInput() {
    countryListRef.innerHTML = ''
}

function onSearch(evt) {
    evt.preventDefault;

    if (evt.target.value.trim().length >= 1) {
        fetchCountries(evt.target.value).then(res => {
            renderCountryList(res);
            renderCountryInfo(res)
        }).catch((error) => {
            console.log(error);
            Notify.failure("Oops, there is no country with that name");
            
})
    } else if (evt.target.value.trim().length === 0) {
clearInput()
    }
};

function renderCountryList(item) {
    if (item.length > 2 && item.length <= 10) {
        const smallCountryItems = item.map(({ flags, name }) => {
            return `<li class="country-item"><img src=${flags.svg} class="country__img"></img> <p class="country__title-small"> ${name.official} </p> </li>`
        }).join('')

        countryListRef.innerHTML = smallCountryItems
    } else if (item.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        clearInput()

    } 
}

function renderCountryInfo(item) {
    if (item.length === 1) {
        
        const oneCountryMarkup = item.map(({ flags, name, capital, population, languages }) => {
            const languagesValue = Object.values(languages).join(', ');
            return `<li class="country__item-big">
            <div class="country__wrap-head">
            <img src=${flags.svg} class="country__img"></img> <p class="country__title-big"> ${name.common} </p> </div>
            <div class="country__information">
            <p class="country__title-text">Capital: <span class="country__value-text">${capital}</span></p>
            <p class="country__title-text">Population: <span class="country__value-text">${population}</span></p>
            <p class="country__title-text">Languages: <span class="country__value-text">${ languagesValue }</span></p>
            </div></li>`
        }).join('')
        countryListRef.innerHTML = oneCountryMarkup;
    }
}
    
