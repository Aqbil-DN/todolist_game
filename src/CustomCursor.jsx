import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const secondaryCursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse position and target position for smoothing
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPosPrimary = useRef({ x: 0, y: 0 });
  const targetPosSecondary = useRef({ x: 0, y: 0 });

  // Colors for Pixel Art Sword
  const B = '#0D0D0D'; // Outline
  const S = '#FFFFFF'; // Shine/Edge
  const C = '#5CE1E6'; // Primary Blade (Cyan)
  const D = '#00B4FF'; // Secondary Blade (Deep Blue)
  const G = '#FFD60A'; // Guard (Gold)
  const H = '#FF5DA2'; // Hilt (Pink)
  const _ = null;      // Transparent

  // 16x16 Grid of Pixel Art Sword (Pointing Top-Left)
  const swordGrid = [
    [B, B, B, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [B, S, C, B, _, _, _, _, _, _, _, _, _, _, _, _],
    [B, C, D, C, B, _, _, _, _, _, _, _, _, _, _, _],
    [_, B, C, D, C, B, _, _, _, _, _, _, _, _, _, _],
    [_, _, B, C, D, C, B, _, _, _, _, _, _, _, _, _],
    [_, _, _, B, C, D, C, B, _, _, _, _, _, _, _, _],
    [_, _, _, _, B, C, D, C, B, _, _, _, _, _, _, _],
    [_, _, _, _, _, B, C, D, C, B, _, _, _, _, _, _],
    [_, _, _, _, _, _, B, C, D, C, B, _, _, _, _, _],
    [_, _, _, _, _, _, _, B, C, D, C, B, _, _, _, _],
    [_, _, _, _, _, _, _, _, B, C, D, C, B, _, B, B],
    [_, _, _, _, _, _, _, _, _, B, G, G, G, B, G, B],
    [_, _, _, _, _, _, _, _, _, G, G, H, G, G, B, _],
    [_, _, _, _, _, _, _, _, B, G, H, H, G, B, _, _],
    [_, _, _, _, _, _, _, B, G, B, H, B, B, _, _, _],
    [_, _, _, _, _, _, _, B, B, _, B, _, _, _, _, _]
  ];

  useEffect(() => {
    // Hide normal cursor on HTML/Body
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseEnterLink = () => setIsHovered(true);
    const handleMouseLeaveLink = () => setIsHovered(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add listeners for interactive elements
    const updateInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
        el.style.cursor = 'none';
      });
    };

    updateInteractiveListeners();

    // Watch for changes in the DOM
    const observer = new MutationObserver(() => {
      updateInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation Loop for smoothing
    let animationFrameId;
    const render = () => {
      // Speed up primary slightly for responsive clicks (0.4)
      targetPosPrimary.current.x += (mousePos.current.x - targetPosPrimary.current.x) * 0.4;
      targetPosPrimary.current.y += (mousePos.current.y - targetPosPrimary.current.y) * 0.4;

      // Slower trail glow (0.15)
      targetPosSecondary.current.x += (mousePos.current.x - targetPosSecondary.current.x) * 0.15;
      targetPosSecondary.current.y += (mousePos.current.y - targetPosSecondary.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetPosPrimary.current.x}px, ${targetPosPrimary.current.y}px, 0)`;
      }

      if (secondaryCursorRef.current) {
        secondaryCursorRef.current.style.transform = `translate3d(${targetPosSecondary.current.x}px, ${targetPosSecondary.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Blue/Cyan Neon Trail Glow behind sword */}
      <div
        ref={secondaryCursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 mix-blend-screen rounded-full blur-[10px]"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(92, 225, 230, 0.3)',
          opacity: isClicked ? 0.8 : 0.3,
        }}
      />

      {/* Primary Pixel Sword Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: '36px',
          height: '36px',
          // Offset so the TIP (top-left of our 16x16 sword) aligns exactly with the mouse coordinate
          marginTop: '-2px',
          marginLeft: '-2px',
          transformOrigin: 'top left',
          transition: 'transform 0.05s linear',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            // Custom swinging animation on click! Scales up slightly on hover!
            transform: `scale(${isHovered ? 1.2 : 1}) rotate(${isClicked ? '-30deg' : '0deg'})`,
            transition: 'transform 0.1s ease-out',
            filter: 'drop-shadow(0 0 3px rgba(92, 225, 230, 0.4))',
          }}
        >
          <svg
            viewBox="0 0 16 16"
            className="w-full h-full"
            shapeRendering="crispEdges"
          >
            {swordGrid.map((row, y) =>
              row.map((color, x) => {
                if (!color) return null;
                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    fill={color}
                  />
                );
              })
            )}
          </svg>
        </div>
      </div>

      {/* Embedded CSS override to ensure system cursor is hidden */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
