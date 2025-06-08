const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function gerarLegendaComBlip2(imageUrl) {
  try {
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          image: imageUrl,
        },
      }
    );

    return output;
  } catch (error) {
    console.error("Erro ao gerar legenda com BLIP-2:", error?.response?.data || error.message);
    throw new Error("Erro ao gerar legenda com BLIP-2.");
  }
}

module.exports = { gerarLegendaComBlip2 };
