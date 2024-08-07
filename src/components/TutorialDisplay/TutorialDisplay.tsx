import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tutorial = ({ steps }: { steps: Array<any> }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const tooltipRef = useRef(null);

  const calculatePosition = (targetRect: DOMRect, tooltipRect: { width: number; height: number }) => {
    const margin = 10; // Margin from viewport edges
    let x = targetRect.left + targetRect.width / 2;
    let y = targetRect.bottom + 20; // 20px below the target element

    // Adjust horizontal position if tooltip goes off-screen
    if (x + tooltipRect.width / 2 > window.innerWidth - margin) {
      x = window.innerWidth - tooltipRect.width / 2 - margin;
    } else if (x - tooltipRect.width / 2 < margin) {
      x = tooltipRect.width / 2 + margin;
    }

    // Adjust vertical position if tooltip goes off-screen
    if (y + tooltipRect.height > window.innerHeight - margin) {
      y = targetRect.top - tooltipRect.height - 20; // 20px above the target element
    }

    return { x, y };
  };

  useEffect(() => {
    if (showTutorial && steps[currentStep].elementId) {
      const element = document.getElementById(steps[currentStep].elementId);
      if (element && tooltipRef.current) {
        const targetRect = element.getBoundingClientRect();
        const tooltipRect = (tooltipRef.current as HTMLElement).getBoundingClientRect();
        const newPosition = calculatePosition(targetRect, tooltipRect);
        setPosition(newPosition);
        setSpotlight({
          x: targetRect.left,
          y: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
        });
      }
    } else {
      setSpotlight({ x: 0, y: 0, width: 0, height: 0 });
    }
  }, [currentStep, showTutorial, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect x={spotlight.x} y={spotlight.y} width={spotlight.width} height={spotlight.height} fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.5)" mask="url(#spotlight-mask)" />
          </svg>

          <motion.div
            ref={tooltipRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: position.x,
              y: position.y,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "300px",
              textAlign: "center",
              position: "absolute",
              transform: "translate(-50%, 0)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                color: "black",
              }}
            >
              {steps[currentStep].title}
            </h2>
            <p
              style={{
                color: "black",
              }}
            >
              {steps[currentStep].description}
            </p>
            <button onClick={nextStep}>{currentStep < steps.length - 1 ? "Next" : "Finish"}</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tutorial;
