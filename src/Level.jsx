import React, { useState, useEffect } from "react";
import Character from "./character";

const Level = () => {
  const groundLevel = 0;
  const characterGroundLevel = 33;

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
  const [goals, setGoals] = useState([
    { x: 50, y: 150, width: 150, height: 100 },
  ]);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const levelHeight = 700;
  const levelWidth = 1400;

  // karaktären samlar upp ett äpple
  const handleCollectApple = (appleIndex) => {
    setApples((prevApples) => {
      const newApples = [...prevApples];
      newApples[appleIndex].isCollected = true;
      return newApples;
    });
  };

  // hanterar att äpplet släpps
  const handleDropApple = (positionX, positionY) => {
    setApples((prevApples) => {
      return prevApples.map((apple, index) => {
        if (apple.isCollected) {
          return {
            ...apple,
            isCollected: false,
            x: positionX,
            y: positionY + 100,
          };
        }
        return apple;
      });
    });
  };

  // äpplet är i målområdet
  useEffect(() => {
    apples.forEach((apple) => {
      goals.forEach((goal) => {
        if (
          !apple.isCollected &&
          apple.x > goal.x &&
          apple.x < goal.x + goal.width &&
          apple.y > goal.y &&
          apple.y < goal.y + goal.height
        ) {
          setShowWinMessage(true);
        }
      });
    });
  }, [apples, goals]);

  // hanterar omstart av spelet
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${levelWidth}px`,
        height: `${levelHeight}px`,
        backgroundColor: "#87CEEB",
        overflow: "hidden",
        border: "2px solid #000",
        margin: "0 auto",
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
            borderRadius: "5px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
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
                backgroundColor: "#FF0000",
                border: "2px solid black",
                borderRadius: "100%",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            ></div>
          )
      )}

      {/* Goals */}
      {goals.map((goal, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${goal.x}px`,
            bottom: `${goal.y - 20}px`,
            width: `${goal.width}px`,
            height: `${goal.height}px`,
            backgroundColor: "transparent",
            border: "2px solid black",
            borderRadius: "10px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p>Place Apple Here!</p>
        </div>
      ))}

      {/* Karaktären */}
      <Character
        groundLevel={characterGroundLevel}
        platforms={platforms}
        speed={10}
        apples={apples}
        onCollectApple={handleCollectApple}
        onDropApple={handleDropApple}
      />

      {/* Vinnarmeddelande */}
      {showWinMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFF",
            padding: "20px",
            border: "2px solid #000",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <p>Du vann! Vill du börja om?</p>
          <button
            onClick={handleRestart}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            Ja
          </button>
        </div>
      )}
    </div>
  );
};

export default Level;
