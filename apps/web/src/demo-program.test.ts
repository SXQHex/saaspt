import { describe, expect, it } from "vitest";
import { filterSessions } from "./demo-program";

describe("Program discovery", () => {
  it("combines date, room and Turkish case-insensitive instructor search", () => {
    expect(
      filterSessions(23, "B", "ECE YILMAZ").map((session) => session.id),
    ).toEqual(["demo-2", "demo-4"]);
    expect(
      filterSessions(24, "B", "ECE YILMAZ").map((session) => session.id),
    ).toEqual(["demo-6"]);
  });
  it("does not borrow sessions from another day when no match exists", () => {
    expect(filterSessions(25, "all", "")).toEqual([]);
    expect(filterSessions(23, "A", "Yoga")).toEqual([]);
  });
});
