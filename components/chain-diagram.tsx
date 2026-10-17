const CHAIN = ["Prerequisite", "Core skill", "Role skill", "Target role"];

export function ChainDiagram() {
  const ys = [28, 96, 164, 232];
  return (
    <svg
      viewBox="0 0 300 260"
      className="w-full max-w-72"
      role="img"
      aria-label="A prerequisite chain leading to a target role"
    >
      <path
        d="M30 28 C 30 62, 78 62, 78 96 S 126 130, 126 164 S 174 198, 174 232"
        fill="none"
        stroke="var(--route)"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength={1}
        className="route-draw"
      />
      {ys.map((y, i) => {
        const x = 30 + i * 48;
        return (
          <g key={y}>
            <circle
              cx={x}
              cy={y}
              r="11"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="var(--foreground)"
              className="tnum"
            >
              {i + 1}
            </text>
            <text
              x={x + 18}
              y={y + 4}
              fontSize="13"
              fontWeight="500"
              fill="var(--foreground)"
            >
              {CHAIN[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
