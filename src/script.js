import Experience from './scripts/basis/Experience'
import sources from './sources'

const defaultTime = new Date();
defaultTime.setHours(18, 48, 0, 0);

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  getSunsetTime(latitude, longitude);
}, error => {
  console.error('Error getting geolocation:', error);

  createExperience(defaultTime)
});


function getSunsetTime(latitude, longitude) {
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const sunsetTime = new Date(data.results.sunset);

      createExperience(sunsetTime)
    })
    .catch(error => {
      console.error('Error:', error);

      createExperience(defaultTime)
    });
}

function createExperience(time) {
  var experience = new Experience(document.querySelector('canvas.webgl'), sources, time)
}