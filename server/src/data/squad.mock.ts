export const squadMock = {
  formation: '4-3-3',
  lineup: [
    { id: 1, playerId: 1, name: 'Oblak', role: 'GK', top: '90%', left: '50%' },
    { id: 2, playerId: 3, name: 'Molina', role: 'RB', top: '74%', left: '82%' },
    { id: 3, playerId: 2, name: 'Giménez', role: 'CB', top: '77%', left: '62%' },
    { id: 4, playerId: 11, name: 'Witsel', role: 'CB', top: '77%', left: '38%' },
    { id: 5, playerId: 4, name: 'Reinildo', role: 'LB', top: '74%', left: '18%' },
    { id: 6, playerId: 5, name: 'Koke', role: 'CM', top: '58%', left: '50%' },
    { id: 7, playerId: 6, name: 'De Paul', role: 'CM', top: '61%', left: '68%' },
    { id: 8, playerId: 7, name: 'Llorente', role: 'CM', top: '61%', left: '32%' },
    { id: 9, playerId: 10, name: 'Lino', role: 'LW', top: '30%', left: '20%' },
    { id: 10, playerId: 8, name: 'Griezmann', role: 'ST', top: '20%', left: '50%' },
    { id: 11, playerId: 9, name: 'Morata', role: 'RW', top: '30%', left: '80%' },
  ],
  bench: [
    { id: 101, playerId: 12, name: 'Memphis Depay', position: 'ST' },
    { id: 102, playerId: 13, name: 'César Azpilicueta', position: 'CB' },
    { id: 103, playerId: 14, name: 'Javi Galán', position: 'LB' },
    { id: 104, playerId: 15, name: 'Saúl Ñíguez', position: 'CM' },
    { id: 105, playerId: 16, name: 'Pablo Barrios', position: 'CM' },
  ],
  reserves: [
    { id: 201, playerId: 17, name: 'Ángel Correa', position: 'ST' },
    { id: 202, playerId: 18, name: 'Antonio Gomis', position: 'GK' },
  ],
  recommendation: {
    title: 'Рекомендация по составу',
    message:
      'Текущая схема 4-3-3 хорошо подходит для быстрых переходов в атаку.',
    level: 'good',
  },
};