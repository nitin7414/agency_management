"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PinLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle Numpad Clicks
  const handlePress = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
      setError("");
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  // Auto-submit when 6 digits are reached
  useEffect(() => {
    if (pin.length === 6) {
      submitPin();
    }
  }, [pin]);

  const submitPin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  return (
    <div className="pin-container">
      <div className="pin-header">
        <h1>Enter Security PIN</h1>
        <p>Please enter your 6-digit PIN to continue</p>
      </div>

      {/* PIN Dots Display */}
      <div className="pin-dots">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`pin-dot ${i < pin.length ? "filled" : ""}`}
          />
        ))}
      </div>

      {error && <p className="pin-error">{error}</p>}

      {/* Numpad */}
      <div className="pin-numpad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <button key={num} onClick={() => handlePress(num)} className="pin-key">
            {num}
          </button>
        ))}
        <div /> {/* Empty space for bottom left */}
        <button onClick={() => handlePress("0")} className="pin-key">
          0
        </button>
        <button onClick={handleBackspace} className="pin-key action-key">
          ⌫
        </button>
      </div>
    </div>
  );
}