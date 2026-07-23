export interface Charger {
    id: string;
    name: string;
    type: "AC" | "DC";
    power: number;
  }
  
  export const chargers: Charger[] = [
    // Home AC
    { id: "home-1.4", name: "🏠 Home Charging - 1.4 kW", type: "AC", power: 1.4 },
    { id: "home-2.3", name: "🏠 Home Charging - 2.3 kW", type: "AC", power: 2.3 },
    { id: "home-3.3", name: "🏠 Home Charging - 3.3 kW", type: "AC", power: 3.3 },
    { id: "home-3.7", name: "🏠 Home Charging - 3.7 kW", type: "AC", power: 3.7 },
    { id: "home-4.6", name: "🏠 Home Charging - 4.6 kW", type: "AC", power: 4.6 },
    { id: "home-5.5", name: "🏠 Home Charging - 5.5 kW", type: "AC", power: 5.5 },
    { id: "home-6.6", name: "🏠 Home Charging - 6.6 kW", type: "AC", power: 6.6 },
    { id: "home-7.2", name: "🏠 Home Charging - 7.2 kW", type: "AC", power: 7.2 },
    { id: "home-7.4", name: "🏠 Home Charging - 7.4 kW", type: "AC", power: 7.4 },
    { id: "home-11", name: "🏠 Home Charging - 11 kW", type: "AC", power: 11 },
    { id: "home-22", name: "🏠 Home Charging - 22 kW", type: "AC", power: 22 },
  
    // Public AC
    { id: "ac-7.4", name: "🏢 Public AC - 7.4 kW", type: "AC", power: 7.4 },
    { id: "ac-11", name: "🏢 Public AC - 11 kW", type: "AC", power: 11 },
    { id: "ac-22", name: "🏢 Public AC - 22 kW", type: "AC", power: 22 },
    { id: "ac-43", name: "🏢 Public AC - 43 kW", type: "AC", power: 43 },
  
    // DC Fast
    { id: "dc-25", name: "⚡ DC Fast - 25 kW", type: "DC", power: 25 },
    { id: "dc-30", name: "⚡ DC Fast - 30 kW", type: "DC", power: 30 },
    { id: "dc-50", name: "⚡ DC Fast - 50 kW", type: "DC", power: 50 },
    { id: "dc-60", name: "⚡ DC Fast - 60 kW", type: "DC", power: 60 },
    { id: "dc-90", name: "⚡ DC Fast - 90 kW", type: "DC", power: 90 },
    { id: "dc-120", name: "⚡ DC Fast - 120 kW", type: "DC", power: 120 },
    { id: "dc-150", name: "⚡ DC Fast - 150 kW", type: "DC", power: 150 },
    { id: "dc-180", name: "⚡ DC Fast - 180 kW", type: "DC", power: 180 },
    { id: "dc-240", name: "⚡ DC Fast - 240 kW", type: "DC", power: 240 },
    { id: "dc-350", name: "⚡ DC Fast - 350 kW", type: "DC", power: 350 },
  ];