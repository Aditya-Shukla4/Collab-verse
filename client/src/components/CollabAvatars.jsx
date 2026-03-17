"use client";
import { useEffect, useRef, useCallback } from "react";

/**
 * CollabAvatars
 * ─────────────────────────────────────────────────────
 * Two minimal developer avatar faces.
 *
 * Normal state:
 *  • Both faces look toward the input (eyes track cursor)
 *  • They subtly bob at different rates
 *
 * Password state (isTypingPassword=true):
 *  • Left avatar turns head away (rotates) + raises hand
 *  • Right avatar gives thumbs up + winks
 *  • Speech bubble: "I'm not looking bro 🤝"
 *
 * Each avatar has its own personality:
 *  • Left: purple hoodie, slightly messy hair — "you"
 *  • Right: teal cap, calm — "your collab partner"
 */

export default function CollabAvatars({ isTypingPassword = false }) {
  const leftEyeL = useRef(null); // left avatar, left pupil
  const leftEyeR = useRef(null); // left avatar, right pupil
  const rightEyeL = useRef(null); // right avatar, left pupil
  const rightEyeR = useRef(null); // right avatar, right pupil

  const leftFaceRef = useRef(null);
  const rightFaceRef = useRef(null);
  const bubbleRef = useRef(null);
  const thumbRef = useRef(null);
  const handRef = useRef(null);

  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);

  // Lerped state
  const leftRotY = useRef(0); // head turn
  const handY = useRef(40); // raised hand
  const bubbleO = useRef(0); // speech bubble opacity
  const winkO = useRef(0); // wink (right eye close)

  const movePupil = useCallback((socketEl, pupilEl, mx, my, maxMove = 4) => {
    if (!socketEl || !pupilEl) return;
    const r = socketEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    const s = d > 0 ? Math.min(maxMove / d, 1) : 1;
    pupilEl.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      const shy = isTypingPassword;
      const lerp = (a, b, t) => a + (b - a) * t;

      // Left avatar — eyes look away when shy, NO head movement
      handY.current = lerp(handY.current, shy ? 0 : 40, 0.1);
      bubbleO.current = lerp(bubbleO.current, shy ? 1 : 0, 0.08);
      winkO.current = lerp(winkO.current, shy ? 1 : 0, 0.1);

      // No transform on face — stays still
      if (leftFaceRef.current) {
        leftFaceRef.current.style.transform = "none";
      }
      if (handRef.current) {
        handRef.current.style.transform = `translateY(${handY.current}px)`;
      }
      if (bubbleRef.current) {
        bubbleRef.current.style.opacity = bubbleO.current.toFixed(3);
        bubbleRef.current.style.transform = `scale(${0.85 + bubbleO.current * 0.15}) translateY(${(1 - bubbleO.current) * 6}px)`;
      }
      if (thumbRef.current) {
        thumbRef.current.style.opacity = winkO.current.toFixed(3);
        thumbRef.current.style.transform = `scale(${0.7 + winkO.current * 0.3})`;
      }

      // Eye tracking
      if (!shy) {
        // Normal — track cursor
        movePupil(
          leftEyeL.current,
          leftEyeL.current?.nextSibling,
          mouse.current.x,
          mouse.current.y,
        );
        movePupil(
          leftEyeR.current,
          leftEyeR.current?.nextSibling,
          mouse.current.x,
          mouse.current.y,
        );
        movePupil(
          rightEyeL.current,
          rightEyeL.current?.nextSibling,
          mouse.current.x,
          mouse.current.y,
        );
        movePupil(
          rightEyeR.current,
          rightEyeR.current?.nextSibling,
          mouse.current.x,
          mouse.current.y,
        );
      } else {
        // Shy — left avatar looks up and to the left (away)
        const awayX = -3.5,
          awayY = -3;
        [leftEyeL, leftEyeR].forEach((ref) => {
          if (ref.current?.nextSibling) {
            const el = ref.current.nextSibling;
            const cx = parseFloat(
              el.style.transform?.match(/translate\(([-\d.]+)px/)?.[1] || 0,
            );
            const cy = parseFloat(
              el.style.transform?.match(/,\s*([-\d.]+)px/)?.[1] || 0,
            );
            const nx = cx + (awayX - cx) * 0.12;
            const ny = cy + (awayY - cy) * 0.12;
            el.style.transform = `translate(${nx}px, ${ny}px)`;
          }
        });
        // Right avatar pupils center (looking straight, confident)
        [rightEyeL, rightEyeR].forEach((ref) => {
          if (ref.current?.nextSibling) {
            const el = ref.current.nextSibling;
            const cx = parseFloat(
              el.style.transform?.match(/translate\(([-\d.]+)px/)?.[1] || 0,
            );
            const cy = parseFloat(
              el.style.transform?.match(/,\s*([-\d.]+)px/)?.[1] || 0,
            );
            el.style.transform = `translate(${cx + (0 - cx) * 0.1}px, ${cy + (0 - cy) * 0.1}px)`;
          }
        });
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
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "1.2rem",
        marginBottom: "1.5rem",
        position: "relative",
        height: 130,
      }}
    >
      <style>{`
        @keyframes cv-bob-left  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes cv-bob-right { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes cv-bubble-in { from{opacity:0;transform:scale(0.85) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      {/* ── Speech bubble ── */}
      <div
        ref={bubbleRef}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0,
          background: "var(--as-surface)",
          border: "1px solid var(--as-border2)",
          borderRadius: 12,
          padding: "6px 12px",
          fontSize: "0.72rem",
          fontFamily: "var(--as-font-mono)",
          color: "var(--as-text2)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        not looking bro 🤝
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 6,
            background: "var(--as-surface)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            borderBottom: "1px solid var(--as-border2)",
          }}
        />
      </div>

      {/* ── Left avatar — "you" (purple) ── */}
      <div style={{ animation: "cv-bob-left 3.2s ease-in-out infinite" }}>
        <div
          ref={leftFaceRef}
          style={{
            transition: "none",
            position: "relative",
            transformOrigin: "center bottom",
          }}
        >
          <LeftAvatar
            leftEyeL={leftEyeL}
            leftEyeR={leftEyeR}
            handRef={handRef}
            isTypingPassword={isTypingPassword}
          />
        </div>
      </div>

      {/* ── Right avatar — "partner" (teal) ── */}
      <div style={{ animation: "cv-bob-right 2.8s ease-in-out infinite 0.4s" }}>
        <div style={{ position: "relative" }}>
          <RightAvatar
            rightEyeL={rightEyeL}
            rightEyeR={rightEyeR}
            winkO={winkO}
          />
          {/* Thumbs up — appears when shy */}
          <div
            ref={thumbRef}
            style={{
              position: "absolute",
              bottom: -4,
              right: -14,
              opacity: 0,
              fontSize: "1.1rem",
              transform: "scale(0.7)",
              transition: "none",
            }}
          >
            👍
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left avatar SVG — purple hoodie dev ── */
function LeftAvatar({ leftEyeL, leftEyeR, handRef, isTypingPassword }) {
  return (
    <svg viewBox="0 0 90 105" width="90" height="105" fill="none">
      {/* Hair — messy */}
      <ellipse cx="45" cy="24" rx="28" ry="22" fill="#2d1f5e" />
      <path d="M20 28 Q16 14 22 8 Q28 4 30 12" fill="#2d1f5e" />
      <path d="M70 28 Q74 14 68 8 Q62 4 60 12" fill="#2d1f5e" />
      <path
        d="M35 6 Q45 2 55 6"
        stroke="#6c63ff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Face */}
      <ellipse cx="45" cy="38" rx="24" ry="22" fill="#f5c9a0" />

      {/* Eyebrows — slightly furrowed */}
      <path
        d="M32 28 Q36 26 40 28"
        stroke="#5a3a1a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 28 Q54 26 58 28"
        stroke="#5a3a1a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left eye socket */}
      <ellipse ref={leftEyeL} cx="36" cy="36" rx="6" ry="6.5" fill="white" />
      <circle
        cx="36"
        cy="36"
        r="3.5"
        fill="#2d1f5e"
        style={{ transition: "none" }}
      />
      <circle cx="37.2" cy="34.8" r="1.2" fill="white" />

      {/* Right eye socket */}
      <ellipse ref={leftEyeR} cx="54" cy="36" rx="6" ry="6.5" fill="white" />
      <circle
        cx="54"
        cy="36"
        r="3.5"
        fill="#2d1f5e"
        style={{ transition: "none" }}
      />
      <circle cx="55.2" cy="34.8" r="1.2" fill="white" />

      {/* Nose */}
      <path
        d="M44 40 Q45 43 46 40"
        stroke="#d4956a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mouth — slight smile */}
      <path
        d="M38 47 Q45 52 52 47"
        stroke="#c0784a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Ears */}
      <ellipse cx="21" cy="38" rx="3.5" ry="4.5" fill="#f5c9a0" />
      <ellipse cx="69" cy="38" rx="3.5" ry="4.5" fill="#f5c9a0" />

      {/* Hoodie body */}
      <path
        d="M18 62 Q15 90 15 105 L75 105 Q75 90 72 62 Q60 58 45 58 Q30 58 18 62Z"
        fill="#6c63ff"
      />
      {/* Hoodie pocket */}
      <rect
        x="32"
        y="78"
        width="26"
        height="16"
        rx="4"
        fill="rgba(0,0,0,0.15)"
      />
      {/* Hoodie strings */}
      <line
        x1="40"
        y1="62"
        x2="37"
        y2="76"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="62"
        x2="53"
        y2="76"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Neck */}
      <rect x="39" y="56" width="12" height="8" rx="2" fill="#f5c9a0" />

      {/* Raised hand (appears on password) */}
      <g
        ref={handRef}
        style={{ transform: "translateY(40px)", transition: "none" }}
      >
        <rect x="58" y="22" width="14" height="18" rx="7" fill="#f5c9a0" />
        {/* Fingers */}
        <rect x="59" y="12" width="5" height="13" rx="2.5" fill="#f5c9a0" />
        <rect x="65.5" y="10" width="5" height="14" rx="2.5" fill="#f5c9a0" />
        <rect x="57" y="17" width="4" height="11" rx="2" fill="#f5c9a0" />
      </g>
    </svg>
  );
}

/* ── Right avatar SVG — teal cap partner ── */
function RightAvatar({ rightEyeL, rightEyeR, winkO }) {
  const winkLineRef = useRef(null);

  useEffect(() => {
    const loop = () => {
      if (winkLineRef.current) {
        winkLineRef.current.style.opacity = winkO.current?.toFixed(3) || "0";
      }
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [winkO]);

  return (
    <svg viewBox="0 0 90 105" width="90" height="105" fill="none">
      {/* Cap */}
      <ellipse cx="45" cy="26" rx="27" ry="16" fill="#1a3a3a" />
      <rect x="15" y="24" width="60" height="10" rx="2" fill="#0d9488" />
      <ellipse cx="45" cy="34" rx="30" ry="5" fill="#0d9488" />
      <path
        d="M15 34 Q12 36 14 38"
        stroke="#0a7a70"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M75 34 Q78 36 76 38"
        stroke="#0a7a70"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Face */}
      <ellipse cx="45" cy="44" rx="24" ry="21" fill="#e8b48a" />

      {/* Eyebrows */}
      <path
        d="M32 34 Q36 32 40 34"
        stroke="#5a3a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 34 Q54 32 58 34"
        stroke="#5a3a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left eye */}
      <ellipse ref={rightEyeL} cx="36" cy="42" rx="6" ry="6.5" fill="white" />
      <circle
        cx="36"
        cy="42"
        r="3.5"
        fill="#1a3a3a"
        style={{ transition: "none" }}
      />
      <circle cx="37.2" cy="40.8" r="1.2" fill="white" />

      {/* Right eye socket */}
      <ellipse ref={rightEyeR} cx="54" cy="42" rx="6" ry="6.5" fill="white" />
      <circle
        cx="54"
        cy="42"
        r="3.5"
        fill="#1a3a3a"
        style={{ transition: "none" }}
      />
      <circle cx="55.2" cy="40.8" r="1.2" fill="white" />
      {/* Wink line — covers right eye when winking */}
      <line
        ref={winkLineRef}
        x1="48.5"
        y1="42"
        x2="59.5"
        y2="42"
        stroke="#e8b48a"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ opacity: 0 }}
      />
      {/* Wink crease above */}
      <path
        d="M49 38 Q54 36 59 38"
        stroke="#c4845a"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        ref={winkLineRef}
        style={{ opacity: 0 }}
      />

      {/* Nose */}
      <path
        d="M44 46 Q45 49 46 46"
        stroke="#c4845a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Big grin */}
      <path
        d="M37 53 Q45 60 53 53"
        stroke="#b0643a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M40 54 Q45 58 50 54" fill="white" opacity="0.7" />

      {/* Ears */}
      <ellipse cx="21" cy="44" rx="3.5" ry="4.5" fill="#e8b48a" />
      <ellipse cx="69" cy="44" rx="3.5" ry="4.5" fill="#e8b48a" />

      {/* Body */}
      <path
        d="M18 68 Q15 90 15 105 L75 105 Q75 90 72 68 Q60 63 45 63 Q30 63 18 68Z"
        fill="#4ecdc4"
      />
      <path
        d="M38 63 L45 70 L52 63"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="45"
        y1="70"
        x2="45"
        y2="90"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1.5"
      />
      <rect x="39" y="61" width="12" height="8" rx="2" fill="#e8b48a" />
    </svg>
  );
}
