import { STATUS } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-[15px] text-cocoa-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${s.tone}`}>{s.label}</span>;
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="card grid place-items-center px-6 py-16 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mt-1 max-w-sm text-[14px] text-cocoa-500">{text}</p>
    </div>
  );
}
