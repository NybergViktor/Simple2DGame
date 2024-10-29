import React, { useState, useEffect } from "react";
import figureImage from "./assets/figure 1.png";

const Character = ({ groundLevel = 0, platforms = [], speed = 10 }) => {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(groundLevel);
  const [isJumping, setIsJumping] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [direction, setDirection] = useState(null);
  const [facingRight, setFacingRight] = useState(true);

  // Starta rörelsen
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setDirection("right");
      setFacingRight(true);
    } else if (e.key === "ArrowLeft") {
      setDirection("left");
      setFacingRight(false);
    } else if (e.key === " " && !isJumping && !isFalling) {
      setIsJumping(true);
      setPositionY((prev) => prev + 70);
    }
  };

  // Hantera keyUp
  const handleKeyUp = (e) => {
    if (e.key === "ArrowRight" && direction === "right") {
      setDirection(null);
    } else if (e.key === "ArrowLeft" && direction === "left") {
      setDirection(null);
    }
  };

  // Uppdatera positionen i sidled baserat på riktningen
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (direction === "right") {
        const newPositionX = positionX + speed;
        if (!isObstructed(newPositionX, positionY)) {
          setPositionX(newPositionX);
        }
      } else if (direction === "left") {
        const newPositionX = positionX - speed;
        if (!isObstructed(newPositionX, positionY)) {
          setPositionX(newPositionX);
        }
      }
    }, 20);

    return () => clearInterval(moveInterval);
  }, [direction, speed, positionX, positionY]);

  // Funktion för att kontrollera om karaktären är blockerad i sidled av en plattform
  const isObstructed = (newX, y) => {
    return platforms.some((p) => {
      const isAtSameHeight = y > p.y && y <= p.y + 20;
      const isHittingLeftSide = newX + 50 > p.x && newX < p.x && isAtSameHeight;
      const isHittingRightSide =
        newX < p.x + p.width && newX + 50 > p.x + p.width && isAtSameHeight;
      return isHittingLeftSide || isHittingRightSide;
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, isFalling, direction]);

  // Hantera hopp
  useEffect(() => {
    if (isJumping) {
      const jumpHeight = 70;
      let currentHeight = 0;

      const jumpInterval = setInterval(() => {
        setPositionY((prevY) => {
          const newY = prevY + 10;
          currentHeight += 10;

          setPositionX((prevX) => {
            if (direction === "right") {
              return prevX + 5;
            } else if (direction === "left") {
              return prevX - 5;
            }
            return prevX;
          });

          if (currentHeight >= jumpHeight) {
            clearInterval(jumpInterval);
            setIsJumping(false);
            setIsFalling(true);
          }

          return newY;
        });
      }, 20);

      return () => clearInterval(jumpInterval);
    }
  }, [isJumping, direction]);

  // Hantera fallet och kollisionskontroll med plattformar
  useEffect(() => {
    if (isFalling) {
      const fallInterval = setInterval(() => {
        setPositionY((prev) => {
          // Bestäm fallhastigheten beroende på om karaktären rör sig i sidled eller inte
          const fallSpeed = direction ? 1 : 3; // FallSpeed

          const newY = prev - fallSpeed; // Faller långsamt eller snabbt beroende på situation

          const platformUnderneath = platforms.find(
            (p) =>
              positionX + 50 > p.x &&
              positionX < p.x + p.width &&
              newY <= p.y + 5 &&
              newY >= p.y - 5
          );

          if (newY <= groundLevel || platformUnderneath) {
            clearInterval(fallInterval);
            setIsFalling(false);
            return platformUnderneath ? platformUnderneath.y : groundLevel;
          }

          return newY;
        });
      }, 20);
    }
  }, [isFalling, groundLevel, platforms, positionX, direction, isJumping]);

  // Kolla om karaktären är på en plattform eller marken
  useEffect(() => {
    const checkIfOnPlatform = () => {
      const onPlatform = platforms.some(
        (p) =>
          positionX + 50 > p.x &&
          positionX < p.x + p.width &&
          positionY <= p.y + 5 &&
          positionY >= p.y - 5 // Inte falla igenom plattformar
      );

      if (!onPlatform && positionY > groundLevel && !isJumping) {
        setIsFalling(true);
      }
    };

    checkIfOnPlatform();
  }, [positionX, positionY, platforms, isJumping, isFalling, groundLevel]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${positionX}px`,
        bottom: `${positionY}px`,
        width: "50px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={figureImage}
        alt="Character"
        style={{
          scale: "2",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: facingRight ? "scaleX(1)" : "scaleX(-1)", // Invertera horisontellt beroende på riktning
        }}
      />
    </div>
  );
};

export default Character;
