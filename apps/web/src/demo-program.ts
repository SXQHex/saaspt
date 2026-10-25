// Presentation fixtures only. These are not backend DTOs or an API mock.
export type DemoSession = {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  instructor: string;
  room: "A" | "B";
  discipline: string;
  participants: number;
  capacity: number;
  programTitle?: string;
  state: "completed" | "upcoming";
};
export const sessions: DemoSession[] = [
  {
    id: "demo-1",
    day: 23,
    start: "10:00",
    end: "11:00",
    title: "Güne hareketle başla",
    instructor: "Deniz Kaya",
    room: "A",
    discipline: "Pilates",
    participants: 8,
    capacity: 10,
    state: "completed",
  },
  {
    id: "demo-2",
    day: 23,
    start: "12:30",
    end: "13:30",
    title: "Öğle arası akışı",
    instructor: "Ece Yılmaz",
    room: "B",
    discipline: "Yoga",
    participants: 6,
    capacity: 12,
    state: "completed",
  },
  {
    id: "demo-3",
    day: 23,
    start: "17:00",
    end: "18:00",
    title: "Temelden Salsa",
    programTitle: "Salsa başlangıç programı (örnek)",
    instructor: "Deniz Kaya",
    room: "A",
    discipline: "Salsa",
    participants: 14,
    capacity: 16,
    state: "upcoming",
  },
  {
    id: "demo-4",
    day: 23,
    start: "18:30",
    end: "19:30",
    title: "Güç ve denge",
    instructor: "Ece Yılmaz",
    room: "B",
    discipline: "Pilates",
    participants: 10,
    capacity: 10,
    state: "upcoming",
  },
  {
    id: "demo-5",
    day: 23,
    start: "20:00",
    end: "21:00",
    title: "Bachata pratiği",
    instructor: "Arda Demir",
    room: "A",
    discipline: "Bachata",
    participants: 12,
    capacity: 18,
    state: "upcoming",
  },
  {
    id: "demo-6",
    day: 24,
    start: "11:00",
    end: "12:00",
    title: "Hafta sonu akışı",
    instructor: "Ece Yılmaz",
    room: "B",
    discipline: "Yoga",
    participants: 5,
    capacity: 12,
    state: "upcoming",
  },
];
export function filterSessions(day: number, room: string, query: string) {
  const term = query.trim().toLocaleLowerCase("tr-TR");
  return sessions.filter(
    (session) =>
      session.day === day &&
      (room === "all" || session.room === room) &&
      `${session.title} ${session.instructor} ${session.discipline}`
        .toLocaleLowerCase("tr-TR")
        .includes(term),
  );
}
