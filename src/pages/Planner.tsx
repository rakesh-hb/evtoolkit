import { useEffect, useMemo, useState } from "react";
import { vehicles } from "../data/vehicles";
import { chargers } from "../data/chargers";

import {
  STATE_TARIFFS,
  STATES,
} from "../data/states";

function Planner() {
  const brands = [...new Set(vehicles.map((v) => v.brand))].sort();

  const [selectedBrand, setSelectedBrand] = useState("Tata");

  const brandVehicles = useMemo(
    () => vehicles.filter((v) => v.brand === selectedBrand),
    [selectedBrand]
  );

  const defaultVehicle =
    vehicles.find(
      (v) =>
        v.brand === "Tata" &&
        v.model.toLowerCase().includes("curvv")
    ) ?? vehicles[0];

  const [vehicleId, setVehicleId] = useState(defaultVehicle.id);

  useEffect(() => {
    if (
      brandVehicles.length > 0 &&
      !brandVehicles.some((v) => v.id === vehicleId)
    ) {
      setVehicleId(brandVehicles[0].id);
    }
  }, [brandVehicles, vehicleId]);

  const defaultCharger =
    chargers.find(
      (c) =>
        c.power === 3.3 &&
        c.name.toLowerCase().includes("home")
    ) ?? chargers[0];

  const [chargerId, setChargerId] = useState(defaultCharger.id);

  const [state, setState] = useState("Karnataka");

  const [currentSOC, setCurrentSOC] = useState(20);

  const [targetSOC, setTargetSOC] = useState(80);

  const vehicle = useMemo(
    () => vehicles.find((v) => v.id === vehicleId)!,
    [vehicleId]
  );

  const charger = useMemo(
    () => chargers.find((c) => c.id === chargerId)!,
    [chargerId]
  );

  /*
   * ---------------------------------------------------------
   * BASIC VALIDATION
   * ---------------------------------------------------------
   */

  const validSOC = targetSOC > currentSOC;

  /*
   * ---------------------------------------------------------
   * ENERGY REQUIRED
   * ---------------------------------------------------------
   */

  const energyRequired = validSOC
    ? vehicle.battery *
      ((targetSOC - currentSOC) / 100)
    : 0;

  /*
   * ---------------------------------------------------------
   * EFFECTIVE CHARGER POWER
   * ---------------------------------------------------------
   *
   * AC:
   *   Limited by the vehicle's onboard AC charger.
   *
   * DC:
   *   Limited by the vehicle's maximum DC charging power.
   */

  const chargerPower = Math.min(
    charger.power,
    charger.type === "DC"
      ? vehicle.dcPower
      : vehicle.acPower
  );

  /*
   * ---------------------------------------------------------
   * CHARGING EFFICIENCY
   * ---------------------------------------------------------
   *
   * These are used for estimating energy drawn from the grid.
   *
   * AC charging generally has higher conversion losses than
   * the battery-side energy calculation suggests.
   *
   * DC charging generally has lower conversion losses because
   * AC -> DC conversion happens at the charging station.
   */

  const chargingEfficiency =
    charger.type === "DC"
      ? 0.95
      : 0.92;

  const energyFromGrid =
    validSOC
      ? energyRequired / chargingEfficiency
      : 0;

  /*
   * ---------------------------------------------------------
   * VEHICLE-SPECIFIC CHARGING PROFILES
   * ---------------------------------------------------------
   *
   * Manufacturer charging times are used where known.
   *
   * These values are based on the published charging figures
   * for the Tata Curvv EV.
   *
   * Curvv EV 55:
   *
   * 3.3 kW:
   * 10 -> 100 = 21 hours
   *
   * 7.2 kW:
   * 10 -> 100 = 7.6 hours
   *
   * 70 kW DC:
   * 10 -> 80 = 40 minutes
   *
   * Curvv EV 45:
   *
   * 3.3 kW:
   * 10 -> 100 = 17.5 hours
   *
   * 7.2 kW:
   * 10 -> 100 = approximately 6.5-7.25 hours
   *
   * 60 kW DC:
   * 10 -> 80 = approximately 40 minutes
   */

  interface ChargingProfile {
    acPortableFullHours?: number;
    acWallboxFullHours?: number;
    dc10To80Minutes?: number;
    dcPower?: number;
  }

  function getVehicleChargingProfile(): ChargingProfile | null {
    const model = vehicle.model.toLowerCase();

    /*
     * Tata Curvv EV 55
     */
    if (
      vehicle.brand.toLowerCase() === "tata" &&
      model.includes("curvv") &&
      vehicle.battery >= 50
    ) {
      return {
        acPortableFullHours: 21 / 0.9,
        acWallboxFullHours: 7.6 / 0.9,
        dc10To80Minutes: 40,
        dcPower: 70,
      };
    }

    /*
     * Tata Curvv EV 45
     */
    if (
      vehicle.brand.toLowerCase() === "tata" &&
      model.includes("curvv") &&
      vehicle.battery < 50
    ) {
      return {
        acPortableFullHours: 17.5 / 0.9,
        acWallboxFullHours: 7.25 / 0.9,
        dc10To80Minutes: 40,
        dcPower: 60,
      };
    }

    return null;
  }

  const chargingProfile = getVehicleChargingProfile();

  /*
   * ---------------------------------------------------------
   * AC CHARGING TIME
   * ---------------------------------------------------------
   *
   * AC charging is approximated using the vehicle-specific
   * full-cycle charging time where available.
   *
   * We normalize manufacturer figures to 0-100%.
   *
   * For example Curvv 55:
   *
   * 10-100 = 21 hours
   *
   * Estimated 0-100:
   *
   * 21 / 0.90 = 23.33 hours
   *
   * This produces a much more realistic estimate than:
   *
   * 55 / 3.3 = 16.67 hours
   */

  function calculateACTimeHours(): number {
    if (!validSOC) {
      return 0;
    }

    /*
     * Manufacturer-specific profile
     */
    if (chargingProfile) {
      let fullChargeHours: number | undefined;

      /*
       * Portable / low-power AC
       */
      if (
        charger.power <= 3.5 ||
        charger.name.toLowerCase().includes("portable") ||
        charger.name.toLowerCase().includes("15a")
      ) {
        fullChargeHours =
          chargingProfile.acPortableFullHours;
      }

      /*
       * AC wallbox
       */
      else {
        fullChargeHours =
          chargingProfile.acWallboxFullHours;
      }

      if (fullChargeHours) {
        return (
          fullChargeHours *
          ((targetSOC - currentSOC) / 100)
        );
      }
    }

    /*
     * Generic fallback for vehicles without
     * manufacturer-specific charging data.
     *
     * Use grid energy rather than battery energy.
     */

    if (chargerPower <= 0) {
      return 0;
    }

    /*
     * Add a modest high-SOC charging overhead.
     *
     * Charging becomes less efficient as SOC approaches 100%.
     */

    let taperFactor = 1.05;

    if (targetSOC > 90) {
      taperFactor = 1.15;
    } else if (targetSOC > 80) {
      taperFactor = 1.10;
    }

    return (
      (energyFromGrid / chargerPower) *
      taperFactor
    );
  }

  /*
   * ---------------------------------------------------------
   * DC CHARGING TIME
   * ---------------------------------------------------------
   *
   * DC charging cannot simply be calculated as:
   *
   * battery / chargerPower
   *
   * because the vehicle reduces charging power as SOC rises.
   *
   * We therefore use the manufacturer's 10-80 figure where
   * available and use a conservative estimate outside that
   * range.
   */

  function calculateDCTimeHours(): number {
    if (!validSOC) {
      return 0;
    }

    /*
     * Manufacturer-specific DC curve
     */
    if (
      chargingProfile?.dc10To80Minutes &&
      chargingProfile.dcPower
    ) {
      const start = currentSOC;
      const end = targetSOC;

      let minutes = 0;

      /*
       * 0-10%
       *
       * Charging is generally power-limited and therefore
       * relatively quick.
       */
      if (start < 10) {
        const segmentEnd = Math.min(end, 10);

        const percentage =
          segmentEnd - start;

        const batteryEnergy =
          vehicle.battery *
          (percentage / 100);

        /*
         * Conservative DC estimate.
         */
        minutes +=
          (batteryEnergy /
            chargerPower) *
          60 *
          1.05;
      }

      /*
       * 10-80%
       *
       * Use the manufacturer's published 10-80
       * charging time.
       */
      if (end > 10 && start < 80) {
        const segmentStart =
          Math.max(start, 10);

        const segmentEnd =
          Math.min(end, 80);

        const percentage =
          segmentEnd - segmentStart;

        const totalPercentage = 70;

        minutes +=
          chargingProfile.dc10To80Minutes *
          (percentage / totalPercentage);

        /*
         * If the selected DC charger is weaker than
         * the manufacturer's reference charger,
         * scale the time accordingly.
         */
        if (
          chargerPower <
          chargingProfile.dcPower
        ) {
          minutes *=
            chargingProfile.dcPower /
            chargerPower;
        }
      }

      /*
       * 80-100%
       *
       * Charging tapers considerably in this region.
       *
       * We intentionally use a slower estimate rather
       * than pretending the car continues at peak DC power.
       */
      if (end > 80 && start < 100) {
        const segmentStart =
          Math.max(start, 80);

        const segmentEnd = end;

        const percentage =
          segmentEnd - segmentStart;

        /*
         * Approximate 80-100 charging speed at
         * roughly 35% of peak charging power.
         */
        const taperPower =
          Math.max(
            chargerPower * 0.35,
            10
          );

        const batteryEnergy =
          vehicle.battery *
          (percentage / 100);

        minutes +=
          (batteryEnergy /
            taperPower) *
          60;
      }

      return minutes / 60;
    }

    /*
     * ---------------------------------------------------------
     * GENERIC DC FALLBACK
     * ---------------------------------------------------------
     */

    if (chargerPower <= 0) {
      return 0;
    }

    let totalMinutes = 0;

    /*
     * 0-50%
     */
    if (currentSOC < 50 && targetSOC > 0) {
      const start = currentSOC;
      const end = Math.min(targetSOC, 50);

      if (end > start) {
        const energy =
          vehicle.battery *
          ((end - start) / 100);

        totalMinutes +=
          (energy / chargerPower) *
          60 *
          1.05;
      }
    }

    /*
     * 50-80%
     *
     * Moderate taper.
     */
    if (targetSOC > 50 && currentSOC < 80) {
      const start =
        Math.max(currentSOC, 50);

      const end =
        Math.min(targetSOC, 80);

      if (end > start) {
        const energy =
          vehicle.battery *
          ((end - start) / 100);

        totalMinutes +=
          (energy / (chargerPower * 0.85)) *
          60;
      }
    }

    /*
     * 80-100%
     *
     * Strong taper.
     */
    if (targetSOC > 80) {
      const start =
        Math.max(currentSOC, 80);

      const end = targetSOC;

      if (end > start) {
        const energy =
          vehicle.battery *
          ((end - start) / 100);

        totalMinutes +=
          (energy / (chargerPower * 0.35)) *
          60;
      }
    }

    return totalMinutes / 60;
  }

  /*
   * ---------------------------------------------------------
   * FINAL CHARGING TIME
   * ---------------------------------------------------------
   */

  const chargingTime =
    charger.type === "DC"
      ? calculateDCTimeHours()
      : calculateACTimeHours();

  /*
   * ---------------------------------------------------------
   * TIME DISPLAY
   * ---------------------------------------------------------
   */

  function formatChargingTime(hours: number) {
    if (!validSOC) {
      return "Select a higher target";
    }

    if (hours <= 0) {
      return "0 min";
    }

    const totalMinutes =
      Math.round(hours * 60);

    const displayHours =
      Math.floor(totalMinutes / 60);

    const displayMinutes =
      totalMinutes % 60;

    if (displayHours === 0) {
      return `${displayMinutes} min`;
    }

    if (displayMinutes === 0) {
      return `${displayHours} hr`;
    }

    return `${displayHours} hr ${displayMinutes} min`;
  }

  /*
   * ---------------------------------------------------------
   * COST
   * ---------------------------------------------------------
   */

  const tariff = STATE_TARIFFS[state];

  const baseCost =
    energyFromGrid * tariff;

  /*
   * NOTE:
   *
   * The existing application logic applies GST only
   * to DC charging. This is retained here so the rest
   * of the Planner behaves as before.
   */

  const gst =
    charger.type === "DC"
      ? baseCost * 0.18
      : 0;

  const totalCost =
    baseCost + gst;

  /*
   * ---------------------------------------------------------
   * RANGE
   * ---------------------------------------------------------
   *
   * This remains the vehicle's efficiency-based estimate.
   */

  const rangeAdded =
    energyRequired *
    vehicle.efficiency;

  const costPerKm =
    rangeAdded > 0
      ? totalCost / rangeAdded
      : 0;

  return (
    <>
      <div className="welcome">
        <h2>⚡ Charge Planner</h2>

        <p>
          Estimate charging time and charging cost.
        </p>
      </div>

      <div className="card">
        <label>Brand</label>

        <select
          value={selectedBrand}
          onChange={(e) =>
            setSelectedBrand(e.target.value)
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

        <label>Model</label>

        <select
          value={vehicleId}
          onChange={(e) =>
            setVehicleId(Number(e.target.value))
          }
        >
          {brandVehicles.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.model}
            </option>
          ))}
        </select>

        <label>Charging Type</label>

        <select
          value={chargerId}
          onChange={(e) =>
            setChargerId(Number(e.target.value))
          }
        >
          {chargers.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <label>State Tariff</label>

        <select
          value={state}
          onChange={(e) =>
            setState(e.target.value)
          }
        >
          {STATES.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <label>Current Battery (%)</label>

        <input
          type="range"
          min="0"
          max="100"
          value={currentSOC}
          onChange={(e) => {
            const value =
              Number(e.target.value);

            setCurrentSOC(value);

            if (value >= targetSOC) {
              setTargetSOC(
                Math.min(value + 10, 100)
              );
            }
          }}
        />

        <p>{currentSOC}%</p>

        <label>Target Battery (%)</label>

        <input
          type="range"
          min="0"
          max="100"
          value={targetSOC}
          onChange={(e) =>
            setTargetSOC(
              Number(e.target.value)
            )
          }
        />

        <p>{targetSOC}%</p>

        {!validSOC && (
          <p
            style={{
              color: "#dc2626",
              fontWeight: 600,
            }}
          >
            Target battery level must be higher
            than the current battery level.
          </p>
        )}
      </div>

      <div className="kpiGrid">
        <div className="kpiCard">
          <h3>Energy Required</h3>
          <h2>
            {energyRequired.toFixed(1)} kWh
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Grid Energy</h3>
          <h2>
            {energyFromGrid.toFixed(1)} kWh
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Charging Efficiency</h3>
          <h2>
            {(chargingEfficiency * 100).toFixed(0)}%
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Charging Time</h3>
          <h2>
            {formatChargingTime(chargingTime)}
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Tariff</h3>
          <h2>
            ₹{tariff.toFixed(2)}/kWh
          </h2>
        </div>

        <div className="kpiCard">
          <h3>Range Added</h3>
          <h2>
            {rangeAdded.toFixed(0)} km
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

      <div className="card">
        <h3>Charging Cost</h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Base Cost</td>
              <td>
                ₹{baseCost.toFixed(2)}
              </td>
            </tr>

            <tr>
              <td>Grid Energy Used</td>
              <td>
                {energyFromGrid.toFixed(1)} kWh
              </td>
            </tr>

            <tr>
              <td>GST</td>
              <td>
                {charger.type === "DC"
                  ? `₹${gst.toFixed(2)} (18%)`
                  : "₹0.00"}
              </td>
            </tr>

            <tr>
              <td>Total Payable</td>
              <td>
                <strong>
                  ₹{totalCost.toFixed(2)}
                </strong>
              </td>
            </tr>

            <tr>
              <td>Cost / km</td>
              <td>
                ₹{costPerKm.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Charging Summary</h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Vehicle</td>
              <td>
                {vehicle.brand} {vehicle.model}
              </td>
            </tr>

            <tr>
              <td>Battery Charge</td>
              <td>
                {currentSOC}% → {targetSOC}%
              </td>
            </tr>

            <tr>
              <td>Selected Charger</td>
              <td>
                {charger.name}
              </td>
            </tr>

            <tr>
              <td>Effective Charging Speed</td>
              <td>
                {chargerPower.toFixed(1)} kW
              </td>
            </tr>

            <tr>
              <td>Energy Required</td>
              <td>
                {energyRequired.toFixed(1)} kWh
              </td>
            </tr>

            <tr>
              <td>Energy From Grid</td>
              <td>
                {energyFromGrid.toFixed(1)} kWh
              </td>
            </tr>

            <tr>
              <td>Charging Efficiency</td>
              <td>
                {(chargingEfficiency * 100).toFixed(0)}%
              </td>
            </tr>

            <tr>
              <td>Charging Time</td>
              <td>
                <strong>
                  {formatChargingTime(
                    chargingTime
                  )}
                </strong>
              </td>
            </tr>

            <tr>
              <td>Estimated Range Added</td>
              <td>
                {rangeAdded.toFixed(0)} km
              </td>
            </tr>

            <tr>
              <td>Total Cost</td>
              <td>
                ₹{totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>
          Selected Vehicle Specifications
        </h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Vehicle</td>
              <td>
                {vehicle.brand} {vehicle.model}
              </td>
            </tr>

            <tr>
              <td>Battery Capacity</td>
              <td>
                {vehicle.battery} kWh
              </td>
            </tr>

            <tr>
              <td>Efficiency</td>
              <td>
                {vehicle.efficiency} km/kWh
              </td>
            </tr>

            <tr>
              <td>Claimed Range</td>
              <td>
                {vehicle.range} km
              </td>
            </tr>

            <tr>
              <td>Vehicle AC Charging Limit</td>
              <td>
                {vehicle.acPower} kW
              </td>
            </tr>

            <tr>
              <td>Vehicle DC Charging Limit</td>
              <td>
                {vehicle.dcPower} kW
              </td>
            </tr>

            <tr>
              <td>Selected Charger</td>
              <td>
                {charger.name}
              </td>
            </tr>

            <tr>
              <td>Charger Power</td>
              <td>
                {charger.power} kW
              </td>
            </tr>

            <tr>
              <td>Effective Charging Speed</td>
              <td>
                {chargerPower.toFixed(1)} kW
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </>
  );
}

export default Planner;