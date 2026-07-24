export interface Vehicle {
  // Basic Information
  id: number;
  brand: string;
  model: string;
  year?: number;
  country?: string;

  // Battery & Range
  battery: number;
  range: number;
  efficiency: number;
  realWorldEfficiency?: number;

  batteryChemistry?: "LFP" | "LMFP" | "NMC" | "NCA";
  architecture?: 400 | 800;

  // Charging
  acPower: number;
  dcPower: number;

  connectorAC?: string;
  connectorDC?: string;

  chargingPortLocation?:
    | "Front Left"
    | "Front Right"
    | "Rear Left"
    | "Rear Right"
    | "Front Center"
    | "Rear Center";

  fastCharge10to80?: number;

  // Powertrain
  motorType?:
    | "Single Motor"
    | "Dual Motor"
    | "Tri Motor"
    | "Quad Motor";

  drivetrain?: "FWD" | "RWD" | "AWD";

  maxPower?: number;
  maxTorque?: number;
  acceleration0to100?: number;
  topSpeed?: number;

  // Dimensions & Body
  bodyType?:
    | "Hatchback"
    | "Sedan"
    | "SUV"
    | "SUV Coupe"
    | "Crossover"
    | "MPV"
    | "Pickup"
    | "Van"
    | "Sports Sedan"
    | "Luxury Sedan"
    | "Luxury SUV";

  seats?: number;
  bootSpace?: number;
  kerbWeight?: number;
  groundClearance?: number;
  wheelbase?: number;
  towingCapacity?: number;

  vehicleClass?: "Passenger" | "Commercial";

  // Driver Assistance
  adasLevel?:
    | "None"
    | "Level 1"
    | "Level 2"
    | "Level 2+"
    | "Level 3";

  // Warranty
  warrantyBattery?: string;
  warrantyVehicle?: string;
}

