import React from 'react';

interface KegelDiagramProps {
  phase: 'contract' | 'relax';
}

export const KegelDiagram: React.FC<KegelDiagramProps> = ({ phase }) => {
  const isContracted = phase === 'contract';

  return (
    <svg viewBox="0 0 100 60" className="w-full h-auto" aria-labelledby="title desc" role="img">
      <title id="title">Kegel Exercise Diagram</title>
      <desc id="desc">An illustration of the pelvic floor muscles in a {phase} state.</desc>
      
      {/* Pelvic Bone Structure */}
      <path d="M 10 50 C 20 20, 30 10, 50 10 S 80 20, 90 50" fill="none" stroke="#6B7280" strokeWidth="3" />
      
      {/* Bladder representation */}
      <circle cx="50" cy="25" r="8" fill="#60A5FA" opacity="0.5" />

      {/* Pelvic Floor Muscle */}
      <path
        d={isContracted ? "M 20 45 Q 50 30, 80 45" : "M 20 45 Q 50 55, 80 45"}
        fill={isContracted ? "rgba(129, 140, 248, 0.5)" : "rgba(45, 212, 191, 0.4)"}
        stroke={isContracted ? "#818CF8" : "#2DD4BF"}
        strokeWidth="2"
        style={{ transition: 'd 0.7s ease-in-out, fill 0.7s ease-in-out, stroke 0.7s ease-in-out' }}
      />

      {/* Arrow for contraction */}
      {isContracted && (
        <g className="text-indigo-400 animate-pulse">
          <path d="M 45 35 L 50 30 L 55 35" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
           <path d="M 45 40 L 50 35 L 55 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

       {/* Arrow for relaxation */}
      {!isContracted && (
         <g className="text-teal-400 animate-pulse">
          <path d="M 45 45 L 50 50 L 55 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
           <path d="M 45 40 L 50 45 L 55 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};