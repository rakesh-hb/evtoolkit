export const CONNECTOR_AC = {
    TYPE2: "Type 2",
    NACS: "NACS",
    GBT_AC: "GB/T AC",
  } as const;
  
  export const CONNECTOR_DC = {
    CCS2: "CCS2",
    CCS1: "CCS1",
    CHADEMO: "CHAdeMO",
    GBT_DC: "GB/T DC",
    NACS: "NACS",
    NONE: "Not Supported",
  } as const;
  
  export const DRIVETRAIN = {
    FWD: "FWD",
    RWD: "RWD",
    AWD: "AWD",
  } as const;
  
  export const MOTOR = {
    SINGLE: "Single Motor",
    DUAL: "Dual Motor",
    TRI: "Tri Motor",
    QUAD: "Quad Motor",
  } as const;