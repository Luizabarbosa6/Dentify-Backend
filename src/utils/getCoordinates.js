// utils/getCoordinates.js
const fetch = require('node-fetch');

const getCoordinates = async (address) => {
  if (!address) return null;

  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Dentify/1.0 (contato.dentify@gmail.com)' // <- email qualquer, mesmo gratuito
      }
    });

    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    return null;
  }
};

module.exports = getCoordinates;
