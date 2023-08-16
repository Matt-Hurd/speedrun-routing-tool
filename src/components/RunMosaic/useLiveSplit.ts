import { useEffect } from "react";
import liveSplitService from "../../services/LiveSplitWebSocket";

export const useLivesplit = () => {
  const liveSplit = liveSplitService;

  useEffect(() => {
    function handleLoad() {
      (async () => {
        liveSplit.connect();
      })();
    }
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
    return () => {
      if (liveSplit) {
        liveSplit.disconnect();
      }
    };
  }, [liveSplit]);
};
