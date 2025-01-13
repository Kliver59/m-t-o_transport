function updateDateTime() {
  const now = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = now.toLocaleDateString("fr-FR", options);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Mise à jour de l'élément #date-time
  const dateTimeElement = document.getElementById("date-time");
  dateTimeElement.innerHTML = `${formattedDate} - ${formattedTime}`;
}

// Mettre à jour la date et l'heure toutes les secondes
setInterval(updateDateTime, 1000);

// Appel initial pour afficher l'heure immédiatement
updateDateTime();

// Code pour récupérer les données météo et afficher les villes comme précédemment

fetch("conf.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Erreur lors du chargement du fichier conf.json : ${response.statusText}`
      );
    }
    return response.json();
  })
  .then((config) => {
    const { cities, apiKey } = config;

    // Fonction pour récupérer et afficher les données météo pour chaque ville
    const updateWeatherForCity = (city) => {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

      fetch(weatherUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erreur API pour la ville ${city} : ${response.statusText} (Code: ${response.status})`
            );
          }
          return response.json();
        })
        .then((data) => {
          if (data.main && data.weather) {
            const cityContainer = document.createElement("div");
            cityContainer.classList.add("city-container");

            // Informations météorologiques de la ville
            const wind = data.wind.speed ? `Vent : ${data.wind.speed} m/s` : "";
            const rain = data.rain ? `Pluie : ${data.rain["1h"]} mm` : "";

            cityContainer.innerHTML = `
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                            <h2>${data.name}</h2>
                            <p class="temp">${data.main.temp.toFixed(1)}°C</p>
                            <p class="condition">${data.weather[0].description}</p>
                            <p class="additional-info">${wind}</p>
                            <p class="additional-info">${rain}</p>
                        `;

            // Ajoute la carte de la ville dans le conteneur principal
            document
              .getElementById("city-cards-container")
              .appendChild(cityContainer);
          } else {
            throw new Error(`Données inattendues reçues pour la ville ${city}`);
          }
        })
        .catch((error) =>
          console.error(
            `Erreur lors de la récupération des données météo pour ${city} :`,
            error
          )
        );
    };

    // Mettre à jour toutes les villes
    cities.forEach((city) => {
      updateWeatherForCity(city);
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement de la configuration :", error)
  );

const Title = "Bienvenue dans mon projet WEB météo";

console.log(Title);
