// client/src/components/CollabAvatars.jsx
"use client";
import { useEffect, useRef, useCallback } from "react";

export default function CollabAvatars({ isTypingPassword = false }) {
  const leftEyeL = useRef(null);
  const leftEyeR = useRef(null);
  const rightEyeL = useRef(null);
  const rightEyeR = useRef(null);
  const leftFaceRef = useRef(null);
  const bubbleRef = useRef(null);
  const thumbRef = useRef(null);
  const handRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);

  const handY = useRef(40);
  const bubbleO = useRef(0);
  const winkO = useRef(0);

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

      handY.current = lerp(handY.current, shy ? 0 : 40, 0.1);
      bubbleO.current = lerp(bubbleO.current, shy ? 1 : 0, 0.08);
      winkO.current = lerp(winkO.current, shy ? 1 : 0, 0.1);

      if (leftFaceRef.current) leftFaceRef.current.style.transform = "none";
      if (handRef.current)
        handRef.current.style.transform = `translateY(${handY.current}px)`;

      if (bubbleRef.current) {
        bubbleRef.current.style.opacity = bubbleO.current.toFixed(3);
        bubbleRef.current.style.transform = `scale(${0.85 + bubbleO.current * 0.15}) translateY(${(1 - bubbleO.current) * 6}px)`;
      }
      if (thumbRef.current) {
        thumbRef.current.style.opacity = winkO.current.toFixed(3);
        thumbRef.current.style.transform = `scale(${0.7 + winkO.current * 0.3})`;
      }

      if (!shy) {
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
            el.style.transform = `translate(${cx + (awayX - cx) * 0.12}px, ${cy + (awayY - cy) * 0.12}px)`;
          }
        });
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
    <div className="flex items-end justify-center gap-5 mb-6 relative h-[130px]">
      <style>{`
        @keyframes cv-bob-left  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes cv-bob-right { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      `}</style>

      {/* Speech bubble */}
      <div
        ref={bubbleRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 bg-surface border border-border2 rounded-xl py-1.5 px-3 text-[0.72rem] font-mono text-muted-foreground whitespace-nowrap pointer-events-none z-10 shadow-lg"
      >
        not looking bro 🤝
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-surface border-b border-border2"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
      </div>

      {/* Left avatar — "you" (purple) */}
      <div style={{ animation: "cv-bob-left 3.2s ease-in-out infinite" }}>
        <div
          ref={leftFaceRef}
          className="relative origin-bottom transition-none"
        >
          <LeftAvatar
            leftEyeL={leftEyeL}
            leftEyeR={leftEyeR}
            handRef={handRef}
          />
        </div>
      </div>

      {/* Right avatar — "partner" (teal) */}
      <div style={{ animation: "cv-bob-right 2.8s ease-in-out infinite 0.4s" }}>
        <div className="relative">
          <RightAvatar
            rightEyeL={rightEyeL}
            rightEyeR={rightEyeR}
            winkO={winkO}
          />
          <div
            ref={thumbRef}
            className="absolute -bottom-1 -right-3.5 opacity-0 text-[1.1rem] scale-70 transition-none"
          >
            👍
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Left avatar SVG ──
function LeftAvatar({ leftEyeL, leftEyeR, handRef }) {
  return (
    <svg viewBox="0 0 90 105" width="90" height="105" fill="none">
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
      <ellipse cx="45" cy="38" rx="24" ry="22" fill="#f5c9a0" />
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
      <ellipse ref={leftEyeL} cx="36" cy="36" rx="6" ry="6.5" fill="white" />
      <circle
        cx="36"
        cy="36"
        r="3.5"
        fill="#2d1f5e"
        className="transition-none"
      />
      <circle cx="37.2" cy="34.8" r="1.2" fill="white" />
      <ellipse ref={leftEyeR} cx="54" cy="36" rx="6" ry="6.5" fill="white" />
      <circle
        cx="54"
        cy="36"
        r="3.5"
        fill="#2d1f5e"
        className="transition-none"
      />
      <circle cx="55.2" cy="34.8" r="1.2" fill="white" />
      <path
        d="M44 40 Q45 43 46 40"
        stroke="#d4956a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M38 47 Q45 52 52 47"
        stroke="#c0784a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="21" cy="38" rx="3.5" ry="4.5" fill="#f5c9a0" />
      <ellipse cx="69" cy="38" rx="3.5" ry="4.5" fill="#f5c9a0" />
      <path
        d="M18 62 Q15 90 15 105 L75 105 Q75 90 72 62 Q60 58 45 58 Q30 58 18 62Z"
        fill="#6c63ff"
      />
      <rect
        x="32"
        y="78"
        width="26"
        height="16"
        rx="4"
        fill="rgba(0,0,0,0.15)"
      />
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
      <rect x="39" y="56" width="12" height="8" rx="2" fill="#f5c9a0" />
      <g
        ref={handRef}
        className="transition-none"
        style={{ transform: "translateY(40px)" }}
      >
        <rect x="58" y="22" width="14" height="18" rx="7" fill="#f5c9a0" />
        <rect x="59" y="12" width="5" height="13" rx="2.5" fill="#f5c9a0" />
        <rect x="65.5" y="10" width="5" height="14" rx="2.5" fill="#f5c9a0" />
        <rect x="57" y="17" width="4" height="11" rx="2" fill="#f5c9a0" />
      </g>
    </svg>
  );
}

// ── Right avatar SVG ──
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
      <ellipse cx="45" cy="44" rx="24" ry="21" fill="#e8b48a" />
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
      <ellipse ref={rightEyeL} cx="36" cy="42" rx="6" ry="6.5" fill="white" />
      <circle
        cx="36"
        cy="42"
        r="3.5"
        fill="#1a3a3a"
        className="transition-none"
      />
      <circle cx="37.2" cy="40.8" r="1.2" fill="white" />
      <ellipse ref={rightEyeR} cx="54" cy="42" rx="6" ry="6.5" fill="white" />
      <circle
        cx="54"
        cy="42"
        r="3.5"
        fill="#1a3a3a"
        className="transition-none"
      />
      <circle cx="55.2" cy="40.8" r="1.2" fill="white" />
      <line
        ref={winkLineRef}
        x1="48.5"
        y1="42"
        x2="59.5"
        y2="42"
        stroke="#e8b48a"
        strokeWidth="8"
        strokeLinecap="round"
        className="opacity-0"
      />
      <path
        d="M49 38 Q54 36 59 38"
        stroke="#c4845a"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        ref={winkLineRef}
        className="opacity-0"
      />
      <path
        d="M44 46 Q45 49 46 46"
        stroke="#c4845a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M37 53 Q45 60 53 53"
        stroke="#b0643a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M40 54 Q45 58 50 54" fill="white" opacity="0.7" />
      <ellipse cx="21" cy="44" rx="3.5" ry="4.5" fill="#e8b48a" />
      <ellipse cx="69" cy="44" rx="3.5" ry="4.5" fill="#e8b48a" />
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
