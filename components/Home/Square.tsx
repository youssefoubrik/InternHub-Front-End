export const Square: React.FC<SquareProps> = ({
    size,
    top,
    left,
    color,
    delay,
    duration,
    rotation = 0,
    blur = 0,
}) => {
    return (
        <div
            className="absolute rounded-lg shadow-lg animate-float"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                backgroundColor: color,
                opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                transform: `rotate(${rotation}deg)`,
                filter: `blur(${blur}px)`,
                transition: "all 0.5s ease",
            }}
        />
    );
};