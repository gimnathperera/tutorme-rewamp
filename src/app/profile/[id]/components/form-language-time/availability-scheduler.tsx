"use client";

import {
  type Dispatch,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getNestedError } from "@/utils/form";
import { ChevronDown, Clock3 } from "lucide-react";
import {
  parseAvailabilityValue,
  ScheduleSlot,
  serializeAvailabilitySlots,
} from "./availability";
import { WEEK_DAY_OPTIONS } from "@/configs/options";

type TimePickerId = "start" | "end";
type TimePeriod = "AM" | "PM";

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0"),
);
const PERIOD_OPTIONS: TimePeriod[] = ["AM", "PM"];
const WHEEL_ITEM_HEIGHT = 36;

const getTimeLabel = (value: string) =>
  new Date(`1970-01-01T${value}:00`).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const getTimeParts = (value: string) => {
  const [hourValue = "0", minuteValue = "00"] = value.split(":");
  const hour24 = Number(hourValue);
  const period: TimePeriod = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return {
    hour: hour12,
    minute: MINUTE_OPTIONS.includes(minuteValue) ? minuteValue : "00",
    period,
  };
};

const buildTimeValue = (hour: number, minute: string, period: TimePeriod) => {
  const hour24 = period === "AM" ? hour % 12 : (hour % 12) + 12;
  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

const slotsOverlap = (
  first: Pick<ScheduleSlot, "start" | "end">,
  second: Pick<ScheduleSlot, "start" | "end">,
) => first.start < second.end && first.end > second.start;

type AlarmTimePickerProps = {
  id: TimePickerId;
  label: string;
  value: string;
  isOpen: boolean;
  onToggle: Dispatch<TimePickerId>;
  onChange: Dispatch<string>;
};

type WheelOption = {
  label: string;
  value: string;
};

type TimeWheelColumnProps = {
  label: string;
  options: WheelOption[];
  selectedValue: string;
  onSelect: Dispatch<string>;
};

type TimeWheelColumnHandle = {
  commitCenteredOption: () => string;
};

const TimeWheelColumn = forwardRef<TimeWheelColumnHandle, TimeWheelColumnProps>(({
  label,
  options,
  selectedValue,
  onSelect,
}, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const initialSelectedValueRef = useRef(selectedValue);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<number | null>(null);

  const scrollToOption = useCallback((
    optionValue: string,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const selectedIndex = options.findIndex(
      (option) => option.value === optionValue,
    );

    if (selectedIndex < 0) return;

    if (autoScrollTimeoutRef.current) {
      window.clearTimeout(autoScrollTimeoutRef.current);
    }

    isAutoScrollingRef.current = true;
    containerRef.current?.scrollTo({
      top: selectedIndex * WHEEL_ITEM_HEIGHT,
      behavior,
    });
    autoScrollTimeoutRef.current = window.setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, behavior === "smooth" ? 300 : 150);
  }, [options]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      scrollToOption(initialSelectedValueRef.current, "auto");
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (autoScrollTimeoutRef.current) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [scrollToOption]);

  const getCenteredOptionValue = () => {
    const container = containerRef.current;
    if (!container) return selectedValue;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;
    let nearestValue = selectedValue;
    let nearestDistance = Number.POSITIVE_INFINITY;

    options.forEach((option) => {
      const element = itemRefs.current[option.value];
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.top + elementRect.height / 2;
      const distance = Math.abs(containerCenter - elementCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestValue = option.value;
      }
    });

    return nearestValue;
  };

  const selectCenteredOption = () => {
    if (isAutoScrollingRef.current) return;

    const nearestValue = getCenteredOptionValue();

    if (nearestValue !== selectedValue) {
      onSelect(nearestValue);
    }
  };

  useImperativeHandle(ref, () => ({
    commitCenteredOption: () => {
      const nearestValue = getCenteredOptionValue();
      onSelect(nearestValue);
      return nearestValue;
    },
  }));

  return (
    <div className="min-w-0">
      <div className="mb-1 text-center text-[10px] font-semibold uppercase text-gray-400">
        {label}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-9 -translate-y-1/2 rounded-md border border-primary-100 bg-primary-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-white to-transparent" />

        <div
          ref={containerRef}
          onScroll={selectCenteredOption}
          className="flex h-28 snap-y snap-mandatory flex-col overflow-y-auto overscroll-contain scroll-smooth py-[2.375rem] [scrollbar-width:none] sm:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden sm:[&::-webkit-scrollbar]:block"
        >
          {options.map((option) => {
            const selected = selectedValue === option.value;

            return (
              <button
                key={option.value}
                ref={(element) => {
                  itemRefs.current[option.value] = element;
                }}
                type="button"
                onClick={() => {
                  scrollToOption(option.value);
                  onSelect(option.value);
                }}
                data-selected={selected}
                className={`relative z-20 flex h-9 shrink-0 snap-center items-center justify-center rounded-md text-center text-lg font-semibold transition-colors sm:text-sm ${
                  selected
                    ? "text-primary-700"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

TimeWheelColumn.displayName = "TimeWheelColumn";

const AlarmTimePicker = ({
  id,
  label,
  value,
  isOpen,
  onToggle,
  onChange,
}: AlarmTimePickerProps) => {
  const timeParts = getTimeParts(value);
  const hourWheelRef = useRef<TimeWheelColumnHandle | null>(null);
  const minuteWheelRef = useRef<TimeWheelColumnHandle | null>(null);
  const periodWheelRef = useRef<TimeWheelColumnHandle | null>(null);
  const hourOptions = useMemo(
    () =>
      HOUR_OPTIONS.map((hour) => ({
        label: String(hour),
        value: String(hour),
      })),
    [],
  );
  const minuteOptions = useMemo(
    () =>
      MINUTE_OPTIONS.map((minute) => ({
        label: minute,
        value: minute,
      })),
    [],
  );
  const periodOptions = useMemo(
    () =>
      PERIOD_OPTIONS.map((period) => ({
        label: period,
        value: period,
      })),
    [],
  );

  const updateTime = (
    nextPart: Partial<{
      hour: number;
      minute: string;
      period: TimePeriod;
    }>,
  ) => {
    onChange(
      buildTimeValue(
        nextPart.hour ?? timeParts.hour,
        nextPart.minute ?? timeParts.minute,
        nextPart.period ?? timeParts.period,
      ),
    );
  };

  const setSelectedTime = () => {
    const hour = Number(
      hourWheelRef.current?.commitCenteredOption() ?? timeParts.hour,
    );
    const minute =
      minuteWheelRef.current?.commitCenteredOption() ?? timeParts.minute;
    const period = (periodWheelRef.current?.commitCenteredOption() ??
      timeParts.period) as TimePeriod;

    onChange(buildTimeValue(hour, minute, period));
    onToggle(id);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const shouldLockPageScroll = window.matchMedia("(max-width: 639px)").matches;
    if (!shouldLockPageScroll) return undefined;

    const originalOverflow = document.body.style.overflow;
    const originalOverscrollBehavior = document.body.style.overscrollBehavior;
    const originalTouchAction = document.body.style.touchAction;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscrollBehavior;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  return (
    <div className="relative flex flex-col">
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex h-12 w-full items-center justify-between rounded-md border border-linegrey bg-white px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{getTimeLabel(value)}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label={`Close ${label.toLowerCase()} picker`}
            onClick={() => onToggle(id)}
            onTouchMove={(event) => event.preventDefault()}
            className="fixed inset-0 z-20 touch-none bg-black/25 backdrop-blur-[1px] sm:bg-transparent sm:backdrop-blur-none"
          />

          <div
            className="fixed left-1/2 top-1/2 z-30 w-[calc(100vw-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overscroll-contain rounded-lg border border-gray-200 bg-white p-3 shadow-xl sm:absolute sm:inset-x-0 sm:top-[4.45rem] sm:w-auto sm:max-w-none sm:translate-x-0 sm:translate-y-0 sm:p-2.5 sm:shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between sm:hidden">
              <span className="text-sm font-semibold text-gray-900">
                {label}
              </span>
              <span className="text-sm font-semibold text-primary-700">
                {getTimeLabel(value)}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_0.25rem_1fr_0.82fr] items-stretch gap-2">
              <TimeWheelColumn
                ref={hourWheelRef}
                label="Hour"
                options={hourOptions}
                selectedValue={String(timeParts.hour)}
                onSelect={(hour) => updateTime({ hour: Number(hour) })}
              />

              <div className="flex items-center justify-center pb-1 pt-[1.15rem] text-lg font-semibold text-gray-300">
                :
              </div>

              <TimeWheelColumn
                ref={minuteWheelRef}
                label="Minute"
                options={minuteOptions}
                selectedValue={timeParts.minute}
                onSelect={(minute) => updateTime({ minute })}
              />

              <TimeWheelColumn
                ref={periodWheelRef}
                label="Period"
                options={periodOptions}
                selectedValue={timeParts.period}
                onSelect={(period) =>
                  updateTime({ period: period as TimePeriod })
                }
              />
            </div>

            <button
              type="button"
              onClick={setSelectedTime}
              className="mt-3 h-11 w-full rounded-md bg-primary-700 text-sm font-semibold text-white transition-colors hover:bg-primary-800 sm:hidden"
            >
              Set
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const AvailabilityScheduler = () => {
  const { control, formState } = useFormContext();
  const [selectedDay, setSelectedDay] = useState(WEEK_DAY_OPTIONS[0].value);
  const [selectedStart, setSelectedStart] = useState("19:30");
  const [selectedEnd, setSelectedEnd] = useState("21:00");
  const [openPicker, setOpenPicker] = useState<TimePickerId | null>(null);
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

                <AlarmTimePicker
                  id="start"
                  label="Start time"
                  value={selectedStart}
                  isOpen={openPicker === "start"}
                  onToggle={(pickerId) =>
                    setOpenPicker((current) =>
                      current === pickerId ? null : pickerId,
                    )
                  }
                  onChange={setSelectedStart}
                />

                <AlarmTimePicker
                  id="end"
                  label="End time"
                  value={selectedEnd}
                  isOpen={openPicker === "end"}
                  onToggle={(pickerId) =>
                    setOpenPicker((current) =>
                      current === pickerId ? null : pickerId,
                    )
                  }
                  onChange={setSelectedEnd}
                />

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
