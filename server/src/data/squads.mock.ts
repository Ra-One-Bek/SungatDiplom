export const squadsMock = {
  astana: {
    formation: '4-3-3',
    lineup: [
      { id: 1, playerId: 1, name: 'Stas Pokatilov', role: 'GK', top: '90%', left: '50%' },
      { id: 2, playerId: 3, name: 'Yan Vorogovskiy', role: 'LB', top: '74%', left: '18%' },
      { id: 3, playerId: 2, name: 'Nuraly Alip', role: 'CB', top: '77%', left: '38%' },
      { id: 4, playerId: 4, name: 'Islambek Kuat', role: 'CB', top: '77%', left: '62%' },
      { id: 5, playerId: 2, name: 'Nuraly Alip', role: 'RB', top: '74%', left: '82%' },
      { id: 6, playerId: 4, name: 'Islambek Kuat', role: 'CM', top: '58%', left: '35%' },
      { id: 7, playerId: 4, name: 'Islambek Kuat', role: 'CM', top: '58%', left: '65%' },
      { id: 8, playerId: 6, name: 'Marin Tomasov', role: 'CAM', top: '50%', left: '50%' },
      { id: 9, playerId: 6, name: 'Marin Tomasov', role: 'LW', top: '30%', left: '20%' },
      { id: 10, playerId: 7, name: 'Igor Sergeev', role: 'ST', top: '20%', left: '50%' },
      { id: 11, playerId: 5, name: 'Abat Aymbetov', role: 'RW', top: '30%', left: '80%' },
    ],
    bench: [
      { id: 101, playerId: 5, name: 'Abat Aymbetov', position: 'ST' },
      { id: 102, playerId: 2, name: 'Nuraly Alip', position: 'CB' },
    ],
    reserves: [
      { id: 201, playerId: 3, name: 'Yan Vorogovskiy', position: 'LB' },
    ],
    recommendation: {
      title: 'Рекомендация по составу',
      message: 'Астана хорошо выглядит в 4-3-3 с акцентом на быстрые фланги и контроль центра.',
      level: 'good',
    },
    setPieces: {
      penalty: 7,
      freeKick: 6,
      corner: 6,
      captain: 4,
    },
  },

  kairat: {
    formation: '4-3-3',
    lineup: [
      { id: 1, playerId: 101, name: 'João Paulo', role: 'GK', top: '90%', left: '50%' },
      { id: 2, playerId: 103, name: 'Gafurzhan Suyumbayev', role: 'LB', top: '74%', left: '18%' },
      { id: 3, playerId: 102, name: 'Rade Dugalić', role: 'CB', top: '77%', left: '38%' },
      { id: 4, playerId: 102, name: 'Rade Dugalić', role: 'CB', top: '77%', left: '62%' },
      { id: 5, playerId: 104, name: 'Aibol Abiken', role: 'RB', top: '74%', left: '82%' },
      { id: 6, playerId: 104, name: 'Aibol Abiken', role: 'CM', top: '58%', left: '35%' },
      { id: 7, playerId: 104, name: 'Aibol Abiken', role: 'CM', top: '58%', left: '65%' },
      { id: 8, playerId: 106, name: 'Dastan Satpayev', role: 'CAM', top: '50%', left: '50%' },
      { id: 9, playerId: 106, name: 'Dastan Satpayev', role: 'LW', top: '30%', left: '20%' },
      { id: 10, playerId: 105, name: 'Vagner Love', role: 'ST', top: '20%', left: '50%' },
      { id: 11, playerId: 106, name: 'Dastan Satpayev', role: 'RW', top: '30%', left: '80%' },
    ],
    bench: [
      { id: 101, playerId: 103, name: 'Gafurzhan Suyumbayev', position: 'LB' },
      { id: 102, playerId: 104, name: 'Aibol Abiken', position: 'CDM' },
    ],
    reserves: [
      { id: 201, playerId: 102, name: 'Rade Dugalić', position: 'CB' },
    ],
    recommendation: {
      title: 'Рекомендация по составу',
      message: 'Кайрат лучше раскрывается через высокую активность флангов и завершение атак в штрафной.',
      level: 'good',
    },
    setPieces: {
      penalty: 105,
      freeKick: 106,
      corner: 106,
      captain: 102,
    },
  },

  kaisar: {
    formation: '4-3-3',
    lineup: [
      { id: 1, playerId: 201, name: 'Stas Pokatilov', role: 'GK', top: '90%', left: '50%' },
      { id: 2, playerId: 205, name: 'Nurbol Zhumaskaliyev', role: 'LB', top: '74%', left: '18%' },
      { id: 3, playerId: 202, name: 'Aset Tagybergen', role: 'CB', top: '77%', left: '38%' },
      { id: 4, playerId: 205, name: 'Nurbol Zhumaskaliyev', role: 'CB', top: '77%', left: '62%' },
      { id: 5, playerId: 203, name: 'Serikzhan Muzhikov', role: 'RB', top: '74%', left: '82%' },
      { id: 6, playerId: 205, name: 'Nurbol Zhumaskaliyev', role: 'CM', top: '58%', left: '35%' },
      { id: 7, playerId: 202, name: 'Aset Tagybergen', role: 'CM', top: '58%', left: '65%' },
      { id: 8, playerId: 202, name: 'Aset Tagybergen', role: 'CAM', top: '50%', left: '50%' },
      { id: 9, playerId: 204, name: 'Yerkebulan Tungyshbayev', role: 'LW', top: '30%', left: '20%' },
      { id: 10, playerId: 203, name: 'Serikzhan Muzhikov', role: 'ST', top: '20%', left: '50%' },
      { id: 11, playerId: 203, name: 'Serikzhan Muzhikov', role: 'RW', top: '30%', left: '80%' },
    ],
    bench: [
      { id: 101, playerId: 204, name: 'Yerkebulan Tungyshbayev', position: 'LW' },
      { id: 102, playerId: 205, name: 'Nurbol Zhumaskaliyev', position: 'CM' },
    ],
    reserves: [
      { id: 201, playerId: 203, name: 'Serikzhan Muzhikov', position: 'RM' },
    ],
    recommendation: {
      title: 'Рекомендация по составу',
      message: 'Кайсар выглядит лучше, когда играет компактно и использует организованный центр поля.',
      level: 'good',
    },
    setPieces: {
      penalty: 202,
      freeKick: 202,
      corner: 203,
      captain: 202,
    },
  },
};