let currentLat = null;
let currentLon = null;

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

    currentLat = lat;
    currentLon = lon;

    getWeather(lat, lon);
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
}
// level + advice aqi
function mapAqi(aqi) {
  if (aqi === null) {
    return {
      level: 'Không xác định',
      advice: 'Không có dữ liệu về chất lượng không khí',
    };
  }
  // Các ngưỡng aqi
  if (aqi <= 50) {
    return {
      level: 'Tốt',
    };
  } else if (aqi <= 100) {
    return {
      level: 'Trung bình',
    };
  } else if (aqi <= 150) {
    return {
      level: 'Không tốt cho nhóm nhạy cảm',
    };
  } else if (aqi <= 200) {
    return {
      level: 'Xấu',
    };
  } else if (aqi <= 300) {
    return {
      level: 'Rất xấu',
    };
  } else {
    return {
      level: 'Nguy hại',
    };
  }
}
// PM2.5 (µg/m³)
function mapPm2_5(pm) {
  if (pm == null) {
    return {
      level: 'Không xác định',
      advice: 'Không có dữ liệu PM2.5.',
    };
  }

  if (pm <= 15) {
    return {
      level: 'Tốt',
    };
  } else if (pm <= 35) {
    return {
      level: 'Trung bình',
    };
  } else if (pm <= 55) {
    return {
      level: 'Kém',
    };
  } else if (pm <= 150) {
    return {
      level: 'Xấu',
    };
  } else {
    return {
      level: 'Rất xấu',
    };
  }
}

// PM10 (µg/m³)
function mapPm10(pm) {
  if (pm == null) {
    return {
      level: 'Không xác định',
      advice: 'Không có dữ liệu PM10.',
    };
  }

  if (pm <= 30) {
    return {
      level: 'Tốt',
    };
  } else if (pm <= 50) {
    return {
      level: 'Trung bình',
    };
  } else if (pm <= 100) {
    return {
      level: 'Kém',
    };
  } else if (pm <= 200) {
    return {
      level: 'Xấu',
    };
  } else {
    return {
      level: 'Rất xấu',
    };
  }
}

// NO2 (µg/m³)
function mapNo2(no2) {
  if (no2 == null) {
    return {
      level: 'Không xác định',
      advice: 'Không có dữ liệu NO₂.',
    };
  }

  if (no2 <= 40) {
    return {
      level: 'Tốt',
    };
  } else if (no2 <= 100) {
    return {
      level: 'Trung bình',
    };
  } else if (no2 <= 200) {
    return {
      level: 'Kém',
    };
  } else {
    return {
      level: 'Xấu',
    };
  }
}
// Level color
function colorLevel(el, level) {
  // đưa hết về chữ thường
  const lv = level.toLowerCase();
  if (
    lv.includes('Tuyệt vời') ||
    lv.includes('vừa phải') ||
    lv.includes('tốt') ||
    lv.includes('trung bình')
  ) {
    el.classList.add('text-success');
  }
  // Nhóm xấu có hại
  else if (lv.includes('xấu') || lv.includes('có hại') || lv.includes('kém')) {
    el.classList.add('text-warning');
  }
  // Nhóm "rất có hại" / "nguy hiểm" -> đỏ
  else if (lv.includes('rất có hại') || lv.includes('nguy hiểm')) {
    el.classList.add('text-danger');
  }
}
async function getAirQuality(lat, lon) {
  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide`
    );

    const data = await response.json();

    let aqi = data.current.us_aqi;
    let pm10 = data.current.pm10;
    let pm2_5 = data.current.pm2_5;
    let no2 = data.current.nitrogen_dioxide;

    const aqiInfo = mapAqi(aqi);
    const pm2_5Info = mapPm2_5(pm2_5);
    const pm10Info = mapPm10(pm10);
    const no2Info = mapNo2(no2);

    // Đổ dữ liệu ra UI
    const aqiLevel = document.querySelector('#aqi-level');
    const pm2_5Level = document.querySelector('#pm2_5-level');
    const pm10Level = document.querySelector('#pm10-level');
    const no2Level = document.querySelector('#no2-level');

    aqiLevel.textContent = aqiInfo.level;
    pm2_5Level.textContent = pm2_5Info.level;
    pm10Level.textContent = pm10Info.level;
    no2Level.textContent = no2Info.level;

    colorLevel(aqiLevel, aqiInfo.level);
    colorLevel(pm2_5Level, pm2_5Info.level);
    colorLevel(pm10Level, pm10Info.level);
    colorLevel(no2Level, no2Info.level);

    document.querySelector('#aqi-value').textContent = `${aqi} AQI`;
    document.querySelector('#pm10-value').textContent = `${pm10} µg/m³`;
    document.querySelector('#pm2_5-value').textContent = `${pm2_5} µg/m³`;
    document.querySelector('#no2-value').textContent = `${no2} µg/m³`;
  } catch (err) {
    console.log('Lỗi khi fetch API air quality ');
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

window.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const panels = document.querySelectorAll('.tab-panel');
  function setActiveTab(tabName) {
    panels.forEach((panel) => {
      panel.classList.add('d-none');
    });
    navLinks.forEach((link) => {
      link.classList.remove('active');
    });

    const currentLink = document.querySelector(
      `.nav-menu .nav-link[data-tab="${tabName}"]`
    );
    if (currentLink) {
      currentLink.classList.add('active');
    }

    // Hiện đúng section tương ứng
    const currentSection = document.getElementById(`tab-${tabName}`);
    if (currentSection) {
      currentSection.classList.remove('d-none');
    }
  }
  // 5. Gán sự kiện click cho từng nav-link
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // chặn href="#"

      const tabName = link.getAttribute('data-tab'); // đọc today/hourly/7days/air
      setActiveTab(tabName);

      // Nếu là tab "air" thì load chất lượng không khí
      if (tabName === 'air') {
        // currentLat, currentLon là biến global bạn đã set trong searchCityAndGetWeather
        getAirQuality(currentLat, currentLon);
      }
    });
  });
  // Khi mới load trang, thì bật tab hôm nay
  setActiveTab('today');
});