export const vehicles: Vehicle[] = [

  {
    id: 1,
    brand: "Tata",
    model: "Curvv EV 55",
    battery: 55,
    efficiency: 7.1,
    acPower: 7.2,
    dcPower: 70,
    range: 585
  },


  {
    
    id: 17,
    brand: "Tata",
    model: "Tiago EV MR",
    battery: 19.2,
    efficiency: 7.2,
    acPower: 3.3,
    dcPower: 25,
    range: 223
  },

  {
    id: 2,
    brand: "Tata",
    model: "Tiago EV LR",
    battery: 24,
    efficiency: 7.5,
    acPower: 7.2,
    dcPower: 25,
    range: 315
  },

  {
    id: 3,
    brand: "Tata",
    model: "Punch EV LR",
    battery: 35,
    efficiency: 7.5,
    acPower: 7.2,
    dcPower: 50,
    range: 421
  },

  {
    id: 4,
    brand: "Tata",
    model: "Nexon EV LR",
    battery: 40.5,
    efficiency: 7.1,
    acPower: 7.2,
    dcPower: 60,
    range: 465
  },

  {
    id: 5,
    brand: "Mahindra",
    model: "BE 6",
    battery: 59,
    efficiency: 6.5,
    acPower: 11,
    dcPower: 140,
    range: 557
  },

  {
    id: 6,
    brand: "Mahindra",
    model: "BE 6 Pack Three",
    battery: 79,
    efficiency: 6.3,
    acPower: 11,
    dcPower: 175,
    range: 682
  },

  {
    id: 7,
    brand: "Mahindra",
    model: "XEV 9e",
    battery: 79,
    efficiency: 6.2,
    acPower: 11,
    dcPower: 175,
    range: 656
  },

  {
    id: 8,
    brand: "MG",
    model: "Comet EV",
    battery: 17.3,
    efficiency: 8.5,
    acPower: 3.3,
    dcPower: 0,
    range: 230
  },

  {
    id: 9,
    brand: "MG",
    model: "ZS EV",
    battery: 50.3,
    efficiency: 6.3,
    acPower: 7.4,
    dcPower: 75,
    range: 461
  },

  {
    id: 10,
    brand: "MG",
    model: "Windsor EV",
    battery: 38,
    efficiency: 7.2,
    acPower: 7.4,
    dcPower: 60,
    range: 332
  },

  {
    id: 11,
    brand: "BYD",
    model: "Atto 3",
    battery: 60.48,
    efficiency: 6.5,
    acPower: 7,
    dcPower: 88,
    range: 521
  },

  {
    id: 12,
    brand: "BYD",
    model: "Seal",
    battery: 82.5,
    efficiency: 6,
    acPower: 11,
    dcPower: 150,
    range: 650
  },

  {
    id: 13,
    brand: "Hyundai",
    model: "Creta Electric",
    battery: 51.4,
    efficiency: 6.6,
    acPower: 11,
    dcPower: 100,
    range: 473
  },

  {
    id: 14,
    brand: "Kia",
    model: "EV6",
    battery: 77.4,
    efficiency: 5.8,
    acPower: 11,
    dcPower: 240,
    range: 708
  },
  {
    id: 15,
    brand: "Tata",
    model: "Tigor EV",
    battery: 26,
    efficiency: 7.0,
    acPower: 7.2,
    dcPower: 25,
    range: 315
  },

  {
    id: 16,
    brand: "Tata",
    model: "Curvv EV 45",
    battery: 45,
    efficiency: 7.4,
    acPower: 7.2,
    dcPower: 70,
    range: 502
  },



  {
    id: 18,
    brand: "Tata",
    model: "Harrier EV",
    battery: 75,
    efficiency: 6.8,
    acPower: 11,
    dcPower: 120,
    range: 627
  },

  {
    id: 19,
    brand: "Mahindra",
    model: "XUV400 EL Pro",
    battery: 39.4,
    efficiency: 6.9,
    acPower: 7.2,
    dcPower: 50,
    range: 456
  },

  {
    id: 20,
    brand: "BYD",
    model: "Dolphin",
    battery: 44.9,
    efficiency: 6.9,
    acPower: 7,
    dcPower: 60,
    range: 340
  },

  {
    id: 21,
    brand: "BYD",
    model: "Sealion 7",
    battery: 82.5,
    efficiency: 5.9,
    acPower: 11,
    dcPower: 150,
    range: 567
  },

  {
    id: 22,
    brand: "BYD",
    model: "eMax 7",
    battery: 71.8,
    efficiency: 6.0,
    acPower: 7,
    dcPower: 89,
    range: 530
  },

  {
    id: 23,
    brand: "Hyundai",
    model: "Ioniq 5",
    battery: 72.6,
    efficiency: 6.9,
    acPower: 11,
    dcPower: 220,
    range: 631
  },

  {
    id: 24,
    brand: "Citroen",
    model: "eC3",
    battery: 29.2,
    efficiency: 6.8,
    acPower: 3.3,
    dcPower: 15,
    range: 320
  },

  {
    id: 25,
    brand: "Maruti Suzuki",
    model: "e Vitara",
    battery: 61,
    efficiency: 6.8,
    acPower: 11,
    dcPower: 150,
    range: 500
  },

  {
    id: 26,
    brand: "Toyota",
    model: "Urban Cruiser EV",
    battery: 61,
    efficiency: 6.8,
    acPower: 11,
    dcPower: 150,
    range: 500
  },

  {
    id: 27,
    brand: "BMW",
    model: "iX1 LWB",
    battery: 66.4,
    efficiency: 6.5,
    acPower: 11,
    dcPower: 130,
    range: 531
  },

  {
    id: 28,
    brand: "BMW",
    model: "i4",
    battery: 70.2,
    efficiency: 6.7,
    acPower: 11,
    dcPower: 180,
    range: 590
  },

  {
    id: 29,
    brand: "Mercedes-Benz",
    model: "EQA",
    battery: 70.5,
    efficiency: 6.4,
    acPower: 11,
    dcPower: 100,
    range: 560
  },

  {
    id: 30,
    brand: "Audi",
    model: "Q8 e-tron",
    battery: 114,
    efficiency: 5.8,
    acPower: 22,
    dcPower: 170,
    range: 600
  },

  {
    id: 31,
    brand: "Volvo",
    model: "EX40",
    battery: 82,
    efficiency: 6.1,
    acPower: 11,
    dcPower: 205,
    range: 592
  },

  {
    id: 32,
    brand: "Mini",
    model: "Countryman Electric",
    battery: 66.5,
    efficiency: 5.9,
    acPower: 11,
    dcPower: 130,
    range: 462
  },

  {
    id: 33,
    brand: "Porsche",
    model: "Macan Electric",
    battery: 100,
    efficiency: 5.9,
    acPower: 11,
    dcPower: 270,
    range: 613
  },

  {
    id: 34,
    brand: "Rolls-Royce",
    model: "Spectre",
    battery: 102,
    efficiency: 4.8,
    acPower: 22,
    dcPower: 195,
    range: 530
  },

  {
    id: 35,
    brand: "Lotus",
    model: "Eletre",
    battery: 112,
    efficiency: 5.7,
    acPower: 22,
    dcPower: 350,
    range: 600
  }

];