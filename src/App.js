import "./App.css";
import plan from "./plan.jpg";
import { Path } from "jad";
import { useState } from "react";

const Measure = ({ canvas, pxPerUnit, setPxPerUnit }) => {
  const units = ["MILLIMETERS", "CENTIMETERS", "METERS"];
  const [unit, setUnit] = useState(units[0]);

  const path = new Path({
    canvas,
    // 663px = 1m
    unit,
    pxPerUnit,
    active: true,
    coordinates: {
      a: {
        x: 0.2,
        y: 0.2,
      },
      b: {
        x: 0.1,
        y: 0.1,
      },
    },
    onUpdate: (xy, length) => {
      console.log("scale changed", xy, length);
      if (setPxPerUnit !== undefined) setPxPerUnit(length);
    },
  });

  return <div>wee</div>;
};

const getCanvas = () => {
  const canvas = document.querySelector("#canvas");
  canvas.width = window.innerWidth - 300;
  canvas.height = window.innerHeight;

  return canvas;
};

function App() {
  const [measures, setMeasures] = useState([]);
  const [scaleMeasure, setScaleMeasure] = useState();
  const [pxPerUnit, setPxPerUnit] = useState();

  const onAddScale = () => {
    const canvas = getCanvas();

    setScaleMeasure(
      <Measure
        canvas={canvas}
        setPxPerUnit={setPxPerUnit}
        pxPerUnit={pxPerUnit}
      />
    );
  };

  const onAddMeasure = () => {
    const canvas = getCanvas();

    setMeasures([
      ...measures,
      <Measure canvas={canvas} pxPerUnit={pxPerUnit} />,
    ]);
  };

  window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight;

    new Path({
      canvas,
      // 663px = 1m
      pxPerUnit: 663,
      active: true,
      coordinates: {
        a: {
          x: 0.2,
          y: 0.2,
        },
        b: {
          x: 0.1,
          y: 0.1,
        },
      },
      onUpdate: (xy, length) => console.log(xy, length),
    });
  });

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col border-r p-6 bg-base-200">
        {measures}
        <button type="button" className="btn m-1" onClick={() => onAddScale()}>
          Add scale
        </button>
        <button
          type="button"
          className="btn m-1"
          onClick={() => onAddMeasure()}
        >
          Add new
        </button>
      </div>
      <canvas
        id="canvas"
        style={{
          backgroundImage: `url(${plan})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      ></canvas>
    </div>
  );
}

export default App;
