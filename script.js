const themeToggleButton = document.getElementById('toggleTheme');
const root = document.documentElement;

const EMOJIS = { light: '🌞', dark: '🌙' };

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggleButton.textContent = EMOJIS[theme];
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = root.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  animateEmojiSwap(themeToggleButton, EMOJIS[next]);
  setTheme(next);
}

function animateEmojiSwap(element, newEmoji) {
  element.animate(
    [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }],
    { duration: 200, easing: 'ease-in' }
  ).onfinish = () => {
    element.textContent = newEmoji;
    element.animate(
      [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: 200, easing: 'ease-out' }
    );
  };
}

themeToggleButton.addEventListener('click', toggleTheme);
setTheme(localStorage.getItem('theme') || 'light');

function typeWriter(el, text, delay = 40) {
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, delay);
    }
  }
  type();
}

// 🌍 Weather condition → One Piece island map
const weatherToIsland = {
  Clear: {
    island: "Alabasta",
    message: "Hot and sunny — just like Alabasta!",
    icon: "assets/luffy-sunny.png",
    crewMessage: "Luffy says: Where’s the meat?! ☀️"
  },
  Rain: {
    island: "Water 7",
    message: "Raining like Water 7 — better bring an umbrella!",
    icon: "assets/chopper-rainy.png",
    crewMessage: "Chopper says: Stay dry and cozy! 🌧️"
  },
  Thunderstorm: {
    island: "Whole Cake Island",
    message: "Stormy like Big Mom’s mood on Whole Cake Island!",
    icon: "assets/bigmom-stormy.png",
    crewMessage: "Big Mom says: Mwahaha! Stay inside! ⚡"
  },
  Clouds: {
    island: "Skypiea",
    message: "Cloudy and divine — feels like Skypiea!",
    icon: "assets/skypiea-cloudy.png",
    crewMessage: "Usopp says: I’m basically God now ☁️"
  },
  Snow: {
    island: "Drum Island",
    message: "Snowy vibes — just like Drum Island ❄️",
    icon: "assets/robin-snow.png", // CHANGED HERE ✅
    crewMessage: "Robin says: I love the quiet of falling snow."
  },
  Mist: {
    island: "Florian Triangle",
    message: "Spooky fog… must be the Florian Triangle 👻",
    icon: "assets/brook-fog.png",
    crewMessage: "Brook says: Yohohoho~ I can’t see anything!"
  }
};

const API_KEY = "1ccf54d63bd3744681424c5af0d33e9f";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const forecastCard = document.getElementById("forecastCard");
const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const crewMessage = document.getElementById("crewMessage");

function displayWeather(data) {
  cityName.textContent = data.city;
  weatherDesc.textContent = data.description;
  temperature.textContent = `${data.temp}°C`;
  weatherIcon.src = data.icon;
  weatherIcon.alt = data.description;
  typeWriter(crewMessage, data.crewMessage);

  if (forecastCard.hidden) forecastCard.hidden = false;
  forecastCard.classList.add("visible");
  forecastCard.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 600, easing: "ease-out", fill: "forwards" }
  );
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    const weatherMain = data.weather[0].main;
    const matchedIsland = weatherToIsland[weatherMain] || weatherToIsland["Clear"];

    displayWeather({
      city: `${data.name} — like ${matchedIsland.island}`,
      description: matchedIsland.message,
      temp: Math.round(data.main.temp),
      icon: matchedIsland.icon,
      crewMessage: matchedIsland.crewMessage
    });

  } catch (err) {
    displayWeather({
      city: city,
      description: "Zoro got lost again… no weather found.",
      temp: "--",
      icon: "assets/zoro-default.png",
      crewMessage: "Try another island or city name!"
    });
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
  cityInput.value = "";
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
    cityInput.value = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Alabasta");
});

