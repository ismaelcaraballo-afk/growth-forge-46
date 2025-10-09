interface ConfettiPiece {
  id: number;
  left: number;
  backgroundColor: string;
  delay: number;
}

interface ConfettiProps {
  pieces: ConfettiPiece[];
}

export const Confetti = ({ pieces }: ConfettiProps) => (
  <>
    {pieces.map((piece) => (
      <div
        key={piece.id}
        className="fixed w-3 h-3 animate-in fade-out slide-out-to-bottom duration-3000 z-50"
        style={{
          left: `${piece.left}%`,
          backgroundColor: piece.backgroundColor,
          animationDelay: `${piece.delay}s`,
          top: '-10px',
        }}
      />
    ))}
  </>
);
