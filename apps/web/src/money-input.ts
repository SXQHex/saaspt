// Exact parsing for local TRY form input; not an API request model.
export function parsePositiveTryMinor(input: string): string | null {
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(input.trim());
  if (!match) return null;
  const minor =
    BigInt(match[1]!) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
  return minor > 0n ? String(minor) : null;
}

export function formatTryMinor(minor: string): string {
  const amount = BigInt(minor);
  const fraction = String(amount % 100n).padStart(2, "0");
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .formatToParts(amount / 100n)
    .map((part) => (part.type === "fraction" ? fraction : part.value))
    .join("");
}
