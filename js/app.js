async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,wind_direction_10m,is_day&timezone=auto`
  );
  const data = await response.json();

  let tempp = data.current.temperature_2m;
  let appear_temp = data.current.apparent_temperature;
  let humidity = data.current.relative_humidity_2m;
  let wind_speed = data.current.wind_speed_10m;
  let wind_direct = data.current.wind_direction_10m;
  //   Ngày-đêm
  let day_night = data.current.is_day === 1;
  // Độ ẩm
  let h = data.current.relative_humidity_2m;
  let level;
  if (h < 20) level = 'Không khí khô';
  else if (h < 60) level = 'Dễ chịu';
  else if (h < 80) level = 'Khá ẩm';
  else level = 'Rất ẩm';
  function degToCompass(deg) {
    const dirs = [
      'Bắc',
      'Đông Bắc',
      'Đông',
      'Đông Nam',
      'Nam',
      'Tây Nam',
      'Tây',
      'Tây Bắc',
    ];
    const index = Math.round(deg / 45) % 8;
    return dirs[index];
  }

  const deg = data.current.wind_direction_10m;
  const dirText = degToCompass(deg);
  document.querySelector('#wind-direct').textContent = `${dirText}`;

  // Map weather_code
  const weatherCodeMap = {
    0: 'Trời quang mây',
    1: 'Hầu như quang đãng',
    2: 'Ít mây',
    3: 'Nhiều mây / u ám',
    45: 'Sương mù',
    48: 'Sương mù đóng băng',
    51: 'Mưa phùn nhẹ',
    53: 'Mưa phùn vừa',
    55: 'Mưa phùn to',
    56: 'Mưa phùn lạnh nhẹ',
    57: 'Mưa phùn lạnh to',
    61: 'Mưa nhẹ',
    63: 'Mưa vừa',
    65: 'Mưa to',
    66: 'Mưa lạnh nhẹ',
    67: 'Mưa lạnh to',
    71: 'Tuyết nhẹ',
    73: 'Tuyết vừa',
    75: 'Tuyết dày',
    77: 'Tuyết hạt',
    80: 'Mưa rào nhẹ',
    81: 'Mưa rào vừa',
    82: 'Mưa rào rất to',
    85: 'Mưa tuyết rào nhẹ',
    86: 'Mưa tuyết rào mạnh',
    95: 'Giông bão',
    96: 'Giông bão kèm mưa đá nhẹ',
    99: 'Giông bão kèm mưa đá mạnh',
  };
  const desc =
    weatherCodeMap[data.current.weather_code] || 'Thời tiết không xác định';

  document.querySelector('#temp').textContent = `${tempp}°C`;
  document.querySelector('#appear-temp').textContent = `${appear_temp}°C`;
  document.querySelector('#humidity').textContent = `${humidity}%`;
  document.querySelector('#humidity-level').textContent = `${level}`;

  document.querySelector('#wind-speed').textContent = `${wind_speed}m/s`;

  document.querySelector('#current_weather').textContent = `${desc}`;

  document.querySelector('#day-night').textContent = day_night
    ? 'Ban ngày'
    : 'Ban đêm';
}

async function searchCityAndGetWeather() {
  const inputElement = document.querySelector('#input');
  const cityName = inputElement.value.trim();
  if (!cityName) {
    alert('Please enter a city name.');
    return;
  }
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`
    );
    const data = await response.json();

    // Không có thành phố nào được tìm thấy thì bỏ qua
    if (!data.results) {
      alert('City not found. Please try again.');
      return;
    }
    let lat = data.results[0].latitude;
    let lon = data.results[0].longitude;

    getWeather(lat, lon);
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
}
// Bắt sự kiện khi nhấn enter
const inputElement = document.querySelector('#input');
inputElement.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchCityAndGetWeather();
  }
});
