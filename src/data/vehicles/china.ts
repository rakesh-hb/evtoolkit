import type { Vehicle } from "../types";

export const chinaVehicles: Vehicle[] = [
  // =========================
  // BYD
  // =========================

  {
    id: 4001,
    brand: "BYD",
    model: "Dolphin",
    year: 2025,
    country: "China",

    battery: 60.5,
    range: 427,
    efficiency: 14.2,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 7,
    dcPower: 88,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Right",
    fastCharge10to80: 40,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 150,
    maxTorque: 310,

    acceleration0to100: 7.0,
    topSpeed: 160,

    bodyType: "Hatchback",

    seats: 5,
    bootSpace: 345,
    kerbWeight: 1658,
    wheelbase: 2700,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4002,
    brand: "BYD",
    model: "Seagull",
    year: 2025,
    country: "China",

    battery: 38.9,
    range: 405,
    efficiency: 9.6,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 6.6,
    dcPower: 40,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Right",
    fastCharge10to80: 30,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 55,
    maxTorque: 135,

    acceleration0to100: 13.0,
    topSpeed: 130,

    bodyType: "Hatchback",

    seats: 4,
    bootSpace: 230,
    kerbWeight: 1240,
    wheelbase: 2500,

    adasLevel: "None",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4003,
    brand: "BYD",
    model: "Atto 3",
    year: 2025,
    country: "China",

    battery: 60.5,
    range: 420,
    efficiency: 14.4,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 7,
    dcPower: 88,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Right",
    fastCharge10to80: 40,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 150,
    maxTorque: 310,

    acceleration0to100: 7.3,
    topSpeed: 160,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 440,
    kerbWeight: 1750,
    groundClearance: 175,
    wheelbase: 2720,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4004,
    brand: "BYD",
    model: "Seal",
    year: 2025,
    country: "China",

    battery: 82.5,
    range: 650,
    efficiency: 12.7,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 150,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 390,
    maxTorque: 670,

    acceleration0to100: 3.8,
    topSpeed: 180,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 400,
    kerbWeight: 2185,
    wheelbase: 2920,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4005,
    brand: "BYD",
    model: "Sealion 7",
    year: 2025,
    country: "China",

    battery: 82.5,
    range: 567,
    efficiency: 14.6,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 230,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 24,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 390,
    maxTorque: 690,

    acceleration0to100: 4.5,
    topSpeed: 215,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 520,
    kerbWeight: 2340,
    groundClearance: 178,
    wheelbase: 2930,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4006,
    brand: "BYD",
    model: "Han EV",
    year: 2025,
    country: "China",

    battery: 85.4,
    range: 701,
    efficiency: 12.2,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 155,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 380,
    maxTorque: 700,

    acceleration0to100: 3.9,
    topSpeed: 185,

    bodyType: "Luxury Sedan",

    seats: 5,
    bootSpace: 410,
    kerbWeight: 2250,
    wheelbase: 2920,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4007,
    brand: "BYD",
    model: "Tang EV",
    year: 2025,
    country: "China",

    battery: 108.8,
    range: 635,
    efficiency: 17.1,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 170,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 380,
    maxTorque: 700,

    acceleration0to100: 4.4,
    topSpeed: 190,

    bodyType: "SUV",

    seats: 7,
    bootSpace: 940,
    kerbWeight: 2560,
    groundClearance: 180,
    wheelbase: 2820,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

    // =========================
  // NIO
  // =========================

  {
    id: 4008,
    brand: "NIO",
    model: "ET5",
    year: 2025,
    country: "China",

    battery: 75,
    range: 560,
    efficiency: 13.4,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 360,
    maxTorque: 700,

    acceleration0to100: 4.0,
    topSpeed: 200,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 386,
    kerbWeight: 2145,
    wheelbase: 2888,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4009,
    brand: "NIO",
    model: "ET5 Touring",
    year: 2025,
    country: "China",

    battery: 75,
    range: 530,
    efficiency: 14.2,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 360,
    maxTorque: 700,

    acceleration0to100: 4.0,
    topSpeed: 200,

    bodyType: "Crossover",

    seats: 5,
    bootSpace: 450,
    kerbWeight: 2190,
    wheelbase: 2888,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4010,
    brand: "NIO",
    model: "ET7",
    year: 2025,
    country: "China",

    battery: 100,
    range: 705,
    efficiency: 14.2,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 28,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 480,
    maxTorque: 850,

    acceleration0to100: 3.8,
    topSpeed: 200,

    bodyType: "Luxury Sedan",

    seats: 5,
    bootSpace: 363,
    kerbWeight: 2360,
    wheelbase: 3060,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4011,
    brand: "NIO",
    model: "ET9",
    year: 2025,
    country: "China",

    battery: 120,
    range: 650,
    efficiency: 18.5,

    batteryChemistry: "NMC",
    architecture: 900,

    acPower: 22,
    dcPower: 600,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 520,
    maxTorque: 700,

    acceleration0to100: 4.3,
    topSpeed: 220,

    bodyType: "Luxury Sedan",

    seats: 5,
    bootSpace: 510,
    kerbWeight: 2700,
    wheelbase: 3250,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4012,
    brand: "NIO",
    model: "EL6",
    year: 2025,
    country: "China",

    battery: 75,
    range: 500,
    efficiency: 15.0,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 30,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 360,
    maxTorque: 700,

    acceleration0to100: 4.5,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 597,
    kerbWeight: 2255,
    groundClearance: 185,
    wheelbase: 2915,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4013,
    brand: "NIO",
    model: "EL8",
    year: 2025,
    country: "China",

    battery: 100,
    range: 605,
    efficiency: 16.5,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 28,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 480,
    maxTorque: 850,

    acceleration0to100: 4.1,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 6,
    bootSpace: 810,
    kerbWeight: 2565,
    groundClearance: 190,
    wheelbase: 3070,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4014,
    brand: "NIO",
    model: "EC6",
    year: 2025,
    country: "China",

    battery: 100,
    range: 630,
    efficiency: 15.9,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 28,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 360,
    maxTorque: 700,

    acceleration0to100: 4.4,
    topSpeed: 200,

    bodyType: "SUV Coupe",

    seats: 5,
    bootSpace: 594,
    kerbWeight: 2315,
    groundClearance: 185,
    wheelbase: 2915,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

    // =========================
  // XPENG
  // =========================

  {
    id: 4015,
    brand: "XPENG",
    model: "MONA M03",
    year: 2025,
    country: "China",

    battery: 62.2,
    range: 620,
    efficiency: 10.0,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 120,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 26,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 160,
    maxTorque: 250,

    acceleration0to100: 7.4,
    topSpeed: 155,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 621,
    kerbWeight: 1739,
    wheelbase: 2815,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4016,
    brand: "XPENG",
    model: "P7i",
    year: 2025,
    country: "China",

    battery: 86.2,
    range: 702,
    efficiency: 12.3,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 175,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 29,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 348,
    maxTorque: 757,

    acceleration0to100: 3.9,
    topSpeed: 200,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 440,
    kerbWeight: 2090,
    wheelbase: 2998,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4017,
    brand: "XPENG",
    model: "P7+",
    year: 2025,
    country: "China",

    battery: 76.3,
    range: 710,
    efficiency: 10.7,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 175,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 22,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 230,
    maxTorque: 450,

    acceleration0to100: 5.9,
    topSpeed: 200,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 725,
    kerbWeight: 1960,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4018,
    brand: "XPENG",
    model: "G6",
    year: 2025,
    country: "China",

    battery: 87.5,
    range: 755,
    efficiency: 11.6,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 280,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 358,
    maxTorque: 660,

    acceleration0to100: 3.9,
    topSpeed: 202,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 571,
    kerbWeight: 2095,
    groundClearance: 180,
    wheelbase: 2890,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4019,
    brand: "XPENG",
    model: "G9",
    year: 2025,
    country: "China",

    battery: 98,
    range: 725,
    efficiency: 13.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 315,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 405,
    maxTorque: 717,

    acceleration0to100: 3.9,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 5,
    bootSpace: 660,
    kerbWeight: 2235,
    groundClearance: 185,
    wheelbase: 2998,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4020,
    brand: "XPENG",
    model: "X9",
    year: 2025,
    country: "China",

    battery: 101.5,
    range: 702,
    efficiency: 14.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 330,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 370,
    maxTorque: 640,

    acceleration0to100: 5.7,
    topSpeed: 200,

    bodyType: "MPV",

    seats: 7,
    bootSpace: 755,
    kerbWeight: 2640,
    wheelbase: 3160,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

    // =========================
  // Zeekr
  // =========================

  {
    id: 4021,
    brand: "Zeekr",
    model: "X",
    year: 2025,
    country: "China",

    battery: 66,
    range: 560,
    efficiency: 11.8,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 150,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 28,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 315,
    maxTorque: 543,

    acceleration0to100: 3.8,
    topSpeed: 190,

    bodyType: "Crossover",

    seats: 5,
    bootSpace: 362,
    kerbWeight: 1960,
    groundClearance: 191,
    wheelbase: 2750,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4022,
    brand: "Zeekr",
    model: "001",
    year: 2025,
    country: "China",

    battery: 100,
    range: 750,
    efficiency: 13.3,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 360,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 15,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 580,
    maxTorque: 810,

    acceleration0to100: 3.3,
    topSpeed: 240,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 539,
    kerbWeight: 2350,
    wheelbase: 3005,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4023,
    brand: "Zeekr",
    model: "007",
    year: 2025,
    country: "China",

    battery: 100,
    range: 870,
    efficiency: 11.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 500,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 15,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 475,
    maxTorque: 710,

    acceleration0to100: 2.8,
    topSpeed: 210,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 462,
    kerbWeight: 2290,
    wheelbase: 2928,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4024,
    brand: "Zeekr",
    model: "7X",
    year: 2025,
    country: "China",

    battery: 100,
    range: 780,
    efficiency: 12.8,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 500,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 15,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 475,
    maxTorque: 710,

    acceleration0to100: 3.8,
    topSpeed: 210,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 616,
    kerbWeight: 2395,
    groundClearance: 180,
    wheelbase: 2925,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4025,
    brand: "Zeekr",
    model: "009",
    year: 2025,
    country: "China",

    battery: 116,
    range: 822,
    efficiency: 14.1,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 500,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 16,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 580,
    maxTorque: 810,

    acceleration0to100: 4.5,
    topSpeed: 230,

    bodyType: "MPV",

    seats: 6,
    bootSpace: 590,
    kerbWeight: 2830,
    wheelbase: 3205,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4026,
    brand: "Zeekr",
    model: "MIX",
    year: 2025,
    country: "China",

    battery: 102,
    range: 702,
    efficiency: 14.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 500,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 15,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 310,
    maxTorque: 440,

    acceleration0to100: 6.8,
    topSpeed: 180,

    bodyType: "MPV",

    seats: 5,
    bootSpace: 568,
    kerbWeight: 2640,
    wheelbase: 3008,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 200,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

    // =========================
  // Xiaomi
  // =========================

  {
    id: 4027,
    brand: "Xiaomi",
    model: "SU7",
    year: 2025,
    country: "China",

    battery: 73.6,
    range: 700,
    efficiency: 10.5,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 220,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 25,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 220,
    maxTorque: 400,

    acceleration0to100: 5.3,
    topSpeed: 210,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 517,
    kerbWeight: 1980,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

  {
    id: 4028,
    brand: "Xiaomi",
    model: "SU7 Pro",
    year: 2025,
    country: "China",

    battery: 94.3,
    range: 830,
    efficiency: 11.4,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 350,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 19,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 220,
    maxTorque: 400,

    acceleration0to100: 5.7,
    topSpeed: 210,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 517,
    kerbWeight: 2090,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

  {
    id: 4029,
    brand: "Xiaomi",
    model: "SU7 Max",
    year: 2025,
    country: "China",

    battery: 101,
    range: 800,
    efficiency: 12.6,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 486,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 19,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 495,
    maxTorque: 838,

    acceleration0to100: 2.8,
    topSpeed: 265,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 517,
    kerbWeight: 2205,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

  {
    id: 4030,
    brand: "Xiaomi",
    model: "SU7 Ultra",
    year: 2025,
    country: "China",

    battery: 93.7,
    range: 630,
    efficiency: 14.9,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 480,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Tri Motor",
    drivetrain: "AWD",

    maxPower: 1138,
    maxTorque: 1770,

    acceleration0to100: 1.98,
    topSpeed: 350,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 517,
    kerbWeight: 2360,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

  {
    id: 4031,
    brand: "Xiaomi",
    model: "YU7",
    year: 2025,
    country: "China",

    battery: 101,
    range: 760,
    efficiency: 13.3,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 486,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 19,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 508,
    maxTorque: 690,

    acceleration0to100: 3.2,
    topSpeed: 253,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 678,
    kerbWeight: 2405,
    groundClearance: 185,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

    // =========================
  // Li Auto
  // =========================

  {
    id: 4032,
    brand: "Li Auto",
    model: "MEGA",
    year: 2025,
    country: "China",

    battery: 102.7,
    range: 710,
    efficiency: 14.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 520,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 12,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 400,
    maxTorque: 542,

    acceleration0to100: 5.5,
    topSpeed: 180,

    bodyType: "MPV",

    seats: 7,
    bootSpace: 500,
    kerbWeight: 2785,
    wheelbase: 3300,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 100,000 km",
  },

  // =========================
  // AITO
  // =========================

  {
    id: 4033,
    brand: "AITO",
    model: "M5 EV",
    year: 2025,
    country: "China",

    battery: 83,
    range: 620,
    efficiency: 13.4,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 240,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 365,
    maxTorque: 675,

    acceleration0to100: 4.3,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 520,
    kerbWeight: 2235,
    groundClearance: 180,
    wheelbase: 2880,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 100,000 km",
  },

  {
    id: 4034,
    brand: "AITO",
    model: "M8 EV",
    year: 2025,
    country: "China",

    battery: 100,
    range: 705,
    efficiency: 14.2,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 300,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 390,
    maxTorque: 673,

    acceleration0to100: 4.6,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 6,
    bootSpace: 850,
    kerbWeight: 2520,
    groundClearance: 185,
    wheelbase: 3105,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 100,000 km",
  },

  {
    id: 4035,
    brand: "AITO",
    model: "M9 EV",
    year: 2025,
    country: "China",

    battery: 100,
    range: 630,
    efficiency: 15.9,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 300,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 390,
    maxTorque: 673,

    acceleration0to100: 4.9,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 6,
    bootSpace: 950,
    kerbWeight: 2610,
    groundClearance: 190,
    wheelbase: 3110,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 100,000 km",
  },

  // =========================
  // Denza
  // =========================

  {
    id: 4036,
    brand: "Denza",
    model: "N7",
    year: 2025,
    country: "China",

    battery: 91.3,
    range: 702,
    efficiency: 13.0,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 230,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 25,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 390,
    maxTorque: 670,

    acceleration0to100: 3.9,
    topSpeed: 180,

    bodyType: "Luxury SUV",

    seats: 5,
    bootSpace: 480,
    kerbWeight: 2330,
    groundClearance: 180,
    wheelbase: 2940,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  {
    id: 4037,
    brand: "Denza",
    model: "Z9 GT",
    year: 2025,
    country: "China",

    battery: 100,
    range: 630,
    efficiency: 15.9,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 270,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 19,

    motorType: "Tri Motor",
    drivetrain: "AWD",

    maxPower: 710,
    maxTorque: 952,

    acceleration0to100: 3.4,
    topSpeed: 240,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 488,
    kerbWeight: 2875,
    wheelbase: 3125,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

    // =========================
  // Leapmotor
  // =========================

  {
    id: 4038,
    brand: "Leapmotor",
    model: "T03",
    year: 2025,
    country: "China",

    battery: 41.3,
    range: 403,
    efficiency: 10.2,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 6.6,
    dcPower: 48,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Right",
    fastCharge10to80: 36,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 80,
    maxTorque: 158,

    acceleration0to100: 12.7,
    topSpeed: 130,

    bodyType: "Hatchback",

    seats: 4,
    bootSpace: 210,
    kerbWeight: 1195,
    wheelbase: 2400,

    adasLevel: "Level 2",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  {
    id: 4039,
    brand: "Leapmotor",
    model: "B10",
    year: 2025,
    country: "China",

    battery: 67.1,
    range: 600,
    efficiency: 11.2,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 160,
    maxTorque: 240,

    acceleration0to100: 6.8,
    topSpeed: 170,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 500,
    kerbWeight: 1815,
    groundClearance: 180,
    wheelbase: 2735,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  {
    id: 4040,
    brand: "Leapmotor",
    model: "C10",
    year: 2025,
    country: "China",

    battery: 69.9,
    range: 530,
    efficiency: 13.2,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 200,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 170,
    maxTorque: 320,

    acceleration0to100: 7.3,
    topSpeed: 170,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 581,
    kerbWeight: 1980,
    groundClearance: 180,
    wheelbase: 2825,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  {
    id: 4041,
    brand: "Leapmotor",
    model: "C16",
    year: 2025,
    country: "China",

    battery: 74.9,
    range: 580,
    efficiency: 12.9,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 215,
    maxTorque: 360,

    acceleration0to100: 6.4,
    topSpeed: 180,

    bodyType: "SUV",

    seats: 6,
    bootSpace: 620,
    kerbWeight: 2105,
    groundClearance: 185,
    wheelbase: 2825,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

    // =========================
  // Deepal
  // =========================

  {
    id: 4042,
    brand: "Deepal",
    model: "S05",
    year: 2025,
    country: "China",

    battery: 68.8,
    range: 620,
    efficiency: 11.1,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 175,
    maxTorque: 320,

    acceleration0to100: 7.2,
    topSpeed: 180,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 492,
    kerbWeight: 1885,
    groundClearance: 180,
    wheelbase: 2880,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  {
    id: 4043,
    brand: "Deepal",
    model: "S07",
    year: 2025,
    country: "China",

    battery: 79.9,
    range: 620,
    efficiency: 12.9,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 220,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 190,
    maxTorque: 320,

    acceleration0to100: 6.7,
    topSpeed: 180,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 570,
    kerbWeight: 1985,
    groundClearance: 185,
    wheelbase: 2900,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  {
    id: 4044,
    brand: "Deepal",
    model: "L07",
    year: 2025,
    country: "China",

    battery: 79.9,
    range: 650,
    efficiency: 12.3,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 220,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 190,
    maxTorque: 320,

    acceleration0to100: 6.5,
    topSpeed: 185,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 445,
    kerbWeight: 1945,
    wheelbase: 2900,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "4 years / 120,000 km",
  },

  // =========================
  // Avatr
  // =========================

  {
    id: 4045,
    brand: "Avatr",
    model: "07",
    year: 2025,
    country: "China",

    battery: 82.2,
    range: 650,
    efficiency: 12.6,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 240,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 440,
    maxTorque: 650,

    acceleration0to100: 4.2,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 500,
    kerbWeight: 2250,
    groundClearance: 185,
    wheelbase: 2940,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4046,
    brand: "Avatr",
    model: "11",
    year: 2025,
    country: "China",

    battery: 116.8,
    range: 730,
    efficiency: 16.0,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 240,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 425,
    maxTorque: 650,

    acceleration0to100: 3.9,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 5,
    bootSpace: 540,
    kerbWeight: 2365,
    groundClearance: 185,
    wheelbase: 2975,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4047,
    brand: "Avatr",
    model: "12",
    year: 2025,
    country: "China",

    battery: 94.5,
    range: 700,
    efficiency: 13.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 240,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 18,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 425,
    maxTorque: 650,

    acceleration0to100: 3.9,
    topSpeed: 220,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 425,
    kerbWeight: 2290,
    wheelbase: 3020,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

    // =========================
  // GAC Aion
  // =========================

  {
    id: 4048,
    brand: "GAC Aion",
    model: "Aion V",
    year: 2025,
    country: "China",

    battery: 75.3,
    range: 650,
    efficiency: 11.6,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 11,
    dcPower: 180,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Right",
    fastCharge10to80: 24,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 165,
    maxTorque: 240,

    acceleration0to100: 7.5,
    topSpeed: 160,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 427,
    kerbWeight: 1880,
    groundClearance: 180,
    wheelbase: 2775,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 150,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4049,
    brand: "GAC Aion",
    model: "Hyper GT",
    year: 2025,
    country: "China",

    battery: 80,
    range: 710,
    efficiency: 11.3,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 350,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 15,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 250,
    maxTorque: 430,

    acceleration0to100: 4.9,
    topSpeed: 190,

    bodyType: "Sedan",

    seats: 5,
    bootSpace: 450,
    kerbWeight: 1920,
    wheelbase: 2920,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 150,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4050,
    brand: "GAC Aion",
    model: "Hyper HT",
    year: 2025,
    country: "China",

    battery: 93,
    range: 825,
    efficiency: 11.3,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 350,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 15,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 250,
    maxTorque: 430,

    acceleration0to100: 5.8,
    topSpeed: 183,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 670,
    kerbWeight: 2150,
    groundClearance: 185,
    wheelbase: 2935,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 150,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  // =========================
  // IM Motors
  // =========================

  {
    id: 4051,
    brand: "IM Motors",
    model: "L6",
    year: 2025,
    country: "China",

    battery: 100,
    range: 850,
    efficiency: 11.8,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 400,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 16,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 579,
    maxTorque: 800,

    acceleration0to100: 2.7,
    topSpeed: 252,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 457,
    kerbWeight: 2245,
    wheelbase: 2950,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4052,
    brand: "IM Motors",
    model: "LS6",
    year: 2025,
    country: "China",

    battery: 100,
    range: 760,
    efficiency: 13.2,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 400,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 16,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 579,
    maxTorque: 800,

    acceleration0to100: 3.5,
    topSpeed: 252,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 596,
    kerbWeight: 2360,
    groundClearance: 185,
    wheelbase: 2960,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  // =========================
  // Arcfox
  // =========================

  {
    id: 4053,
    brand: "Arcfox",
    model: "Alpha S",
    year: 2025,
    country: "China",

    battery: 94.5,
    range: 735,
    efficiency: 12.9,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 187,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 28,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 473,
    maxTorque: 720,

    acceleration0to100: 3.5,
    topSpeed: 180,

    bodyType: "Sports Sedan",

    seats: 5,
    bootSpace: 560,
    kerbWeight: 2180,
    wheelbase: 2915,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  {
    id: 4054,
    brand: "Arcfox",
    model: "Alpha T5",
    year: 2025,
    country: "China",

    battery: 85.8,
    range: 660,
    efficiency: 13.0,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 260,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 18,

    motorType: "Single Motor",
    drivetrain: "FWD",

    maxPower: 200,
    maxTorque: 360,

    acceleration0to100: 7.0,
    topSpeed: 180,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 400,
    kerbWeight: 1960,
    groundClearance: 180,
    wheelbase: 2845,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 120,000 km",
  },

  // =========================
  // Hongqi
  // =========================

  {
    id: 4055,
    brand: "Hongqi",
    model: "EH7",
    year: 2025,
    country: "China",

    battery: 111,
    range: 820,
    efficiency: 13.5,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 365,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 455,
    maxTorque: 756,

    acceleration0to100: 3.5,
    topSpeed: 200,

    bodyType: "Luxury Sedan",

    seats: 5,
    bootSpace: 500,
    kerbWeight: 2290,
    wheelbase: 3000,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4056,
    brand: "Hongqi",
    model: "E-HS9",
    year: 2025,
    country: "China",

    battery: 120,
    range: 690,
    efficiency: 17.4,

    batteryChemistry: "NMC",
    architecture: 400,

    acPower: 11,
    dcPower: 140,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 35,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 405,
    maxTorque: 750,

    acceleration0to100: 4.9,
    topSpeed: 200,

    bodyType: "Luxury SUV",

    seats: 6,
    bootSpace: 747,
    kerbWeight: 2695,
    groundClearance: 190,
    wheelbase: 3110,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

    // =========================
  // Yangwang
  // =========================

  {
    id: 4057,
    brand: "Yangwang",
    model: "U7",
    year: 2025,
    country: "China",

    battery: 135.5,
    range: 720,
    efficiency: 18.8,

    batteryChemistry: "LFP",
    architecture: 800,

    acPower: 11,
    dcPower: 500,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Right",
    fastCharge10to80: 20,

    motorType: "Quad Motor",
    drivetrain: "AWD",

    maxPower: 960,
    maxTorque: 1680,

    acceleration0to100: 2.9,
    topSpeed: 270,

    bodyType: "Luxury Sedan",

    seats: 5,
    bootSpace: 500,
    kerbWeight: 3095,
    wheelbase: 3160,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "6 years / 150,000 km",
  },

    // =========================
  // Voyah
  // =========================

  {
    id: 4058,
    brand: "Voyah",
    model: "Courage",
    year: 2025,
    country: "China",

    battery: 109,
    range: 730,
    efficiency: 14.9,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 300,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 320,
    maxTorque: 620,

    acceleration0to100: 4.9,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 527,
    kerbWeight: 2265,
    groundClearance: 180,
    wheelbase: 2900,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

  {
    id: 4059,
    brand: "Voyah",
    model: "Dream EV",
    year: 2025,
    country: "China",

    battery: 108.7,
    range: 650,
    efficiency: 16.7,

    batteryChemistry: "NMC",
    architecture: 800,

    acPower: 11,
    dcPower: 230,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 25,

    motorType: "Dual Motor",
    drivetrain: "AWD",

    maxPower: 320,
    maxTorque: 620,

    acceleration0to100: 5.9,
    topSpeed: 200,

    bodyType: "MPV",

    seats: 7,
    bootSpace: 427,
    kerbWeight: 2690,
    wheelbase: 3200,

    adasLevel: "Level 2+",

    warrantyBattery: "8 years / 160,000 km",
    warrantyVehicle: "5 years / 150,000 km",
  },

    // =========================
  // Onvo
  // =========================

  {
    id: 4060,
    brand: "Onvo",
    model: "L60",
    year: 2025,
    country: "China",

    battery: 85,
    range: 730,
    efficiency: 11.6,

    batteryChemistry: "LFP",
    architecture: 900,

    acPower: 11,
    dcPower: 300,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Rear Left",
    fastCharge10to80: 20,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 240,
    maxTorque: 305,

    acceleration0to100: 5.9,
    topSpeed: 200,

    bodyType: "SUV",

    seats: 5,
    bootSpace: 495,
    kerbWeight: 1995,
    groundClearance: 180,
    wheelbase: 2950,

    adasLevel: "Level 2+",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

    // =========================
  // Firefly
  // =========================

  {
    id: 4061,
    brand: "Firefly",
    model: "Firefly",
    year: 2025,
    country: "China",

    battery: 42.1,
    range: 420,
    efficiency: 10.0,

    batteryChemistry: "LFP",
    architecture: 400,

    acPower: 7,
    dcPower: 100,

    connectorAC: "GB/T",
    connectorDC: "GB/T",

    chargingPortLocation: "Front Left",
    fastCharge10to80: 28,

    motorType: "Single Motor",
    drivetrain: "RWD",

    maxPower: 105,
    maxTorque: 200,

    acceleration0to100: 8.1,
    topSpeed: 150,

    bodyType: "Hatchback",

    seats: 5,
    bootSpace: 404,
    kerbWeight: 1492,
    wheelbase: 2615,

    adasLevel: "Level 2",

    warrantyBattery: "10 years / Unlimited km",
    warrantyVehicle: "6 years / 150,000 km",
  },

  
];