import type { ReactNode } from "react";

export function Screen({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="screen">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summaryRow">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export function DebugSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="debugSection">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
