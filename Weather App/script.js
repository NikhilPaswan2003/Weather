// console.log("kaise ho bhai log");

// const API_KEY = "e8bd3fc645d861ec8b87f772ee987576";

// function randerdatainfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);
// }

// async function showWeather(){
//     let city = "goa";
    
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await response.json();
//     console.log("Weather data :->", data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);
// }


// async function getCustomWeather(){

//     try {
//         let meraid = "e8bd3fc645d861ec8b87f772ee987576";
//         let latitude = 15.7664;
//         let longitude = 16.7777;
//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
//         let data = await result.json();
    
//         console.log(data);

//         randerdatainfo(data);
//     } catch (error) {
//         console.log("Error Found" , error);
//     }

// }





                                        //   WEATHER APP

const userTab = document.querySelector("[data-userWeather]");                                        
const searchTab = document.querySelector("[data-searchWeather]"); 
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "e8bd3fc645d861ec8b87f772ee987576";
currentTab.classList.add("current-tab");
getFormSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }


    if(!searchForm.classList.contains("active")){
        //kya search form wala container is invisible , if yes then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //abv mai your weather tab mai aagya hu, toh weather bhi display karna padega
        //so lets check local storage first for coordinates, if we have saved them



        //check if cordinates are already present in session storage
        getFormSessionStorage();
    }
}


userTab.addEventListener("click", () => {
    switchTab(userTab);
} );

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
} );


function getFormSessionStorage() {
    const locakCoordinates = sessionStorage.getItem("user-coordinates");
    if(!locakCoordinates){
        //agar coordinates nahi milte toh
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(locakCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");

    //Make loader visible
    loadingScreen.classList.add("active");

    // API Call
    //`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_kEY}`

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(weatherInfo) {
    // finally we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherdesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-Windspeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch value from weather info object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // HW
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        //HW
    }
}

