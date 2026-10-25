import { describe, it, expect } from "vitest";
import { parsePositiveTryMinor, formatTryMinor } from "./money-input";

describe("TRY draft amounts", () => {
  it("parses comma or dot decimal input exactly into minor units", () => {
    expect(parsePositiveTryMinor(" 1200,50 ")).toBe("120050");
    expect(parsePositiveTryMinor("0.01")).toBe("1");
    expect(parsePositiveTryMinor("0003,5")).toBe("350");
    expect(parsePositiveTryMinor("400")).toBe("40000");
  });
  it("rejects nonpositive, grouped, exponential or overprecise input", () => {
    for (const value of [
      "",
      "0",
      "0,00",
      "-3",
      "1.200,50",
      "1e3",
      "12,345",
      "12 00",
      "NaN",
      "Infinity",
    ])
      expect(parsePositiveTryMinor(value)).toBeNull();
  });
  it("preserves cents and large integer precision during parsing and display", () => {
    expect(parsePositiveTryMinor("9007199254740993,01")).toBe(
      "900719925474099301",
    );
    expect(formatTryMinor("900719925474099301")).toBe(
      "₺9.007.199.254.740.993,01",
    );
    expect(formatTryMinor("1")).toBe("₺0,01");
  });
});
