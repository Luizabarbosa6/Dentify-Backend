const Caso = require('../models/cases');
const periciado = require('../models/periciado');

exports.getDashboardResumo = async (req, res) => {
  try {
    const { periodo, sexo, etnia } = req.query;

    // Filtros para 'Caso'
    let filtroCaso = {};

    if (periodo && periodo !== 'todos') {
  const agora = new Date();
  let dataInicial;

  if (periodo === 'semana') {
    dataInicial = new Date(agora);
    dataInicial.setDate(agora.getDate() - 7);
  } else if (periodo === 'mes') {
    dataInicial = new Date(agora);
    dataInicial.setMonth(agora.getMonth() - 1);
  } else if (periodo === 'ano') {
    dataInicial = new Date(agora);
    dataInicial.setFullYear(agora.getFullYear() - 1);
  }

  filtroCaso.dataAbertura = { $gte: dataInicial };
}


    // Filtro por sexo para 'periciado'
    // (não usado em Caso)
    
    // Filtros para 'periciado'
    let filtroPericiado = {};
    if (sexo && sexo.toLowerCase() !== 'todos') {
  filtroPericiado.sexo = new RegExp(`^${sexo}$`, 'i'); // case-insensitive
}
if (etnia && etnia.toLowerCase() !== 'todos') {
  filtroPericiado.etnia = new RegExp(`^${etnia}$`, 'i'); // case-insensitive
}

    // Agregações

    // Por Status (caso)
    const porStatus = await Caso.aggregate([
      { $match: filtroCaso },
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

    // Por Tipo (caso)
    const porTipo = await Caso.aggregate([
      { $match: filtroCaso },
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

    // Por Sexo (periciado) - aqui foi corrigido para vir de periciado
    const porSexo = await periciado.aggregate([
      { $match: filtroPericiado },
      {
        $group: {
          _id: "$sexo",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          sexo: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    // Por Etnia (periciado)
    const porEtnia = await periciado.aggregate([
      { $match: filtroPericiado },
      {
        $group: {
          _id: "$etnia",
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          etnia: "$_id",
          total: 1,
          _id: 0
        }
      }
    ]);

    return res.status(200).json({
      porStatus,
      porTipo,
      porSexo,
      porEtnia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao gerar dados do dashboard' });
  }
};
