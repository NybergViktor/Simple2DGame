import React from "react";
import Character from "./character";

const Level = () => {
  const groundLevel = 0;
  const characterGroundLevel = 33;

  const platforms = [
    { x: 200, y: 100, width: 100 },
    { x: 400, y: 150, width: 100 },
    { x: 600, y: 100, width: 100 },
    { x: 800, y: 150, width: 100 },
    { x: 1000, y: 200, width: 100 },
    { x: 1200, y: 250, width: 100 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "600px",
        backgroundColor: "#87CEEB",
        overflow: "hidden",
        border: "2px solid #000",
      }}
    >
      {/* Marken */}
      <div
        style={{
          position: "absolute",
          bottom: `${groundLevel}px`,
          height: "50px",
          width: "100%",
          backgroundColor: "#654321",
        }}
      />

      {/* Plattformarna */}
      {platforms.map((platform, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${platform.x}px`,
            bottom: `${platform.y - 20}px`,
            width: `${platform.width}px`,
            height: "40px",
            backgroundColor: "#228B22",
            border: "2px solid black",
          }}
        ></div>
      ))}

      {/* Karaktären */}
      <Character
        groundLevel={characterGroundLevel}
        platforms={platforms}
        speed={10}
      />
    </div>
  );
};

export default Level;
