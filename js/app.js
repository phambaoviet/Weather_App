async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
  );
  const data = await response.json();

  let tempp = data.current.temperature_2m;

  document.querySelector('#temp').innerText = `Nhiệt độ: ${tempp}°C`;
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
