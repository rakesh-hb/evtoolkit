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
    architecture?: number;
      
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