export enum CustomAppEvent {
  TriggerRefreshToken = 'trigger-refresh-token',
}

export const triggerCustomAppEvent = <T>(type: CustomAppEvent, event?: T): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(type, { detail: event }));
};

export const subscribeCustomAppEvent = (type: CustomAppEvent, callback: EventListener): void => {
  if (typeof window === 'undefined') return;
  window.addEventListener(type, callback);
};

export const unsubscribeCustomAppEvent = (type: CustomAppEvent, callback: EventListener): void => {
  if (typeof window === 'undefined') return;
  window.removeEventListener(type, callback);
};
