// 🌗 THEME TOGGLE
const themeToggleButton = document.getElementById("toggleTheme");
const root = document.documentElement;
const EMOJIS = { light: "🌞", dark: "🌙" };

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggleButton.textContent = EMOJIS[theme];
  localStorage.setItem("theme", theme);
  themeToggleButton.classList.add("clicked");
  setTimeout(() => themeToggleButton.classList.remove("clicked"), 400);
}

function toggleTheme() {
  const current = root.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
}

themeToggleButton.addEventListener("click", toggleTheme);
setTheme(localStorage.getItem("theme") || "light");

// ✍️ TYPING ANIMATION
function typeWriter(el, text, delay = 40) {
  el.textContent = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, delay);
    }
  }
  type();
}

// 🌦️ ISLAND CLIMATE MAP (Fake Data)
const islandClimate = {
  alabasta: {
    min: 33,
    max: 44,
    weather: "Clear",
    icon: "luffy-sunny.png",
    message: "Luffy says: Where’s the meat?! ☀️",
    desc: "Hot and sunny — just like Alabasta!"
  },
  skypiea: {
    min: 19,
    max: 26,
    weather: "Clouds",
    icon: "skypiea-cloudy.png",
    message: "Usopp says: I’m basically God now ☁️",
    desc: "Cloudy and divine — feels like Skypiea!"
  },
  drum: {
    min: -5,
    max: 2,
    weather: "Snow",
    icon: "robin-snow.png",
    message: "Robin says: I love the quiet of falling snow.",
    desc: "Snowy vibes — just like Drum Island ❄️"
  },
  water7: {
    min: 25,
    max: 32,
    weather: "Rain",
    icon: "chopper-rainy.png",
    message: "Chopper says: Stay dry and cozy! 🌧️",
    desc: "Raining like Water 7 — better bring an umbrella!"
  },
  thriller: {
    min: 6,
    max: 14,
    weather: "Clouds",
    icon: "brook-fog.png",
    message: "Brook says: Yohohoho~ It’s spooky out here!",
    desc: "Spooky and cold — Thriller Bark style."
  },
  loguetown: {
    min: 10,
    max: 18,
    weather: "Clear",
    icon: "smoker-clear.png",
    message: "Smoker says: Don’t cause trouble in my town.",
    desc: "Chilly but clear — like mornings in Loguetown."
  },
  punkhazard: {
    min: -12,
    max: 44,
    weather: "Extreme",
    icon: "caesar-chaos.png",
    message: "Caesar says: This island is split in half — literally!",
    desc: "It's a battlefield of fire and ice — Punk Hazard weather!"
  },
  florian: {
    min: 14,
    max: 20,
    weather: "Mist",
    icon: "brook-fog.png",
    message: "Brook says: Yohohoho~ I can’t see anything!",
    desc: "Spooky fog… must be the Florian Triangle 👻"
  },
  weatheria: {
    min: 17,
    max: 21,
    weather: "Drizzle",
    icon: "nami-drizzle.png",
    message: "Nami says: Perfect day for charts and tea ☁️",
    desc: "Gentle drizzle — maybe Weatheria’s nearby?"
  }
};

// 🗺️ MATCH TEMP TO FICTIONAL ISLAND (for real cities)
function getIslandFromTemp(temp) {
  if (temp <= 0) return islandClimate.drum;
  if (temp <= 10) return islandClimate.thriller;
  if (temp <= 18) return islandClimate.loguetown;
  if (temp <= 24) return islandClimate.skypiea;
  if (temp <= 32) return islandClimate.water7;
  if (temp <= 40) return islandClimate.alabasta;
  return islandClimate.punkhazard;
}

// 🧠 DETECT ONE PIECE ISLAND INPUT
function isOnePieceIsland(input) {
  return Object.keys(islandClimate).includes(input.toLowerCase().replace(/\s+/g, ''));
}

// 🧪 DISPLAY FAKE WEATHER
function displayIslandFakeWeather(name) {
  const key = name.toLowerCase().replace(/\s+/g, '');
  const island = islandClimate[key];

  if (!island) {
    displayError(name);
    return;
  }

  const temp = Math.floor(Math.random() * (island.max - island.min + 1)) + island.min;

  displayWeather({
    city: `${capitalize(name)} (fictional)`,
    description: island.desc,
    temp: temp,
    icon: `assets/${island.icon}`,
    crewMessage: island.message
  });
}

// 📦 DISPLAY WEATHER
function displayWeather(data) {
  const forecastCard = document.getElementById("forecastCard");
  const cityName = document.getElementById("cityName");
  const weatherDesc = document.getElementById("weatherDesc");
  const temperature = document.getElementById("temperature");
  const weatherIcon = document.getElementById("weatherIcon");
  const crewMessage = document.getElementById("crewMessage");

  cityName.textContent = data.city;
  weatherDesc.textContent = data.description;
  temperature.textContent = `${data.temp}°C`;
  weatherIcon.src = data.icon;
  weatherIcon.alt = data.description;
  typeWriter(crewMessage, data.crewMessage);

  forecastCard.hidden = false;
  forecastCard.classList.add("visible");
}

// 🧃 ZORO ERROR FALLBACK
function displayError(name) {
  displayWeather({
    city: `${capitalize(name)} — lost like Zoro`,
    description: "Zoro got lost again… no weather found.",
    temp: "--",
    icon: "assets/zoro-default.png",
    crewMessage: "Try another island or city name!"
  });
}

// 🌎 FETCH REAL CITY WEATHER
const API_KEY = "1ccf54d63bd3744681424c5af0d33e9f";

async function fetchRealWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const island = getIslandFromTemp(temp);

    displayWeather({
      city: `${data.name} — like ${capitalize(island.icon.split("-")[0])}`,
      description: island.desc,
      temp: temp,
      icon: `assets/${island.icon}`,
      crewMessage: island.message
    });
  } catch (err) {
    displayError(city);
  }
}

// 🧠 CAPITALIZE HELP
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🎯 SEARCH HANDLERS
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;

  if (isOnePieceIsland(city)) {
    displayIslandFakeWeather(city);
  } else {
    fetchRealWeather(city);
  }

  cityInput.value = "";
}

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// 🚀 INITIAL LOAD
window.addEventListener("DOMContentLoaded", () => {
  displayIslandFakeWeather("Alabasta");
});
