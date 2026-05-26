export default function LegendItem({
  className,
  label
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="legendItem">
      <span className={className} />
      {label}
    </span>
  );
}
