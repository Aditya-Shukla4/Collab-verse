// client/src/components/AuthRobot.jsx
"use client";
import { useEffect, useRef, useCallback } from "react";

export default function AuthRobot({ isTypingPassword = false }) {
  const leftSocketRef = useRef(null);
  const rightSocketRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);
  const handY = useRef(60);
  const targetHandY = useRef(60);

  const movePupil = useCallback((socket, pupil, mx, my) => {
    if (!socket || !pupil) return;
    const r = socket.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    const max = 5;
    const s = d > 0 ? Math.min(max / d, 1) : 1;
    pupil.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      targetHandY.current = isTypingPassword ? 0 : 60;
      handY.current += (targetHandY.current - handY.current) * 0.14;

      const lh = leftHandRef.current;
      const rh = rightHandRef.current;

      // Dynamic inline styles ONLY for hardware-accelerated transforms
      if (lh) lh.style.transform = `translateY(${handY.current}px)`;
      if (rh) rh.style.transform = `translateY(${handY.current}px)`;

      if (handY.current < 40) {
        if (leftPupilRef.current)
          leftPupilRef.current.style.transform = "translate(0,0)";
        if (rightPupilRef.current)
          rightPupilRef.current.style.transform = "translate(0,0)";
      } else {
        movePupil(
          leftSocketRef.current,
          leftPupilRef.current,
          mouse.current.x,
          mouse.current.y,
        );
        movePupil(
          rightSocketRef.current,
          rightPupilRef.current,
          mouse.current.x,
          mouse.current.y,
        );
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [isTypingPassword, movePupil]);

  return (
    <div className="flex justify-center mb-6">
      {/* Bob animation via tailwind arbitrary class or global css */}
      <div style={{ animation: "cv-robot-bob 3.5s ease-in-out infinite" }}>
        <svg
          viewBox="0 0 140 160"
          width="110"
          height="126"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Antenna */}
          <line
            x1="70"
            y1="6"
            x2="70"
            y2="18"
            stroke="var(--as-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="70" cy="5" r="4" fill="var(--as-teal)" />
          <circle cx="70" cy="5" r="8" fill="var(--as-teal)" opacity="0.2">
            <animate
              attributeName="r"
              values="4;10;4"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.25;0;0.25"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Head */}
          <rect
            x="12"
            y="18"
            width="116"
            height="78"
            rx="16"
            fill="var(--as-surface)"
            stroke="var(--as-border2)"
            strokeWidth="1.5"
          />

          {/* Brow bar */}
          <rect
            x="22"
            y="26"
            width="36"
            height="6"
            rx="3"
            fill="var(--as-border2)"
            opacity="0.4"
          />

          {/* Left eye socket */}
          <ellipse
            ref={leftSocketRef}
            cx="46"
            cy="58"
            rx="20"
            ry="20"
            fill="var(--as-bg)"
            stroke="var(--as-accent)"
            strokeWidth="1.5"
          />
          <circle
            ref={leftPupilRef}
            cx="46"
            cy="58"
            r="9"
            fill="var(--as-accent)"
          />
          <circle cx="49" cy="54" r="3" fill="white" opacity="0.75" />

          {/* Right eye socket */}
          <ellipse
            ref={rightSocketRef}
            cx="94"
            cy="58"
            rx="20"
            ry="20"
            fill="var(--as-bg)"
            stroke="var(--as-accent)"
            strokeWidth="1.5"
          />
          <circle
            ref={rightPupilRef}
            cx="94"
            cy="58"
            r="9"
            fill="var(--as-accent)"
          />
          <circle cx="97" cy="54" r="3" fill="white" opacity="0.75" />

          {/* Mouth bar */}
          <rect
            x="46"
            y="82"
            width="48"
            height="9"
            rx="4.5"
            fill="var(--as-bg)"
            stroke="var(--as-border2)"
            strokeWidth="1"
          />
          <rect
            x="50"
            y="85"
            width="9"
            height="3"
            rx="1.5"
            fill="var(--as-teal)"
            opacity="0.9"
          />
          <rect
            x="63"
            y="85"
            width="14"
            height="3"
            rx="1.5"
            fill="var(--as-accent)"
            opacity="0.7"
          />
          <rect
            x="81"
            y="85"
            width="9"
            height="3"
            rx="1.5"
            fill="var(--as-teal)"
            opacity="0.9"
          />

          {/* Body */}
          <rect
            x="24"
            y="100"
            width="92"
            height="36"
            rx="12"
            fill="var(--as-surface)"
            stroke="var(--as-border2)"
            strokeWidth="1.5"
          />
          <circle
            cx="54"
            cy="118"
            r="6"
            fill="var(--as-accent)"
            opacity="0.8"
          />
          <circle cx="70" cy="118" r="6" fill="var(--as-teal)" opacity="0.8" />
          <circle cx="86" cy="118" r="6" fill="var(--as-coral)" opacity="0.8" />

          {/* Arms */}
          <rect
            x="2"
            y="106"
            width="20"
            height="12"
            rx="6"
            fill="var(--as-surface)"
            stroke="var(--as-border2)"
            strokeWidth="1.5"
          />
          <rect
            x="118"
            y="106"
            width="20"
            height="12"
            rx="6"
            fill="var(--as-surface)"
            stroke="var(--as-border2)"
            strokeWidth="1.5"
          />

          {/* Left hand — covers left eye */}
          <g
            ref={leftHandRef}
            className="transition-none"
            style={{ transform: "translateY(60px)" }}
          >
            <rect
              x="18"
              y="28"
              width="36"
              height="32"
              rx="10"
              fill="var(--as-accent)"
              opacity="0.92"
            />
            <rect
              x="21"
              y="18"
              width="7"
              height="16"
              rx="3.5"
              fill="var(--as-accent)"
              opacity="0.85"
            />
            <rect
              x="31"
              y="14"
              width="7"
              height="18"
              rx="3.5"
              fill="var(--as-accent)"
              opacity="0.88"
            />
            <rect
              x="41"
              y="16"
              width="7"
              height="17"
              rx="3.5"
              fill="var(--as-accent)"
              opacity="0.85"
            />
            <rect
              x="22"
              y="32"
              width="28"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.12"
            />
          </g>

          {/* Right hand — covers right eye */}
          <g
            ref={rightHandRef}
            className="transition-none"
            style={{ transform: "translateY(60px)" }}
          >
            <rect
              x="86"
              y="28"
              width="36"
              height="32"
              rx="10"
              fill="var(--as-teal)"
              opacity="0.92"
            />
            <rect
              x="89"
              y="18"
              width="7"
              height="16"
              rx="3.5"
              fill="var(--as-teal)"
              opacity="0.85"
            />
            <rect
              x="99"
              y="14"
              width="7"
              height="18"
              rx="3.5"
              fill="var(--as-teal)"
              opacity="0.88"
            />
            <rect
              x="109"
              y="16"
              width="7"
              height="17"
              rx="3.5"
              fill="var(--as-teal)"
              opacity="0.85"
            />
            <rect
              x="90"
              y="32"
              width="28"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.12"
            />
          </g>

          {/* Drop shadow */}
          <ellipse
            cx="70"
            cy="140"
            rx="38"
            ry="4"
            fill="var(--as-accent)"
            opacity="0.05"
          />
        </svg>
      </div>
    </div>
  );
}
