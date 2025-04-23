const Caso = require('../models/cases');

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

    res.status(200).json({
      porStatus,
      porTipo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar dados do dashboard' });
  }
};
