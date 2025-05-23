const Caso = require('../models/cases');
const periciado = require('../models/periciado');

exports.getDashboardResumo = async (req, res) => {
  try {
    // 1. Agrupamento por Status
    const porStatus = await Caso.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          status: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    // 2. Agrupamento por Tipo
    const porTipo = await Caso.aggregate([
      {
        $group: {
          _id: "$tipo",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          tipo: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    const porSexo = await Caso.aggregate([
      {
        $group: {
          _id: "$sexo",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          status: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);


    const porEtnia = await periciado.aggregate([
      {
        $group: {
          _id: "$etnia",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          status: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);


    res.status(200).json({
      porStatus,
      porTipo,
      porSexo,
      porEtnia
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar dados do dashboard' });
  }
};
