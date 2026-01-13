// script.js - Lógica do aplicativo de clima com autocomplete e theme switch

// Elementos do DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const suggestionsList = document.getElementById('suggestions');
const themeToggle = document.getElementById('theme-toggle');

// Variável para debounce
let debounceTimer;

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-theme', savedTheme === 'dark');
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '🌞';

// Event listener para o botão de busca
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        clearSuggestions();
        getWeather(city);
    } else {
        displayError('Por favor, digite o nome de uma cidade.');
    }
});

// Event listener para input (autocomplete)
cityInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);
    if (query.length > 2) {
        debounceTimer = setTimeout(() => {
            getSuggestions(query);
        }, 300);
    } else {
        clearSuggestions();
    }
});

// Event listener para clicar fora e fechar sugestões
document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        clearSuggestions();
    }
});

// Event listener para toggle de tema
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    themeToggle.textContent = isDark ? '🌙' : '🌞';
});

// Função para obter sugestões de cidades
async function getSuggestions(query) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro na busca de sugestões');
        const data = await response.json();
        displaySuggestions(data.results || []);
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        clearSuggestions();
    }
}

// Função para exibir sugestões
function displaySuggestions(cities) {
    suggestionsList.innerHTML = '';
    if (cities.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }
    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener('click', () => {
            cityInput.value = city.name;
            clearSuggestions();
            getWeather(city.name);
        });
        suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = 'block';
}

// Função para limpar sugestões
function clearSuggestions() {
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
}

// Função principal para obter o clima
async function getWeather(city) {
    weatherDisplay.classList.add('loading');
    try {
        // Primeiro, geocodificar a cidade para obter latitude e longitude
        const geoData = await geocodeCity(city);
        if (!geoData) {
            displayError('Cidade não encontrada. Verifique o nome e tente novamente.');
            return;
        }

        const { latitude, longitude, country } = geoData;

        // Agora, obter os dados climáticos
        const weatherData = await fetchWeather(latitude, longitude);

        // Exibir os dados
        displayWeather(weatherData, city, country);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        displayError('Erro ao conectar com a API. Tente novamente mais tarde.');
    } finally {
        weatherDisplay.classList.remove('loading');
    }
}

// Função para geocodificar a cidade usando Open-Meteo
async function geocodeCity(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erro na geocodificação');
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
            country: data.results[0].country
        };
    }
    return null;
}

// Função para buscar dados climáticos
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,apparent_temperature&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erro ao buscar clima');
    }
    const data = await response.json();
    return data;
}

// Função para exibir os dados do clima
function displayWeather(data, city, country) {
    const current = data.current_weather;
    const hourly = data.hourly;

    // Mapeamento de códigos de clima para descrições (simplificado)
    const weatherDescriptions = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Névoa',
        48: 'Névoa com geada',
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa intensa',
        56: 'Garoa congelante leve',
        57: 'Garoa congelante intensa',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        77: 'Grãos de neve',
        80: 'Chuva leve',
        81: 'Chuva moderada',
        82: 'Chuva forte',
        85: 'Neve leve',
        86: 'Neve forte',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };

    const condition = weatherDescriptions[current.weathercode] || 'Condição desconhecida';
    const temperature = current.temperature;
    const apparentTemp = hourly.apparent_temperature ? hourly.apparent_temperature[0] : 'Não disponível';

    const html = `
        <div class="weather-info">
            <h2>Clima em ${city}, ${country}</h2>
            <p><strong>Temperatura atual:</strong> ${temperature}°C</p>
            <p><strong>Condição:</strong> ${condition}</p>
            <p><strong>Sensação térmica:</strong> ${apparentTemp}°C</p>
        </div>
    `;

    weatherDisplay.innerHTML = html;
}

// Função para exibir erros
function displayError(message) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}