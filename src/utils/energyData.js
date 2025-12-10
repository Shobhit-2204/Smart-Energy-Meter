const energyData = {
  monthlyStats: {
    totalPower: 333,
    totalBill: 1998
  },
  devices: [
    {
      id: 1,
      name: 'Bulb',
      icon: 'lightbulb',
      color: 'bg-blue-500',
      voltage: 220,
      current: 0.45,
      energyMonth: 45,
      powerRating: 100,
      isOn: true
    },
    {
      id: 2,
      name: 'Laptop Charger',
      icon: 'laptop',
      color: 'bg-green-500',
      voltage: 220,
      current: 0.82,
      energyMonth: 78,
      powerRating: 180,
      isOn: true
    },
    {
      id: 3,
      name: 'AC',
      icon: 'wind',
      color: 'bg-orange-500',
      voltage: 220,
      current: 4.5,
      energyMonth: 210,
      powerRating: 1000,
      isOn: false
    }
  ]
};

export default energyData;
