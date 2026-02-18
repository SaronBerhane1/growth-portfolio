(() => {
  const DATA_LAYER_NAME = "dataLayer";
  const analyticsVersion = "1.0.0";

  window[DATA_LAYER_NAME] = window[DATA_LAYER_NAME] || [];

  const trackEvent = (eventName, payload = {}) => {
    if (!eventName || typeof eventName !== "string") {
      return;
    }

    window[DATA_LAYER_NAME].push({
      event: eventName,
      analytics_version: analyticsVersion,
      ...payload
    });
  };

  const updateFooterYear = () => {
    const yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  };

  const getSectionName = (node) => {
    const section = node.closest("[data-analytics-section]");
    return section ? section.getAttribute("data-analytics-section") : undefined;
  };

  const setupClickTracking = () => {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-analytics-event]");
      if (!target) {
        return;
      }

      const eventName = target.getAttribute("data-analytics-event");
      const label = target.getAttribute("data-analytics-label");

      trackEvent(eventName, {
        event_label: label || undefined,
        section: getSectionName(target)
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateFooterYear();
    setupClickTracking();

    trackEvent("portfolio_page_ready", {
      page_title: document.title,
      page_path: window.location.pathname
    });
  });

  window.trackEvent = trackEvent;
})();
