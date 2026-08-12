import { useEffect, useMemo, useState } from "react";
import { vehicles } from "../data/vehicles";
import { chargers } from "../data/chargers";
import { STATES } from "../data/states";

/*
 * These are representative estimated domestic electricity
 * rates used as DEFAULTS for the Planner.
 *
 * They are not intended to reproduce a user's actual
 * electricity bill. Actual rates can vary by DISCOM,
 * consumption, subsidies, fixed charges, duties and
 * surcharges.
 *
 * Data basis: FY 2026-27 representative domestic rates.
 */

const DEFAULT_HOME_RATES: Record<string, number> = {
  "Andhra Pradesh": 5.3,
  "Arunachal Pradesh": 4.2,
  "Assam": 5.8,
  "Bihar": 4.9,
  "Chhattisgarh": 4.3,
  "Goa": 3.6,
  "Gujarat": 5.2,
  "Haryana": 5.9,
  "Himachal Pradesh": 3.8,
  "Jharkhand": 5.1,
  "Karnataka": 6.1,
  "Kerala": 5.9,
  "Madhya Pradesh": 5.6,
  "Maharashtra": 8.2,
  "Manipur": 4.6,
  "Meghalaya": 4.8,
  "Mizoram": 4.3,
  "Nagaland": 4.5,
  "Odisha": 4.8,
  "Punjab": 5.5,
  "Rajasthan": 5.7,
  "Sikkim": 3.4,
  "Tamil Nadu": 3.8,
  "Telangana": 4.3,
  "Tripura": 4.9,
  "Uttar Pradesh": 5.7,
  "Uttarakhand": 4.5,
  "West Bengal": 7.4,

  "Andaman and Nicobar Islands": 3.6,
  "Chandigarh": 4.9,
  "Dadra and Nagar Haveli and Daman and Diu": 3.4,
  "Delhi": 0,
  "Jammu and Kashmir": 3.9,
  "Ladakh": 3.6,
  "Lakshadweep": 3.0,
  "Puducherry": 3.6,
};

interface CustomVehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  country: string;

  battery: number;
  range: number;
  efficiency: number;

  batteryChemistry: string;
  architecture: number;

  acPower: number;
  dcPower: number;

  connectorAC: string;
  connectorDC: string;

  chargingPortLocation: string;
  fastCharge10to80: number;

  motorType: string;
  drivetrain: string;

  maxPower: number;
  maxTorque: number;

  acceleration0to100: number;
  topSpeed: number;

  bodyType: string;

  seats: number;
  bootSpace: number;
  kerbWeight: number;
  wheelbase: number;

  adasLevel: string;

  warrantyBattery: string;
  warrantyVehicle: string;
}

type PlannerVehicle =
  | (typeof vehicles)[number]
  | CustomVehicle;

interface CustomCharger {
  id: string;
  name: string;
  type: "AC" | "DC";
  power: number;
}

const CUSTOM_VEHICLES_KEY =
  "evtoolkit_custom_vehicles";

const CUSTOM_CHARGERS_KEY =
  "evtoolkit_custom_chargers";

const emptyVehicleForm = {
  brand: "",
  model: "",
  battery: "",
  range: "",
  efficiency: "",
  acPower: "",
  dcPower: "",
  fastCharge10to80: "",
};

const emptyChargerForm = {
  name: "",
  type: "AC" as "AC" | "DC",
  power: "",
};

