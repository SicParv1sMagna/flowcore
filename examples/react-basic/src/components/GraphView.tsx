import { FlowNode } from "../nodes";

type GraphViewProps = {
  current: FlowNode;
  next: FlowNode[];
  history: FlowNode[];
  edges: Array<[FlowNode, FlowNode]>;
};

const NODE_WIDTH = 158;
const NODE_HEIGHT = 54;

const positions: Record<FlowNode, { x: number; y: number }> = {
  [FlowNode.Welcome]: { x: 40, y: 150 },
  [FlowNode.Profile]: { x: 250, y: 150 },
  [FlowNode.Plan]: { x: 460, y: 150 },
  [FlowNode.PersonalDetails]: { x: 680, y: 60 },
  [FlowNode.CompanyDetails]: { x: 680, y: 240 },
  [FlowNode.Review]: { x: 910, y: 150 },
  [FlowNode.Success]: { x: 1140, y: 150 }
};

const labels: Record<FlowNode, string> = {
  [FlowNode.Welcome]: "Welcome",
  [FlowNode.Profile]: "Profile",
  [FlowNode.Plan]: "Plan",
  [FlowNode.PersonalDetails]: "Personal path",
  [FlowNode.CompanyDetails]: "Business path",
  [FlowNode.Review]: "Review",
  [FlowNode.Success]: "Success"
};

export function GraphView({ current, next, history, edges }: GraphViewProps) {
  const visited = new Set(history);
  const available = new Set(next);

  return (
    <div className="graphViewScroller">
      <svg
        className="graphView"
        viewBox="0 0 1340 380"
        role="img"
        aria-label="Flow graph visualization"
      >
        <defs>
          <linearGradient id="nodeCurrentGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" className="graphArrow" />
          </marker>

          <marker
            id="arrowActive"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" className="graphArrowActive" />
          </marker>
        </defs>

        {edges.map(([from, to]) => {
          const fromPosition = positions[from];
          const toPosition = positions[to];

          const isAvailableEdge = from === current && available.has(to);
          const isHistoryEdge = isEdgeInHistory(history, from, to);

          return (
            <GraphEdge
              key={`${from}->${to}`}
              from={fromPosition}
              to={toPosition}
              active={isAvailableEdge}
              visited={isHistoryEdge}
            />
          );
        })}

        {(Object.values(FlowNode) as FlowNode[]).map((node) => {
          const position = positions[node];

          return (
            <GraphNode
              key={node}
              label={labels[node]}
              value={node}
              x={position.x}
              y={position.y}
              current={node === current}
              available={available.has(node)}
              visited={visited.has(node)}
            />
          );
        })}
      </svg>
    </div>
  );
}

function GraphEdge({
  from,
  to,
  active,
  visited
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  visited: boolean;
}) {
  const startX = from.x + NODE_WIDTH;
  const startY = from.y + NODE_HEIGHT / 2;
  const endX = to.x;
  const endY = to.y + NODE_HEIGHT / 2;

  const middleX = startX + (endX - startX) / 2;

  const path = [
    `M ${startX} ${startY}`,
    `C ${middleX} ${startY}, ${middleX} ${endY}, ${endX} ${endY}`
  ].join(" ");

  const className = [
    "graphEdge",
    visited ? "visited" : "",
    active ? "active" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <path
      className={className}
      d={path}
      markerEnd={active ? "url(#arrowActive)" : "url(#arrow)"}
    />
  );
}

function GraphNode({
  label,
  value,
  x,
  y,
  current,
  available,
  visited
}: {
  label: string;
  value: string;
  x: number;
  y: number;
  current: boolean;
  available: boolean;
  visited: boolean;
}) {
  const className = [
    "graphNode",
    visited ? "visited" : "",
    available ? "available" : "",
    current ? "current" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <g className={className} transform={`translate(${x}, ${y})`}>
      <rect width={NODE_WIDTH} height={NODE_HEIGHT} rx="18" />
      <text x="18" y="23" className="graphNodeLabel">
        {label}
      </text>
      <text x="18" y="39" className="graphNodeValue">
        {value}
      </text>
    </g>
  );
}

function isEdgeInHistory(
  history: FlowNode[],
  from: FlowNode,
  to: FlowNode
): boolean {
  for (let index = 0; index < history.length - 1; index += 1) {
    if (history[index] === from && history[index + 1] === to) {
      return true;
    }
  }

  return false;
}
