import type { Vehicle } from "../types";

export const koreaVehicles: Vehicle[] = [

  // =========================
  // Hyundai
  // =========================

  {
    id: 6001,
    brand: "Hyundai",
    model: "Inster",
    year: 2025,
    country: "South Korea",

    battery: 49,
    range: 355,
    efficiency: 13.8,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 120,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Front Center",
    fastCharge10to80: 30,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 85,
    maxTorque: 147,

    acceleration0to100: 10.6,
    topSpeed: 150,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 351,
    kerbWeight: 1465,
    wheelbase: 2580,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / Unlimited km",
  },

  {
    id: 6002,
    brand: "Hyundai",
    model: "Kona Electric",
    year: 2025,
    country: "South Korea",

    battery: 65.4,
    range: 514,
    efficiency: 12.7,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 102,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Front Center",
    fastCharge10to80: 43,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 160,
    maxTorque: 255,

    acceleration0to100: 7.8,
    topSpeed: 172,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 466,
    kerbWeight: 1740,
    wheelbase: 2660,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / Unlimited km",
  },

  {
    id: 6003,
    brand: "Hyundai",
    model: "IONIQ 5",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 570,
    efficiency: 14.7,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 260,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 239,
    maxTorque: 605,

    acceleration0to100: 5.3,
    topSpeed: 185,

    bodyType: "Crossover",

    seats: 5,
    bootSpace: 520,
    kerbWeight: 2145,
    wheelbase: 3000,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / Unlimited km",
  },

  {
    id: 6004,
    brand: "Hyundai",
    model: "IONIQ 5 N",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 448,
    efficiency: 18.8,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 260,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 478,
    maxTorque: 740,

    acceleration0to100: 3.4,
    topSpeed: 260,

    bodyType: "Crossover",

    seats: 5,
    bootSpace: 480,
    kerbWeight: 2235,
    wheelbase: 3000,

    adasLevel: "Level 2",
  },

  {
    id: 6005,
    brand: "Hyundai",
    model: "IONIQ 6",
    year: 2025,
    country: "South Korea",

    battery: 77.4,
    range: 614,
    efficiency: 12.6,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 260,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 239,
    maxTorque: 605,

    acceleration0to100: 5.1,
    topSpeed: 185,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 401,
    kerbWeight: 2100,
    wheelbase: 2950,

    adasLevel: "Level 2",
  },

  {
    id: 6006,
    brand: "Hyundai",
    model: "IONIQ 9",
    year: 2025,
    country: "South Korea",

    battery: 110.3,
    range: 620,
    efficiency: 17.8,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 350,

    connectorAC: "Type 2",
    connectorDC: "CCS2",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 24,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 320,
    maxTorque: 700,

    acceleration0to100: 5.2,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 7,
    bootSpace: 620,
    kerbWeight: 2650,
    wheelbase: 3130,

    adasLevel: "Level 2",
  },

  // =========================
  // Kia
  // =========================

  {
    id: 6007,
    brand: "Kia",
    model: "EV3",
    year: 2025,
    country: "South Korea",

    battery: 81.4,
    range: 605,
    efficiency: 13.5,
    batteryChemistry: "NMC",
    architecture: 400,
    acPower: 11,
    dcPower: 135,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Left",
    fastCharge10to80: 31,
    motorType: "Single Motor",
    drivetrain: "FWD",
    maxPower: 150,
    maxTorque: 283,
    acceleration0to100: 7.5,
    topSpeed: 170,
    bodyType: "SUV",
    seats: 5,
    bootSpace: 460,
    kerbWeight: 1850,
    wheelbase: 2680,
    adasLevel: "Level 2",
  },

  {
    id: 6008,
    brand: "Kia",
    model: "EV4",
    year: 2025,
    country: "South Korea",

    battery: 81.4,
    range: 630,
    efficiency: 12.9,
    batteryChemistry: "NMC",
    architecture: 400,
    acPower: 11,
    dcPower: 135,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Left",
    fastCharge10to80: 31,
    motorType: "Single Motor",
    drivetrain: "FWD",
    maxPower: 150,
    maxTorque: 283,
    acceleration0to100: 7.4,
    topSpeed: 170,
    bodyType: "Sedan",
    seats: 5,
    bootSpace: 490,
    kerbWeight: 1885,
    wheelbase: 2820,
    adasLevel: "Level 2",
  },

  {
    id: 6009,
    brand: "Kia",
    model: "EV5",
    year: 2025,
    country: "South Korea",

    battery: 88.1,
    range: 720,
    efficiency: 12.2,
    batteryChemistry: "NMC",
    architecture: 400,
    acPower: 11,
    dcPower: 150,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Left",
    fastCharge10to80: 27,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 230,
    maxTorque: 480,
    acceleration0to100: 6.1,
    topSpeed: 185,
    bodyType: "SUV",
    seats: 5,
    bootSpace: 513,
    kerbWeight: 2100,
    wheelbase: 2750,
    adasLevel: "Level 2",
  },

  {
    id: 6010,
    brand: "Kia",
    model: "EV6",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 582,
    efficiency: 14.4,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 260,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 239,
    maxTorque: 605,
    acceleration0to100: 5.2,
    topSpeed: 188,
    bodyType: "Crossover",
    seats: 5,
    bootSpace: 490,
    kerbWeight: 2125,
    wheelbase: 2900,
    adasLevel: "Level 2",
  },

  {
    id: 6011,
    brand: "Kia",
    model: "EV6 GT",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 450,
    efficiency: 18.7,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 260,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 478,
    maxTorque: 740,
    acceleration0to100: 3.5,
    topSpeed: 260,
    bodyType: "Crossover",
    seats: 5,
    bootSpace: 490,
    kerbWeight: 2205,
    wheelbase: 2900,
    adasLevel: "Level 2",
  },

  {
    id: 6012,
    brand: "Kia",
    model: "EV9",
    year: 2025,
    country: "South Korea",

    battery: 99.8,
    range: 563,
    efficiency: 17.7,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 210,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Rear Right",
    fastCharge10to80: 24,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 283,
    maxTorque: 700,
    acceleration0to100: 5.3,
    topSpeed: 200,
    bodyType: "SUV",
    seats: 7,
    bootSpace: 828,
    kerbWeight: 2645,
    wheelbase: 3100,
    adasLevel: "Level 2",
  },

  // =========================
  // Genesis
  // =========================

  {
    id: 6013,
    brand: "Genesis",
    model: "GV60",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 560,
    efficiency: 15.0,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 260,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Right",
    fastCharge10to80: 18,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 360,
    maxTorque: 700,
    acceleration0to100: 4.0,
    topSpeed: 235,
    bodyType: "Luxury SUV",
    seats: 5,
    bootSpace: 432,
    kerbWeight: 2145,
    wheelbase: 2900,
    adasLevel: "Level 2",
  },

  {
    id: 6014,
    brand: "Genesis",
    model: "Electrified G80",
    year: 2025,
    country: "South Korea",

    battery: 94.5,
    range: 570,
    efficiency: 16.6,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 260,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Left",
    fastCharge10to80: 22,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 272,
    maxTorque: 700,
    acceleration0to100: 4.9,
    topSpeed: 225,
    bodyType: "Luxury Sedan",
    seats: 5,
    bootSpace: 354,
    kerbWeight: 2285,
    wheelbase: 3010,
    adasLevel: "Level 2",
  },

  {
    id: 6015,
    brand: "Genesis",
    model: "Electrified GV70",
    year: 2025,
    country: "South Korea",

    battery: 84,
    range: 480,
    efficiency: 17.5,
    batteryChemistry: "NMC",
    architecture: 800,
    acPower: 11,
    dcPower: 260,
    connectorAC: "Type 2",
    connectorDC: "CCS2",
    chargingPortLocation: "Front Left",
    fastCharge10to80: 18,
    motorType: "Dual Motor",
    drivetrain: "AWD",
    maxPower: 360,
    maxTorque: 700,
    acceleration0to100: 4.2,
    topSpeed: 235,
    bodyType: "Luxury SUV",
    seats: 5,
    bootSpace: 503,
    kerbWeight: 2285,
    wheelbase: 2875,
    adasLevel: "Level 2",
  },

];