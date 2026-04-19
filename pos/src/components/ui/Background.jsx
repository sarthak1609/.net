import React, { useEffect, useRef } from 'react';

const Background = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    // Start blob at the center of the screen
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;

    const animate = () => {
      // Smooth interpolation for the blob (the lower the multiplier, the smoother/slower the trail)
      blobX += (mouseX - blobX) * 0.04;
      blobY += (mouseY - blobY) * 0.04;

      // Use transform3d for hardware acceleration
      blob.style.transform = `translate3d(${blobX}px, ${blobY}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">
      
      {/* Subtle Grid Pattern for texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply" 
        style={{
          backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Static Ambient Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-teal-400/20 blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-emerald-200/30 blur-[80px]" />
      
      {/* Smooth Mouse Follower Glow */}
      <div 
        ref={blobRef}
        className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full bg-teal-500/20 blur-[70px] mix-blend-multiply will-change-transform"
      />
      
    </div>
  );
};

export default Background;
