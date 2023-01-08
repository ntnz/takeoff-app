import "./App.css";
import plan from "./plan.jpg";
import { Path } from "jad";
import { useState, useEffect, useRef } from "react";

const Measure = ({
  id,
  className,
  activeMeasure,
  setActiveMeasure,
  container,
  pxToMm,
  setPxToMm,
}) => {
  const units = ["MILLIMETERS", "CENTIMETERS", "METERS"];
  const [unit, setUnit] = useState(units[0]);
  const colors = ["red", "green", "blue"];
  const [color, setColor] = useState(colors[0]);

  const [coordinates, setCoordinates] = useState();
  const active = activeMeasure === id;

  useEffect(
    function setupListener() {
      const path = new Path({
        container,
        active,
        color,
        coordinates,
        onUpdate: (xy, length) => {
          setCoordinates(xy);

          // 663px = 1m
          // the scale is a percentage figure that determines the constant multiplier between different units
          // if we are the scale measure, we ask for what length the line is. We can then say "663px = 1m" for example
          // this would mean storing the pxToMm value of 663px
          // we can then use this to calculate all our other metric figures from
          if (setPxToMm !== undefined) setPxToMm(length);
        },
      });

      return function cleanupListener() {
        path.destroy();
      };
    },
    [color, active, coordinates, container, id, setPxToMm]
  );

  return (
    <div
      className={`flex flex-col p-3 rounded ${active && "outline"} ${
        className || ""
      }`}
      style={{ outlineColor: color }}
    >
      <select
        className="select m-1"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      >
        <option></option>
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      <select
        className="select m-1"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option></option>
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-sm btn-secondary mt-3"
        onClick={() => setActiveMeasure(id)}
      >
        Select
      </button>
    </div>
  );
};

function App() {
  const [canvasContainer, setCanvasContainer] = useState();
  const [measureIds, setMeasureIds] = useState([]);
  const [pxToMm, setPxToMm] = useState();
  const [activeMeasure, setActiveMeasure] = useState("scale");

  const onAddMeasure = () => {
    const measureId = String(Math.random());

    setMeasureIds([...measureIds, measureId]);
    setActiveMeasure(measureId);
  };

  // init the canvas
  window.addEventListener("load", () => {
    const canvasContainer = document.querySelector("#canvas-container");

    setCanvasContainer(canvasContainer);
  });

  return (
    <div className="flex">
      <div className="flex w-96 h-screen overflow-y-auto flex-col border-r p-6 bg-base-200">
        {canvasContainer ? (
          <div>
            {/* the scale measure is always rendered */}
            <h3 className="text-xl font-bold">Scale</h3>
            <Measure
              className="mt-3"
              key={"scale"}
              id={"scale"}
              container={canvasContainer}
              pxToMm={pxToMm}
              setPxToMm={setPxToMm}
              activeMeasure={activeMeasure}
              setActiveMeasure={setActiveMeasure}
            />
            {/* render all the measures */}

            <h3 className="text-xl font-bold mt-6">Measurements</h3>
            {measureIds.map((id) => (
              <Measure
                className="mt-3"
                key={id}
                id={id}
                container={canvasContainer}
                pxToMm={pxToMm}
                activeMeasure={activeMeasure}
                setActiveMeasure={setActiveMeasure}
              />
            ))}
            <button
              type="button"
              className="btn btn-primary m-1 mt-3"
              onClick={() => onAddMeasure()}
            >
              Add measurement
            </button>
          </div>
        ) : (
          <div>loading</div>
        )}
      </div>
      <div
        id="canvas-container"
        className="flex-1"
        style={{
          height: "100vh",
          backgroundImage: `url(${plan})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      ></div>
    </div>
  );
}

export default App;