function Planner() {
  /*
   * =========================================================
   * CUSTOM VEHICLES
   * =========================================================
   */

  const [customVehicles, setCustomVehicles] =
    useState<CustomVehicle[]>(() => {
      try {
        const saved = localStorage.getItem(
          CUSTOM_VEHICLES_KEY
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

  /*
   * =========================================================
   * CUSTOM CHARGERS
   * =========================================================
   */

  const [customChargers, setCustomChargers] =
    useState<CustomCharger[]>(() => {
      try {
        const saved = localStorage.getItem(
          CUSTOM_CHARGERS_KEY
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
      CUSTOM_VEHICLES_KEY,
      JSON.stringify(customVehicles)
    );
  }, [customVehicles]);

  useEffect(() => {
    localStorage.setItem(
      CUSTOM_CHARGERS_KEY,
      JSON.stringify(customChargers)
    );
  }, [customChargers]);

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const allVehicles = useMemo<PlannerVehicle[]>(
    () => [...vehicles, ...customVehicles],
    [customVehicles]
  );

  const allChargers = useMemo(
    () => [...chargers, ...customChargers],
    [customChargers]
  );

  const brands = useMemo(
    () =>
      [...new Set(allVehicles.map((v) => v.brand))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [allVehicles]
  );

  /*
   * =========================================================
   * VEHICLE
   * =========================================================
   */

  const [selectedBrand, setSelectedBrand] =
    useState("Tata");

  const brandVehicles = useMemo(
    () =>
      allVehicles.filter(
        (v) => v.brand === selectedBrand
      ),
    [allVehicles, selectedBrand]
  );

  const defaultVehicle =
    allVehicles.find(
      (v) =>
        v.brand === "Tata" &&
        v.model.toLowerCase().includes("curvv ev 55")
    ) ??
    allVehicles.find(
      (v) => v.brand === "Tata"
    ) ??
    allVehicles[0];

  const [vehicleId, setVehicleId] =
    useState<number>(
      defaultVehicle?.id ?? 0
    );

  useEffect(() => {
    if (
      brandVehicles.length > 0 &&
      !brandVehicles.some(
        (v) => v.id === vehicleId
      )
    ) {
      setVehicleId(brandVehicles[0].id);
    }
  }, [brandVehicles, vehicleId]);

  const vehicle = useMemo(
    () =>
      allVehicles.find(
        (v) => v.id === vehicleId
      ) ?? defaultVehicle,
    [allVehicles, vehicleId, defaultVehicle]
  );

  /*
   * =========================================================
   * CHARGER
   * =========================================================
   */

  const defaultCharger =
    allChargers.find(
      (c) =>
        c.type === "AC" &&
        c.power === 3.3 &&
        c.name.toLowerCase().includes("home")
    ) ?? allChargers[0];

  const [chargerId, setChargerId] =
    useState<string>(
      defaultCharger?.id ?? ""
    );

  const charger = useMemo(
    () =>
      allChargers.find(
        (c) => c.id === chargerId
      ) ?? defaultCharger,
    [allChargers, chargerId, defaultCharger]
  );

  /*
   * =========================================================
   * CHARGING LOCATION
   * =========================================================
   */

  const [chargingLocation, setChargingLocation] =
    useState<"Home" | "Public">("Home");

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [state, setState] =
    useState("Karnataka");

  /*
   * =========================================================
   * ELECTRICITY / PUBLIC RATE
   * =========================================================
   */

  const defaultHomeRate =
    DEFAULT_HOME_RATES[state] ?? 5;

  const [homeRate, setHomeRate] =
    useState(
      DEFAULT_HOME_RATES["Karnataka"] ?? 5
    );

  const [publicRate, setPublicRate] =
    useState(15);

  useEffect(() => {
    setHomeRate(defaultHomeRate);
  }, [state, defaultHomeRate]);

  const activeRate =
    chargingLocation === "Home"
      ? homeRate
      : publicRate;

  /*
   * =========================================================
   * SOC
   * =========================================================
   */

  const [currentSOC, setCurrentSOC] =
    useState(20);

  const [targetSOC, setTargetSOC] =
    useState(80);

  useEffect(() => {
    if (targetSOC < currentSOC) {
      setTargetSOC(currentSOC);
    }
  }, [currentSOC, targetSOC]);

  /*
   * =========================================================
   * CHARGER POWER
   * =========================================================
   */

  const chargerPower = useMemo(() => {
    if (!vehicle || !charger) {
      return 0;
    }

    if (charger.type === "AC") {
      if (vehicle.acPower <= 0) {
        return 0;
      }

      return Math.min(
        charger.power,
        vehicle.acPower
      );
    }

    if (vehicle.dcPower <= 0) {
      return 0;
    }

    return Math.min(
      charger.power,
      vehicle.dcPower
    );
  }, [vehicle, charger]);

  /*
   * =========================================================
   * ENERGY
   * =========================================================
   */

  const socDifference = Math.max(
    0,
    targetSOC - currentSOC
  );

  const hasBatteryInformation =
    !!vehicle &&
    vehicle.battery > 0;

  const energyRequired =
    hasBatteryInformation
      ? vehicle.battery *
        (socDifference / 100)
      : 0;

  /*
   * =========================================================
   * CHARGING EFFICIENCY
   * =========================================================
   */

  const chargingEfficiency =
    charger?.type === "DC"
      ? 0.95
      : 0.92;

  const energyFromGrid =
    energyRequired > 0
      ? energyRequired /
        chargingEfficiency
      : 0;

  /*
   * =========================================================
   * CHARGING TIME
   * =========================================================
   */

  const chargingTimeHours = useMemo(() => {
    if (
      !vehicle ||
      !charger ||
      energyRequired <= 0 ||
      chargerPower <= 0
    ) {
      return 0;
    }

    /*
     * AC
     */

    if (charger.type === "AC") {
      return (
        energyFromGrid /
        chargerPower
      );
    }

    /*
     * DC
     *
     * Use manufacturer 10–80% charging
     * time where available.
     */

    const fastChargeTime =
  vehicle.fastCharge10to80 ?? 0;

if (fastChargeTime > 0) {
  const referenceMinutes =
    fastChargeTime;

      const referencePower =
        (vehicle.battery * 0.7) /
        (referenceMinutes / 60);

      const powerAdjustment =
        referencePower > chargerPower
          ? referencePower / chargerPower
          : 1;

      const tenToEightyMinutes =
        referenceMinutes *
        powerAdjustment;

      /*
       * Approximate tapering:
       *
       * 0–10   = 15% of 10–80 time
       * 10–80  = manufacturer's time
       * 80–100 = 40% of 10–80 time
       */

      const zeroToTenMinutes =
        tenToEightyMinutes * 0.15;

      const eightyToHundredMinutes =
        tenToEightyMinutes * 0.40;

      if (targetSOC <= 10) {
        return (
          ((targetSOC - currentSOC) *
            (zeroToTenMinutes / 10)) /
          60
        );
      }

      if (
        currentSOC < 10 &&
        targetSOC <= 80
      ) {
        const first =
          (10 - currentSOC) *
          (zeroToTenMinutes / 10);

        const second =
          (targetSOC - 10) *
          (tenToEightyMinutes / 70);

        return (first + second) / 60;
      }

      if (
        currentSOC >= 10 &&
        targetSOC <= 80
      ) {
        return (
          ((targetSOC - currentSOC) *
            (tenToEightyMinutes / 70)) /
          60
        );
      }

      if (
        currentSOC >= 10 &&
        currentSOC < 80 &&
        targetSOC > 80
      ) {
        const first =
          (80 - currentSOC) *
          (tenToEightyMinutes / 70);

        const second =
          (targetSOC - 80) *
          (eightyToHundredMinutes / 20);

        return (first + second) / 60;
      }

      if (
        currentSOC < 10 &&
        targetSOC > 80
      ) {
        const first =
          (10 - currentSOC) *
          (zeroToTenMinutes / 10);

        const second =
          tenToEightyMinutes;

        const third =
          (targetSOC - 80) *
          (eightyToHundredMinutes / 20);

        return (
          (first + second + third) /
          60
        );
      }
    }

    /*
     * Generic DC fallback
     */

    return (
      energyFromGrid /
      chargerPower
    );
  }, [
    vehicle,
    charger,
    energyRequired,
    energyFromGrid,
    chargerPower,
    currentSOC,
    targetSOC,
  ]);

  const chargingTimeMinutes =
    Math.round(
      chargingTimeHours * 60
    );

  /*
   * =========================================================
   * COST
   * =========================================================
   */

  const totalCost =
    energyFromGrid *
    Math.max(0, activeRate);

  const costPerKm =
    vehicle &&
    vehicle.efficiency > 0 &&
    energyRequired > 0
      ? totalCost /
        (energyRequired *
          vehicle.efficiency)
      : 0;

  const rangeAdded =
    vehicle &&
    vehicle.efficiency > 0
      ? energyRequired *
        vehicle.efficiency
      : 0;

  /*
   * =========================================================
   * FORMAT TIME
   * =========================================================
   */

  function formatChargingTime(
    minutes: number
  ) {
    if (minutes <= 0) {
      return "Unavailable";
    }

    const hours =
      Math.floor(minutes / 60);

    const mins =
      minutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    }

    if (mins === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${mins} min`;
  }

  /*
   * =========================================================
   * ADD VEHICLE
   * =========================================================
   */

  const [showVehicleForm, setShowVehicleForm] =
    useState(false);

  const [newVehicle, setNewVehicle] =
    useState(emptyVehicleForm);

  function addVehicle() {
    const brand =
      newVehicle.brand.trim();

    const model =
      newVehicle.model.trim();

    if (!brand || !model) {
      alert(
        "Please enter the vehicle brand and model."
      );
      return;
    }

    const numberOrZero = (
      value: string
    ) => {
      if (!value.trim()) {
        return 0;
      }

      const n = Number(value);

      return Number.isFinite(n) && n >= 0
        ? n
        : -1;
    };

    const battery =
      numberOrZero(newVehicle.battery);

    const range =
      numberOrZero(newVehicle.range);

    const efficiency =
      numberOrZero(
        newVehicle.efficiency
      );

    const acPower =
      numberOrZero(
        newVehicle.acPower
      );

    const dcPower =
      numberOrZero(
        newVehicle.dcPower
      );

    const fastCharge10to80 =
      numberOrZero(
        newVehicle.fastCharge10to80
      );

    if (
      [
        battery,
        range,
        efficiency,
        acPower,
        dcPower,
        fastCharge10to80,
      ].some((n) => n < 0)
    ) {
      alert(
        "Please enter valid numbers."
      );
      return;
    }

    const duplicate =
      allVehicles.some(
        (v) =>
          v.brand.toLowerCase() ===
            brand.toLowerCase() &&
          v.model.toLowerCase() ===
            model.toLowerCase()
      );

    if (duplicate) {
      alert(
        "This vehicle already exists."
      );
      return;
    }

    const customVehicle: CustomVehicle =
      {
        id: Date.now(),
        brand,
        model,
        year: new Date().getFullYear(),
        country: "Custom",

        battery,
        range,
        efficiency,

        batteryChemistry: "Unknown",
        architecture: 0,

        acPower,
        dcPower,

        connectorAC: "Unknown",
        connectorDC: "Unknown",

        chargingPortLocation:
          "Unknown",

        fastCharge10to80,

        motorType: "Unknown",
        drivetrain: "Unknown",

        maxPower: 0,
        maxTorque: 0,

        acceleration0to100: 0,
        topSpeed: 0,

        bodyType: "Unknown",

        seats: 0,
        bootSpace: 0,
        kerbWeight: 0,
        wheelbase: 0,

        adasLevel: "Unknown",

        warrantyBattery:
          "Unknown",

        warrantyVehicle:
          "Unknown",
      };

    setCustomVehicles((prev) => [
      ...prev,
      customVehicle,
    ]);

    setSelectedBrand(brand);
    setVehicleId(customVehicle.id);

    setNewVehicle(
      emptyVehicleForm
    );

    setShowVehicleForm(false);
  }

  /*
   * =========================================================
   * ADD CHARGER
   * =========================================================
   */

  const [showChargerForm, setShowChargerForm] =
    useState(false);

  const [newCharger, setNewCharger] =
    useState(emptyChargerForm);

  function addCharger() {
    const name =
      newCharger.name.trim();

    const power =
      Number(newCharger.power);

    if (
      !name ||
      !Number.isFinite(power) ||
      power <= 0
    ) {
      alert(
        "Please enter a valid charger name and power."
      );
      return;
    }

    const duplicate =
      allChargers.some(
        (c) =>
          c.name.toLowerCase() ===
          name.toLowerCase()
      );

    if (duplicate) {
      alert(
        "This charger already exists."
      );
      return;
    }

    const customCharger: CustomCharger =
      {
        id:
          `custom-${Date.now()}`,
        name,
        type: newCharger.type,
        power,
      };

    setCustomChargers((prev) => [
      ...prev,
      customCharger,
    ]);

    setChargerId(
      customCharger.id
    );

    setNewCharger(
      emptyChargerForm
    );

    setShowChargerForm(false);
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      <div className="welcome">
        <h2>
          ⚡ Charge Planner
        </h2>

        <p>
          Estimate charging time
          and charging cost.
        </p>
      </div>

      {/* =====================================================
          MAIN SETUP CARD
          ===================================================== */}

      <div className="card">

        <h3>
          Vehicle & Charging Setup
        </h3>

        <label>
          Brand
        </label>

        <select
          value={selectedBrand}
          onChange={(e) =>
            setSelectedBrand(
              e.target.value
            )
          }
        >
          {brands.map((brand) => (
            <option
              key={brand}
              value={brand}
            >
              {brand}
            </option>
          ))}
        </select>

        <label>
          Model
        </label>

        <select
          value={vehicleId}
          onChange={(e) =>
            setVehicleId(
              Number(e.target.value)
            )
          }
        >
          {brandVehicles.map(
            (v) => (
              <option
                key={v.id}
                value={v.id}
              >
                {v.model}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          className="saveButton"
          onClick={() => {
            setShowVehicleForm(
              !showVehicleForm
            );
            setShowChargerForm(false);
          }}
          style={{
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          ➕ Add Vehicle
        </button>

      {showVehicleForm && (
        <div className="card">

          <h3>
            🚗 Add Vehicle
          </h3>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Enter the information
            you know. Optional
            specifications can be
            left blank.
          </p>

          <label>
            Brand *
          </label>

          <input
            value={newVehicle.brand}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                brand:
                  e.target.value,
              })
            }
            placeholder="e.g. Tata"
          />

          <label>
            Model *
          </label>

          <input
            value={newVehicle.model}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                model:
                  e.target.value,
              })
            }
            placeholder="e.g. Curvv EV 55"
          />

          <label>
            Battery Capacity (kWh)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={
              newVehicle.battery
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                battery:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background:
                "rgba(255,255,255,.04)",
            }}
          >
            <strong>
              Optional specifications
            </strong>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 12,
                marginBottom: 0,
              }}
            >
              Leave these blank if
              you don't know them.
            </p>
          </div>

          <label>
            Claimed Range (km)
          </label>

          <input
            type="number"
            min="0"
            value={
              newVehicle.range
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                range:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <label>
            Efficiency (km/kWh)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={
              newVehicle.efficiency
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                efficiency:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <label>
            AC Charging Limit (kW)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={
              newVehicle.acPower
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                acPower:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <label>
            DC Charging Limit (kW)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={
              newVehicle.dcPower
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                dcPower:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <label>
            DC 10–80% Charging Time
            (minutes)
          </label>

          <input
            type="number"
            min="0"
            value={
              newVehicle
                .fastCharge10to80
            }
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                fastCharge10to80:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 18,
            }}
          >
            <button
              type="button"
              className="saveButton"
              onClick={addVehicle}
            >
              Add Vehicle
            </button>

            <button
              type="button"
              className="deleteButton"
              onClick={() => {
                setShowVehicleForm(false);
                setNewVehicle(
                  emptyVehicleForm
                );
              }}
            >
              Cancel
            </button>
          </div>

        </div>
      )}



        <label>
          Charging Location
        </label>

        <select
          value={chargingLocation}
          onChange={(e) =>
            setChargingLocation(
              e.target.value as
                | "Home"
                | "Public"
            )
          }
        >
          <option value="Home">
            🏠 Home
          </option>

          <option value="Public">
            ⚡ Public Charging
          </option>
        </select>

        <label>
          Charging Type
        </label>

        <select
          value={chargerId}
          onChange={(e) =>
            setChargerId(
              e.target.value
            )
          }
        >
          {allChargers.map(
            (c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          className="saveButton"
          onClick={() => {
            setShowChargerForm(
              !showChargerForm
            );
            setShowVehicleForm(false);
          }}
          style={{
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          ➕ Add Charger
        </button>

      {showChargerForm && (
        <div className="card">

          <h3>
            ⚡ Add Charger
          </h3>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Add a charging setup
            that isn't available
            in the list.
          </p>

          <label>
            Charger Name
          </label>

          <input
            value={
              newCharger.name
            }
            onChange={(e) =>
              setNewCharger({
                ...newCharger,
                name:
                  e.target.value,
              })
            }
            placeholder="e.g. Home Wallbox"
          />

          <label>
            Charging Type
          </label>

          <select
            value={
              newCharger.type
            }
            onChange={(e) =>
              setNewCharger({
                ...newCharger,
                type:
                  e.target.value as
                    | "AC"
                    | "DC",
              })
            }
          >
            <option value="AC">
              AC
            </option>

            <option value="DC">
              DC
            </option>
          </select>

          <label>
            Charging Power (kW)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={
              newCharger.power
            }
            onChange={(e) =>
              setNewCharger({
                ...newCharger,
                power:
                  e.target.value,
              })
            }
            placeholder="e.g. 7.2"
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 18,
            }}
          >
            <button
              type="button"
              className="saveButton"
              onClick={addCharger}
            >
              Add Charger
            </button>

            <button
              type="button"
              className="deleteButton"
              onClick={() => {
                setShowChargerForm(false);
                setNewCharger(
                  emptyChargerForm
                );
              }}
            >
              Cancel
            </button>
          </div>

        </div>
      )}



        {chargingLocation === "Home" && (
          <>
            <label>
              State
            </label>

            <select
              value={state}
              onChange={(e) =>
                setState(
                  e.target.value
                )
              }
            >
              {STATES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <label>
              Electricity Rate
              (₹/kWh)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={homeRate}
              onChange={(e) =>
                setHomeRate(
                  Number(e.target.value)
                )
              }
            />

            <p
              style={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Default estimate for{" "}
              {state}: ₹
              {defaultHomeRate.toFixed(
                2
              )}
              /kWh. You can change
              this to match your
              electricity bill.
            </p>
          </>
        )}

        {chargingLocation === "Public" && (
          <>
            <label>
              Charging Station Rate
              (₹/kWh)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={publicRate}
              onChange={(e) =>
                setPublicRate(
                  Number(e.target.value)
                )
              }
            />

            <p
              style={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Enter the rate shown by
              the charging station or
              charging network.
            </p>
          </>
        )}

        <label>
          Current Battery (%)
        </label>

        <input
          type="range"
          min="0"
          max="100"
          value={currentSOC}
          onChange={(e) =>
            setCurrentSOC(
              Number(e.target.value)
            )
          }
        />

        <p>
          {currentSOC}%
        </p>

        <label>
          Target Battery (%)
        </label>

        <input
          type="range"
          min={currentSOC}
          max="100"
          value={targetSOC}
          onChange={(e) =>
            setTargetSOC(
              Number(e.target.value)
            )
          }
        />

        <p>
          {targetSOC}%
        </p>

      </div>

      {/* =====================================================
          ADD VEHICLE CARD
          ===================================================== */}

      {/* =====================================================
          ADD CHARGER CARD
          ===================================================== */}

      {/* =====================================================
          KPIs
          ===================================================== */}

      <div className="kpiGrid">

        <div className="kpiCard">
          <h3>
            Energy Required
          </h3>

          <h2>
            {hasBatteryInformation
              ? `${energyRequired.toFixed(
                  1
                )} kWh`
              : "Unavailable"}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>
            Grid Energy
          </h3>

          <h2>
            {hasBatteryInformation &&
            chargerPower > 0
              ? `${energyFromGrid.toFixed(
                  1
                )} kWh`
              : "Unavailable"}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>
            Charging Efficiency
          </h3>

          <h2>
            {hasBatteryInformation
              ? `${(
                  chargingEfficiency *
                  100
                ).toFixed(0)}%`
              : "—"}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>
            Estimated Charging Time
          </h3>

          <h2>
            {formatChargingTime(
              chargingTimeMinutes
            )}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>
            Rate
          </h3>

          <h2>
            ₹
            {activeRate.toFixed(2)}
            /kWh
          </h2>
        </div>

        <div className="kpiCard">
          <h3>
            Range Added
          </h3>

          <h2>
            {vehicle &&
            vehicle.efficiency > 0
              ? `${rangeAdded.toFixed(
                  0
                )} km`
              : "Unavailable"}
          </h2>
        </div>

      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#6b7280",
          marginTop: "10px",
          marginBottom: "30px",
        }}
      >
        Charging time is an estimate based on the selected
        vehicle, charger, battery level and available
        manufacturer charging data. Actual charging time
        can vary with battery temperature, charger conditions,
        vehicle software, electrical supply and charging
        taper at higher battery levels.
      </div>

      {/* =====================================================
          COST
          ===================================================== */}

      <div className="card">

        <h3>
          Charging Cost
        </h3>

        <table className="table">

          <tbody>

            <tr>
              <td>
                Charging Location
              </td>

              <td>
                {chargingLocation ===
                "Home"
                  ? "🏠 Home"
                  : "⚡ Public"}
              </td>
            </tr>

            <tr>
              <td>
                Rate Used
              </td>

              <td>
                ₹
                {activeRate.toFixed(
                  2
                )}
                /kWh
              </td>
            </tr>

            <tr>
              <td>
                Grid Energy Used
              </td>

              <td>
                {hasBatteryInformation
                  ? `${energyFromGrid.toFixed(
                      1
                    )} kWh`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Energy Cost
              </td>

              <td>
                {hasBatteryInformation
                  ? `₹${totalCost.toFixed(
                      2
                    )}`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Total Payable
              </td>

              <td>
                {hasBatteryInformation ? (
                  <strong>
                    ₹
                    {totalCost.toFixed(
                      2
                    )}
                  </strong>
                ) : (
                  "Unavailable"
                )}
              </td>
            </tr>

            <tr>
              <td>
                Cost / km
              </td>

              <td>
                {costPerKm > 0
                  ? `₹${costPerKm.toFixed(
                      2
                    )}`
                  : "Unavailable"}
              </td>
            </tr>

          </tbody>

        </table>

        <p
          style={{
            color: "#64748b",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          {chargingLocation ===
          "Home"
            ? "Home charging uses the selected state's representative default rate. Your actual electricity bill may differ."
            : "Public charging uses the station rate entered above. Check the station/network for the actual applicable price."}
        </p>

      </div>

      {/* =====================================================
          CHARGING SUMMARY
          ===================================================== */}

      <div className="card">

        <h3>
          Charging Summary
        </h3>

        <table className="table">

          <tbody>

            <tr>
              <td>
                Vehicle
              </td>

              <td>
                {vehicle?.brand}{" "}
                {vehicle?.model}
              </td>
            </tr>

            <tr>
              <td>
                Battery Charge
              </td>

              <td>
                {currentSOC}% →{" "}
                {targetSOC}%
              </td>
            </tr>

            <tr>
              <td>
                Charging Location
              </td>

              <td>
                {chargingLocation}
              </td>
            </tr>

            <tr>
              <td>
                Selected Charger
              </td>

              <td>
                {charger?.name}
              </td>
            </tr>

            <tr>
              <td>
                Effective Charging Speed
              </td>

              <td>
                {chargerPower > 0
                  ? `${chargerPower.toFixed(
                      1
                    )} kW`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Energy Required
              </td>

              <td>
                {hasBatteryInformation
                  ? `${energyRequired.toFixed(
                      1
                    )} kWh`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Energy From Grid
              </td>

              <td>
                {hasBatteryInformation
                  ? `${energyFromGrid.toFixed(
                      1
                    )} kWh`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Charging Time
              </td>

              <td>
                {formatChargingTime(
                  chargingTimeMinutes
                )}
              </td>
            </tr>

            <tr>
              <td>
                Estimated Range Added
              </td>

              <td>
                {vehicle &&
                vehicle.efficiency > 0
                  ? `${rangeAdded.toFixed(
                      0
                    )} km`
                  : "Unavailable"}
              </td>
            </tr>

            <tr>
              <td>
                Total Cost
              </td>

              <td>
                {hasBatteryInformation
                  ? `₹${totalCost.toFixed(
                      2
                    )}`
                  : "Unavailable"}
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* =====================================================
          VEHICLE SPECIFICATIONS
          ===================================================== */}

      <div className="card">

        <h3>
          Selected Vehicle Specifications
        </h3>

        <table className="table">

          <tbody>

            <tr>
              <td>
                Vehicle
              </td>

              <td>
                {vehicle?.brand}{" "}
                {vehicle?.model}
              </td>
            </tr>

            <tr>
              <td>
                Battery Capacity
              </td>

              <td>
                {vehicle?.battery > 0
                  ? `${vehicle.battery} kWh`
                  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                Efficiency
              </td>

              <td>
                {vehicle?.efficiency > 0
                  ? `${vehicle.efficiency} km/kWh`
                  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                Claimed Range
              </td>

              <td>
                {vehicle?.range > 0
                  ? `${vehicle.range} km`
                  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                AC Charging Limit
              </td>

              <td>
                {vehicle?.acPower > 0
                  ? `${vehicle.acPower} kW`
                  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                DC Charging Limit
              </td>

              <td>
                {vehicle?.dcPower > 0
                  ? `${vehicle.dcPower} kW`
                  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                DC 10–80% Charging Time
              </td>

              <td>
              {(vehicle.fastCharge10to80 ?? 0) > 0
  ? `${vehicle.fastCharge10to80} min`
  : "Not available"}
              </td>
            </tr>

            <tr>
              <td>
                Selected Charger
              </td>

              <td>
                {charger?.name}
              </td>
            </tr>

            <tr>
              <td>
                Charger Power
              </td>

              <td>
                {charger?.power} kW
              </td>
            </tr>

            <tr>
              <td>
                Effective Charging Speed
              </td>

              <td>
                {chargerPower > 0
                  ? `${chargerPower.toFixed(
                      1
                    )} kW`
                  : "Not available"}
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </>
  );
}

export default Planner;