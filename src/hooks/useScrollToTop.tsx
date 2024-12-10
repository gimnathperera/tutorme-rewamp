import { useEffect } from "react";

export const useScrollToTop = (trigger: boolean) => {
  useEffect(() => {
    if (trigger) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [trigger]);
};
