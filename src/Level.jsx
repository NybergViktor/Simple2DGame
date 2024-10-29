// Level.js - Nivåkomponenten
import React, { useState } from "react";
import Character from "./character";

const Level = () => {
  const groundLevel = 0; // Marken ligger på nivå 0
  const characterGroundLevel = 33; // Karaktärens marknivå

  // Plattformarna i nivån
  const platforms = [
    { x: 200, y: 100, width: 100 },
    { x: 400, y: 150, width: 100 },
    { x: 600, y: 100, width: 100 },
    { x: 800, y: 150, width: 100 },
    { x: 1000, y: 200, width: 100 },
    { x: 1200, y: 250, width: 100 },
    { x: 1000, y: 300, width: 100 },
    { x: 800, y: 350, width: 100 },
    { x: 600, y: 400, width: 100 },
    { x: 800, y: 450, width: 100 },
  ];

  const [apples, setApples] = useState([
    { x: 834, y: 510, width: 30, height: 30, isCollected: false },
  ]);

  const levelHeight = 700;
  const levelWidth = 1400;

  // Funktion som hanterar när karaktären samlar upp ett äpple
  const handleCollectApple = (appleIndex) => {
    setApples((prevApples) => {
      const newApples = [...prevApples];
      newApples[appleIndex].isCollected = true;
      return newApples;
    });
  };

  // Funktion som hanterar att äpplet släpps
  const handleDropApple = (positionX, positionY) => {
    setApples((prevApples) => {
      return prevApples.map((apple, index) => {
        if (apple.isCollected) {
          return {
            ...apple,
            isCollected: false,
            x: positionX,
            y: positionY + 100, // Sätt det precis där karaktären är (lägg till lite för höjden)
          };
        }
        return apple;
      });
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${levelWidth}px`,
        height: `${levelHeight}px`,
        backgroundColor: "#87CEEB", // Himmelblå färg
        overflow: "hidden",
        border: "2px solid #000",
        margin: "0 auto", // Centrera nivån på sidan
      }}
    >
      {/* Marken */}
      <div
        style={{
          position: "absolute",
          bottom: `${groundLevel}px`,
          height: "50px",
          width: "100%",
          backgroundColor: "#654321", // Brun mark
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
            backgroundColor: "#228B22", // Grön färg för plattformarna
            border: "2px solid black",
            borderRadius: "5px", // Rundade kanter för plattformarna
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Lätt skugga för djupkänsla
          }}
        ></div>
      ))}

      {/* Apples */}
      {apples.map(
        (apple, index) =>
          !apple.isCollected && (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${apple.x}px`,
                bottom: `${apple.y - 20}px`,
                width: `${apple.width}px`,
                height: `${apple.height}px`,
                backgroundColor: "#FF0000", // Röd färg för äpplet
                border: "2px solid black",
                borderRadius: "100%", // Rundade kanter för att göra äpplet runt
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Lätt skugga för djupkänsla
              }}
            ></div>
          )
      )}

      {/* Karaktären */}
      <Character
        groundLevel={characterGroundLevel}
        platforms={platforms}
        speed={10}
        apples={apples}
        onCollectApple={handleCollectApple}
        onDropApple={handleDropApple}
      />
    </div>
  );
};

export default Level;
