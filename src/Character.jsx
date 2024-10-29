import React, { useState, useEffect } from "react";
import figureImage from "./assets/figure 1.png";

const Character = ({
  groundLevel = 0,
  platforms = [],
  speed = 14,
  jumpHeight = 190,
  apples = [],
  onCollectApple,
  onDropApple,
}) => {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(groundLevel);
  const [isJumping, setIsJumping] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [direction, setDirection] = useState(null);
  const [facingRight, setFacingRight] = useState(true);
  const [hasApple, setHasApple] = useState(false);

  const characterWidth = 50;
  const characterHeight = 100;

  // Hantera tangenttryckningar för att röra karaktären
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setDirection("right");
      setFacingRight(true);
    } else if (e.key === "ArrowLeft") {
      setDirection("left");
      setFacingRight(false);
    } else if (e.key === " " && !isJumping && !isFalling) {
      setIsJumping(true);
    } else if (e.key === "e" && hasApple) {
      onDropApple(positionX, positionY);
      setHasApple(false);
    }
  };

  // Stoppa karaktärens rörelse när tangenten släpps
  const handleKeyUp = (e) => {
    if (e.key === "ArrowRight" && direction === "right") {
      setDirection(null);
    } else if (e.key === "ArrowLeft" && direction === "left") {
      setDirection(null);
    }
  };

  // Uppdatera karaktärens position i sidled
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (direction) {
        const newPositionX =
          direction === "right" ? positionX + speed : positionX - speed;
        if (!isObstructed(newPositionX, positionY)) {
          setPositionX(newPositionX);
        }
      }
    }, 20);

    return () => clearInterval(moveInterval);
  }, [direction, speed, positionX, positionY]);

  // Kontrollera om karaktären är blockerad i sidled av en plattform
  const isObstructed = (newX, y) => {
    return platforms.some((p) => {
      const isAtSameHeight = y > p.y && y <= p.y + 20;
      const isHittingLeftSide =
        newX + characterWidth > p.x && newX < p.x && isAtSameHeight;
      const isHittingRightSide =
        newX < p.x + p.width &&
        newX + characterWidth > p.x + p.width &&
        isAtSameHeight;
      return isHittingLeftSide || isHittingRightSide;
    });
  };

  // Hantera hållningen av tangenttryckningar
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, isFalling, direction, hasApple]);

  // Hantera hoppande av karaktären
  useEffect(() => {
    if (isJumping) {
      let currentHeight = 0;

      const jumpInterval = setInterval(() => {
        setPositionY((prevY) => {
          const newY = prevY + 10;
          currentHeight += 10;

          // Rör karaktären i sidled under hoppet
          setPositionX((prevX) => {
            if (direction === "right") {
              const newPosX = prevX + 6;
              return isObstructed(newPosX, newY) ? prevX : newPosX;
            } else if (direction === "left") {
              const newPosX = prevX - 6;
              return isObstructed(newPosX, newY) ? prevX : newPosX;
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
      }, 10);

      return () => clearInterval(jumpInterval);
    }
  }, [isJumping, direction, jumpHeight]);

  // Hantera fallande efter hopp eller när karaktären är i luften
  useEffect(() => {
    if (isFalling) {
      const fallInterval = setInterval(() => {
        setPositionY((prev) => {
          const fallSpeed = direction ? 2 : 5;
          const newY = prev - fallSpeed;

          // Kontrollera om karaktären landar på en plattform eller marken
          const platformUnderneath = platforms.find(
            (p) =>
              positionX + characterWidth / 2 > p.x &&
              positionX + characterWidth / 2 < p.x + p.width &&
              newY <= p.y + 20 &&
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
  }, [isFalling, groundLevel, platforms, positionX, direction]);

  // Kontrollera om karaktären är på en plattform eller inte
  useEffect(() => {
    const checkIfOnPlatform = () => {
      const onPlatform = platforms.some(
        (p) =>
          positionX + characterWidth > p.x &&
          positionX < p.x + p.width &&
          positionY <= p.y + 5 &&
          positionY >= p.y - 5
      );

      if (!onPlatform && positionY > groundLevel && !isJumping) {
        setIsFalling(true);
      }
    };

    checkIfOnPlatform();
    checkIfOnPlatform();
  }, [positionX, positionY, platforms, isJumping, isFalling, groundLevel]);

  // Hantera insamling av äpplen
  useEffect(() => {
    apples.forEach((apple, index) => {
      if (
        !apple.isCollected &&
        positionX + characterWidth / 2 > apple.x &&
        positionX + characterWidth / 2 < apple.x + apple.width &&
        positionY + characterHeight / 2 > apple.y - apple.height &&
        positionY + characterHeight / 2 < apple.y
      ) {
        onCollectApple(index);
        setHasApple(true);
      }
    });
  }, [positionX, positionY, apples, onCollectApple]);

  // Rendera karaktären
  return (
    <div
      style={{
        position: "absolute",
        left: `${positionX}px`,
        bottom: `${positionY}px`,
        width: `${characterWidth}px`,
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          transform: facingRight ? "scaleX(1)" : "scaleX(-1)",
        }}
      />
      {hasApple && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            width: "30px",
            height: "30px",
            backgroundColor: "#FF0000",
            borderRadius: "100%",
            border: "2px solid black",
          }}
        ></div>
      )}
      
    </div>
    
  );
};

export default Character;
