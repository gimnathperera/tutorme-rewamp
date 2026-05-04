"use client";

import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getNestedError } from "@/utils/form";
import { Clock3 } from "lucide-react";
import {
  parseAvailabilityValue,
  ScheduleSlot,
  serializeAvailabilitySlots,
} from "./availability";
import { WEEK_DAY_OPTIONS } from "@/configs/options";

const getTimeLabel = (value: string) =>
  new Date(`1970-01-01T${value}:00`).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const slotsOverlap = (
  first: Pick<ScheduleSlot, "start" | "end">,
  second: Pick<ScheduleSlot, "start" | "end">,
) => first.start < second.end && first.end > second.start;

const AvailabilityScheduler = () => {
  const { control, formState } = useFormContext();
  const [selectedDay, setSelectedDay] = useState(WEEK_DAY_OPTIONS[0].value);
  const [selectedStart, setSelectedStart] = useState("19:30");
  const [selectedEnd, setSelectedEnd] = useState("21:00");
  const [localError, setLocalError] = useState("");

  const error = getNestedError(formState.errors, "availability");

  const groupedSlots = useMemo(
    () =>
      WEEK_DAY_OPTIONS.map((day) => ({
        ...day,
        slots: [] as ScheduleSlot[],
      })),
    [],
  );

  return (
    <Controller
      name="availability"
      control={control}
      render={({ field }) => {
        const slots = parseAvailabilityValue(field.value);
        const hasLegacyText =
          typeof field.value === "string" &&
          field.value.trim() !== "" &&
          slots.length === 0;

        const scheduleByDay = groupedSlots.map((day) => ({
          ...day,
          slots: slots.filter((slot) => slot.day === day.value),
        }));

        const addSlot = () => {
          if (!selectedDay || !selectedStart || !selectedEnd) {
            setLocalError("Choose a day, start time, and end time.");
            return;
          }

          if (selectedStart >= selectedEnd) {
            setLocalError("End time must be later than start time.");
            return;
          }

          const nextSlot = {
            day: selectedDay,
            start: selectedStart,
            end: selectedEnd,
          };

          const duplicateSlot = slots.some(
            (slot) =>
              slot.day === nextSlot.day &&
              slot.start === nextSlot.start &&
              slot.end === nextSlot.end,
          );

          if (duplicateSlot) {
            setLocalError("That time slot is already added.");
            return;
          }

          const overlappingSlot = slots.find(
            (slot) => slot.day === nextSlot.day && slotsOverlap(slot, nextSlot),
          );

          if (overlappingSlot) {
            setLocalError(
              `This overlaps with an existing slot on ${overlappingSlot.day}: ${getTimeLabel(
                overlappingSlot.start,
              )} - ${getTimeLabel(overlappingSlot.end)}.`,
            );
            return;
          }

          setLocalError("");
          field.onChange(serializeAvailabilitySlots([...slots, nextSlot]));
        };

        const removeSlot = (slotToRemove: ScheduleSlot) => {
          const nextSlots = slots.filter(
            (slot) =>
              !(
                slot.day === slotToRemove.day &&
                slot.start === slotToRemove.start &&
                slot.end === slotToRemove.end
              ),
          );

          field.onChange(
            nextSlots.length > 0 ? serializeAvailabilitySlots(nextSlots) : "",
          );
        };

        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Weekly Availability<span className="text-red-500"> *</span>
            </label>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <label className="flex flex-col">
                  <span className="mb-1 block text-xs font-medium text-gray-500">
                    Day
                  </span>
                  <select
                    value={selectedDay}
                    onChange={(event) => setSelectedDay(event.target.value)}
                    className="h-12 rounded-md border border-linegrey px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {WEEK_DAY_OPTIONS.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="relative flex flex-col">
                  <span className="mb-1 block text-xs font-medium text-gray-500">
                    Start time
                  </span>
                  <Clock3 className="pointer-events-none absolute left-3 top-[2.15rem] h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    step={1800}
                    value={selectedStart}
                    onChange={(event) => setSelectedStart(event.target.value)}
                    className="h-12 w-full rounded-md border border-linegrey py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>

                <label className="relative flex flex-col">
                  <span className="mb-1 block text-xs font-medium text-gray-500">
                    End time
                  </span>
                  <Clock3 className="pointer-events-none absolute left-3 top-[2.15rem] h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    step={1800}
                    value={selectedEnd}
                    onChange={(event) => setSelectedEnd(event.target.value)}
                    className="h-12 w-full rounded-md border border-linegrey py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>

                <div className="flex flex-col">
                  <span className="mb-1 block text-xs font-medium text-transparent">
                    Action
                  </span>
                  <button
                    type="button"
                    onClick={addSlot}
                    className="h-12 rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
                  >
                    Add Slot
                  </button>
                </div>
              </div>

              {(localError || error) && (
                <span className="mt-3 block text-xs text-red-500">
                  {localError || error}
                </span>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {scheduleByDay.map((day) => (
                  <div
                    key={day.value}
                    className="rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="mb-2 text-sm font-semibold text-gray-900">
                      {day.label}
                    </div>

                    {day.slots.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {day.slots.map((slot) => (
                          <div
                            key={`${slot.day}-${slot.start}-${slot.end}`}
                            className="flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900"
                          >
                            <span>
                              {getTimeLabel(slot.start)} -{" "}
                              {getTimeLabel(slot.end)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSlot(slot)}
                              className="font-medium text-blue-700 hover:text-blue-900"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        No slots added
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasLegacyText && (
                <p className="mt-3 text-xs text-amber-600">
                  Existing availability is stored as plain text. Add or remove a
                  slot to replace it with the new schedule format.
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Add weekly teaching slots in a calendar-style format, for example
              Tuesday 7:30 PM to 9:00 PM.
            </p>
          </div>
        );
      }}
    />
  );
};

export default AvailabilityScheduler;
