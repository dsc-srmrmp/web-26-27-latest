import React, { useEffect, useMemo, useRef } from 'react';
import './DepthText.css';

const MAX_LAYERS = 64;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const getLayerColor = (faceColor: string, depthColor: string, index: number, total: number): string => {
  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const faceMix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;
};

const getTransform = (rotateX: number, rotateY: number): string =>
  `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;

export interface DepthTextSegment {
  text: string;
  faceColor?: string;
  depthColor?: string;
  className?: string;
}

export type DepthTextLine = DepthTextSegment[];

export interface DepthTextProps {
  text?: string;
  lines?: DepthTextLine[];
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: string;
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function DepthText({
  text = 'Elevate',
  lines,
  layers = 34,
  depth = 2.4,
  faceColor = '#f8fafc',
  depthColor = '#7c3aed',
  tilt = 7.5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = true,
  orbitSpeed = 0.35,
  fontSize = 'clamp(3rem, 8vw, 6.6rem)',
  fontWeight = 900,
  fontFamily = "'Bebas Neue', sans-serif",
  letterSpacing = '0.02em',
  shadow = true,
  className = '',
  style = {},
}: DepthTextProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);

  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);
  const safeDepth = clamp(Number(depth) || 0, 0, 12);
  const safeTilt = clamp(Number(tilt) || 0, 0, 12);
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);

  const baseRotation = useMemo(() => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }), [safeTilt]);

  const parsedLines: DepthTextLine[] = useMemo(() => {
    if (lines && lines.length > 0) return lines;
    return text.split('\n').map((line) => [{ text: line, faceColor, depthColor }]);
  }, [lines, text, faceColor, depthColor]);

  const depthLayers = useMemo(
    () =>
      Array.from({ length: safeLayers }, (_, layerIndex) => {
        const index = safeLayers - layerIndex;
        return {
          index,
          transform: `translateZ(${-index * safeDepth}px)`,
        };
      }),
    [safeLayers, safeDepth]
  );

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || typeof window === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const canTrackPointer = pointerTracking && finePointer && !reducedMotion;

    let frameId = 0;
    let activePointer = false;
    let startTime = performance.now();
    const current = { ...baseRotation };
    const target = { ...baseRotation };

    const applyTransform = () => {
      stage.style.transform = getTransform(current.x, current.y);
    };

    if (reducedMotion) {
      stage.style.transform = getTransform(baseRotation.x, baseRotation.y);
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      activePointer = true;
      const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);

      target.x = baseRotation.x - y * safeTilt;
      target.y = baseRotation.y + x * safeTilt;
    };

    const handlePointerLeave = () => {
      activePointer = false;
      target.x = baseRotation.x;
      target.y = baseRotation.y;
    };

    if (canTrackPointer) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);
    }

    const tick = (now: number) => {
      if ((!canTrackPointer || !activePointer) && autoOrbit) {
        const elapsed = (now - startTime) / 1000;
        const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;
        const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
        target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;
        target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;
      }

      current.x += (target.x - current.x) * safeSmoothing;
      current.y += (target.y - current.y) * safeSmoothing;
      applyTransform();
      frameId = requestAnimationFrame(tick);
    };

    applyTransform();
    frameId = requestAnimationFrame(tick);

    return () => {
      if (canTrackPointer) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('blur', handlePointerLeave);
      }
      cancelAnimationFrame(frameId);
      startTime = 0;
    };
  }, [autoOrbit, baseRotation, pointerTracking, safeOrbitSpeed, safeSmoothing, safeTilt]);

  const rootStyle: React.CSSProperties & Record<string, string> = {
    ...style,
    '--depth-text-perspective': `${safePerspective}px`,
    '--depth-text-font-size': fontSize,
    '--depth-text-font-weight': `${fontWeight}`,
    '--depth-text-font-family': fontFamily,
    '--depth-text-letter-spacing': letterSpacing,
    '--depth-text-face-color': faceColor,
    '--depth-text-depth-color': depthColor,
  };

  return (
    <span ref={rootRef} className={`depth-text ${className}`.trim()} style={rootStyle}>
      <span ref={stageRef} className="depth-text__stage">
        {depthLayers.map((layer) => (
          <span
            aria-hidden="true"
            className="depth-text__layer"
            key={layer.index}
            style={{ transform: layer.transform }}
          >
            {parsedLines.map((line, lIdx) => (
              <span key={lIdx} className="depth-text__line">
                {line.map((segment, sIdx) => (
                  <span
                    key={sIdx}
                    className={`depth-text__segment ${segment.className || ''}`.trim()}
                    style={{
                      color: getLayerColor(
                        segment.faceColor || faceColor,
                        segment.depthColor || depthColor,
                        layer.index,
                        safeLayers
                      ),
                    }}
                  >
                    {segment.text}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
        <span className="depth-text__face">
          {parsedLines.map((line, lIdx) => (
            <span key={lIdx} className="depth-text__line">
              {line.map((segment, sIdx) => (
                <span
                  key={sIdx}
                  className={`depth-text__segment ${segment.className || ''}`.trim()}
                  style={{
                    color: segment.faceColor || faceColor,
                    textShadow: shadow
                      ? `0 22px 34px color-mix(in srgb, ${segment.depthColor || depthColor} 36%, transparent), 0 4px 8px rgba(0, 0, 0, 0.28)`
                      : 'none',
                  }}
                >
                  {segment.text}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
