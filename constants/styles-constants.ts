const colors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "#ff7e5f", // Additional vibrant colors
    "#feb47b",
    "#ffac81",
    "#ff928b",
    "#fec3a6",
];

const squares = Array.from(
    { length: 60 },
    () => ({
        size: Math.floor(Math.random() * 80) + 20, // 20-100px
        top: Math.floor(Math.random() * 95), // 0-95%
        left: Math.floor(Math.random() * 90) + 5, // 5-95%
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5, // 0-5s delay
        duration: Math.random() * 4 + 3, // 3-7s duration
        rotation: Math.floor(Math.random() * 45), // 0-45 degrees rotation
        blur: Math.random() < 0.3 ? Math.random() * 5 : 0, // 30% chance of blur effect
    }),
);

export const STYLE_CONSTANTS = {
    squares,
}