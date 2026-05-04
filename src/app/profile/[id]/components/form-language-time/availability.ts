import { WEEK_DAY_VALUES } from "@/configs/options";

export type ScheduleSlot = {
  day: string;
  start: string;
  end: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isScheduleSlot = (value: unknown): value is ScheduleSlot =>
  isRecord(value) &&
  typeof value.day === "string" &&
  typeof value.start === "string" &&
  typeof value.end === "string";

const sortSlots = (slots: ScheduleSlot[]) =>
  [...slots].sort((a, b) => {
    const dayDiff =
      WEEK_DAY_VALUES.indexOf(a.day) - WEEK_DAY_VALUES.indexOf(b.day);

    if (dayDiff !== 0) return dayDiff;

    return a.start.localeCompare(b.start);
  });

const extractSlotArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (isScheduleSlot(value)) return [value];

  if (isRecord(value) && Array.isArray(value.slots)) {
    return value.slots;
  }

  return [];
};

export const serializeAvailabilitySlots = (slots: ScheduleSlot[]) =>
  JSON.stringify(sortSlots(slots));

export const parseAvailabilityValue = (value: unknown): ScheduleSlot[] => {
  const directSlots = extractSlotArray(value);

  if (directSlots.length > 0) {
    return sortSlots(directSlots.filter(isScheduleSlot));
  }

  if (typeof value !== "string") return [];

  const trimmedValue = value.trim();
  if (!trimmedValue) return [];

  try {
    const parsed = JSON.parse(trimmedValue);
    return sortSlots(extractSlotArray(parsed).filter(isScheduleSlot));
  } catch {
    return [];
  }
};

export const normalizeAvailabilityValue = (value: unknown) => {
  if (typeof value === "string") return value;

  const slots = parseAvailabilityValue(value);
  return slots.length > 0 ? serializeAvailabilitySlots(slots) : "";
};
