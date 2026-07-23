import { useMemo, useState } from "react";
import { vehicles } from "../data/vehicles";

const STATE_TARIFFS: Record<string, number> = {
  Karnataka: 8.5,
  "Tamil Nadu": 8.0,
  Kerala: 7.5,
  Telangana: 8.3,
  "Andhra Pradesh": 7.9,
  Maharashtra: 9.2,
  Gujarat: 7.8,
  Delhi: 8.8,
  Rajasthan: 8.1,
  "Uttar Pradesh": 8.4,
};

function Planner() {

  const [vehicleId, setVehicleId] = useState(vehicles[0].id);

  const [chargingType, setChargingType] = useState("DC Fast");

  const [state, setState] = useState("Karnataka");

  const [currentSOC, setCurrentSOC] = useState(20);

  const [targetSOC, setTargetSOC] = useState(80);

  const vehicle = useMemo(
    () => vehicles.find(v => v.id === vehicleId)!,
    [vehicleId]
  );

  const energyRequired =
    vehicle.battery *
    ((targetSOC - currentSOC) / 100);

  const chargerPower =
    chargingType === "DC Fast"
      ? vehicle.dcPower
      : vehicle.acPower;

  const chargingTime =
    energyRequired / chargerPower;

  const tariff = STATE_TARIFFS[state];

  const baseCost =
    energyRequired * tariff;

  const gst =
    chargingType === "DC Fast"
      ? baseCost * 0.18
      : 0;

  const totalCost =
    baseCost + gst;

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
        <h2>

          ⚡ Charge Planner

        </h2>

        <p>

          Estimate charging time and charging cost.

        </p>

      </div>

      <div className="card">

        <label>

          Select Vehicle

        </label>

        <select
          value={vehicleId}
          onChange={(e)=>
            setVehicleId(Number(e.target.value))
          }
        >

          {vehicles.map(vehicle=>(
            <option
              key={vehicle.id}
              value={vehicle.id}
            >
              {vehicle.brand} {vehicle.model}
            </option>
          ))}

        </select>

        <label>

          Charging Type

        </label>

        <select
          value={chargingType}
          onChange={(e)=>
            setChargingType(e.target.value)
          }
        >

          <option>

            Home AC

          </option>

          <option>

            Public AC

          </option>

          <option>

            DC Fast

          </option>

        </select>

        <label>

          State Tariff

        </label>

        <select
          value={state}
          onChange={(e)=>
            setState(e.target.value)
          }
        >

          {Object.keys(STATE_TARIFFS).map(item=>(

            <option
              key={item}
            >
              {item}
            </option>

          ))}

        </select>
        <label>

Current Battery (%)

</label>

<input
type="range"
min="0"
max="100"
value={currentSOC}
onChange={(e) =>
  setCurrentSOC(Number(e.target.value))
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
min="0"
max="100"
value={targetSOC}
onChange={(e) =>
  setTargetSOC(Number(e.target.value))
}
/>

<p>

{targetSOC}%

</p>

</div>



<div className="kpiGrid">

<div className="kpiCard">

<h3>

  Energy Required

</h3>

<h2>

  {energyRequired.toFixed(1)} kWh

</h2>

</div>

<div className="kpiCard">

<h3>

  Charging Time

</h3>

<h2>

  {chargingTime.toFixed(1)} hrs

</h2>

</div>

<div className="kpiCard">

<h3>

  Tariff

</h3>

<h2>

  ₹{tariff.toFixed(2)}

</h2>

</div>

<div className="kpiCard">

<h3>

  Range Added

</h3>

<h2>

  {rangeAdded.toFixed(0)} km

</h2>

</div>

</div>
<div className="card">

<h3>

  Charging Cost

</h3>

<table className="table">

  <tbody>

    <tr>

      <td>

        Base Cost

      </td>

      <td>

        ₹{baseCost.toFixed(2)}

      </td>

    </tr>

    <tr>

      <td>

        GST

      </td>

      <td>

        {chargingType === "DC Fast"
          ? `₹${gst.toFixed(2)} (18%)`
          : "₹0.00"}

      </td>

    </tr>

    <tr>

      <td>

        Total Payable

      </td>

      <td>

        <strong>

          ₹{totalCost.toFixed(2)}

        </strong>

      </td>

    </tr>

    <tr>

      <td>

        Cost / km

      </td>

      <td>

        ₹{costPerKm.toFixed(2)}

      </td>

    </tr>

  </tbody>

</table>

</div>

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

        {vehicle.brand} {vehicle.model}

      </td>

    </tr>

    <tr>

      <td>

        Battery Charge

      </td>

      <td>

        {currentSOC}% → {targetSOC}%

      </td>

    </tr>

    <tr>

      <td>

        Charging Type

      </td>

      <td>

        {chargingType}

      </td>

    </tr>

    <tr>

      <td>

        Energy Required

      </td>

      <td>

        {energyRequired.toFixed(1)} kWh

      </td>

    </tr>

    <tr>

      <td>

        Charging Time

      </td>

      <td>

        {chargingTime.toFixed(1)} hours

      </td>

    </tr>

    <tr>

      <td>

        Estimated Range Added

      </td>

      <td>

        {rangeAdded.toFixed(0)} km

      </td>

    </tr>

    <tr>

      <td>

        Total Cost

      </td>

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

    <td>AC Charging</td>

    <td>

      {vehicle.acPower} kW

    </td>

  </tr>

  <tr>

    <td>DC Fast Charging</td>

    <td>

      {vehicle.dcPower} kW

    </td>

  </tr>

</tbody>

</table>

</div>

</>

);

}

export default Planner;
