import { useState } from "react";

interface FirstLoginGuideProps {
  onGetStarted: (dontShowAgain: boolean) => void;
}

const cards = [
  {
    icon: "⚡",
    title: "Welcome to EV Toolkit",
    description:
      "Your personal EV companion for tracking charging, planning trips, managing maintenance, storing documents, and understanding your vehicle.",
  },
  {
    icon: "🏠",
    title: "Dashboard",
    description:
      "Get a quick overview of your EV, charging activity, costs, energy usage, and recent activity from one place.",
  },
  {
    icon: "🔋",
    title: "Charging Tracker & Planner",
    description:
      "Record your charging sessions and use Planner to estimate energy, charging time, range, and charging cost.",
  },
  {
    icon: "🛠️",
    title: "Vehicle Records",
    description:
      "Keep your Service History, Tyre History, Insurance, and important vehicle documents organized in one place.",
  },
  {
    icon: "📊",
    title: "Analytics",
    description:
      "Understand your charging patterns, energy consumption, costs, trends, and recent charging activity.",
  },
  {
    icon: "⚙️",
    title: "Settings & More",
    description:
      "Configure your vehicle, family sharing, backup options, subscription features, and other EV Toolkit settings.",
  },
];

export default function FirstLoginGuide({
  onGetStarted,
}: FirstLoginGuideProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isFirstCard = currentCard === 0;
  const isLastCard = currentCard === cards.length - 1;
  const card = cards[currentCard];

  const handlePrevious = () => {
    if (!isFirstCard) {
      setCurrentCard((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (isLastCard) {
      onGetStarted(dontShowAgain);
      return;
    }

    setCurrentCard((previous) => previous + 1);
  };

  const handleSkip = () => {
    onGetStarted(dontShowAgain);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px 18px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.30)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* Left navigation */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstCard}
            aria-label="Previous guide card"
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid #d1d5db",
              background: isFirstCard ? "#f3f4f6" : "#ffffff",
              color: isFirstCard ? "#c7cbd1" : "#374151",
              fontSize: "24px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isFirstCard ? "default" : "pointer",
            }}
          >
            ‹
          </button>

          {/* Card content */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              padding: "4px 2px",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              {card.icon}
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {card.title}
            </h2>

            <p
              style={{
                margin: "14px auto 0",
                maxWidth: "500px",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#4b5563",
              }}
            >
              {card.description}
            </p>
          </div>

          {/* Right navigation */}
          <button
            type="button"
            onClick={handleNext}
            aria-label={
              isLastCard
                ? "Finish guide"
                : "Next guide card"
            }
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontSize: "24px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </div>

        {/* Progress indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "7px",
            marginTop: "22px",
            marginBottom: "22px",
          }}
        >
          {cards.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to guide card ${index + 1}`}
              onClick={() => setCurrentCard(index)}
              style={{
                width:
                  index === currentCard
                    ? "22px"
                    : "8px",
                height: "8px",
                padding: 0,
                border: "none",
                borderRadius: "999px",
                background:
                  index === currentCard
                    ? "#f97316"
                    : "#d1d5db",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Final note */}
        {isLastCard && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#7c2d12",
              fontSize: "13px",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            💡 <strong>Tip:</strong> You can open this guide
            anytime from the <strong>How to Use</strong> option
            in the side menu.
          </div>
        )}

        {/* Don't show again */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#374151",
            marginBottom: "20px",
          }}
        >
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) =>
              setDontShowAgain(
                event.target.checked
              )
            }
            style={{
              width: "17px",
              height: "17px",
              accentColor: "#f97316",
              flexShrink: 0,
            }}
          />

          Don't show this guide automatically again
        </label>

        {/* Bottom controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={handleSkip}
            style={{
              border: "none",
              background: "transparent",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              padding: "12px 8px",
            }}
          >
            Skip
          </button>

          <button
            type="button"
            onClick={handleNext}
            style={{
              border: "none",
              background: "#f97316",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
            {isLastCard
              ? "Get Started"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}