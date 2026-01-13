export enum CustomAppEvent {
  TriggerRefreshToken = "trigger-refresh-token",
}

export const triggerCustomAppEvent = <T>(
  type: CustomAppEvent,
  event?: T,
): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(type, { detail: event }));
};
