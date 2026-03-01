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

  const setupLeadMagnetForm = () => {
    const form = document.getElementById("leadMagnetForm");
    if (!form) {
      return;
    }

    const popup = document.getElementById("lead-popup");
    const popupClose = popup ? popup.querySelector(".lead-popup__close") : null;

    const openPopup = () => {
      if (!popup) {
        return;
      }
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
    };

    const closePopup = () => {
      if (!popup) {
        return;
      }
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailField = form.querySelector("input[type='email']");
      const emailValue = emailField ? emailField.value.trim() : "";
      const hasEmail = Boolean(emailValue);

      if (!hasEmail) {
        if (emailField) {
          emailField.reportValidity();
        }
        return;
      }

      trackEvent("lead_magnet_submit", {
        section: "product_case",
        has_email_input: hasEmail
      });

      form.reset();
      openPopup();
    });

    if (popupClose) {
      popupClose.addEventListener("click", closePopup);
    }

    if (popup) {
      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          closePopup();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    });
  };

  const setupLeadMagnetVideoTracking = () => {
    const video = document.getElementById("leadMagnetVideo");
    const playButton = document.getElementById("leadMagnetVideoPlay");
    const videoWrap = video ? video.closest(".product-case__video-wrap") : null;

    if (!video) {
      return;
    }

    let hasSentStart = false;
    let hasSentComplete = false;

    const trackVideoStart = () => {
      if (hasSentStart) {
        return;
      }
      hasSentStart = true;
      trackEvent("lead_video_start", {
        section: "hero",
        video_id: "leadMagnetVideo"
      });
    };

    const setPlayingState = (isPlaying) => {
      if (!videoWrap) {
        return;
      }
      videoWrap.classList.toggle("is-playing", isPlaying);
    };

    if (playButton) {
      playButton.addEventListener("click", async () => {
        try {
          await video.play();
          setPlayingState(true);
        } catch (_error) {
          trackEvent("lead_video_play_error", {
            section: "hero",
            video_id: "leadMagnetVideo"
          });
        }
      });
    }

    video.addEventListener("play", () => {
      setPlayingState(true);
      trackVideoStart();
    });

    video.addEventListener("pause", () => {
      if (!video.ended) {
        setPlayingState(false);
      }
    });

    video.addEventListener("ended", () => {
      if (hasSentComplete) {
        return;
      }

      hasSentComplete = true;
      setPlayingState(false);
      trackEvent("lead_video_complete", {
        section: "hero",
        video_id: "leadMagnetVideo"
      });
    });
  };

  const setupProductCaseHeightSync = () => {
    const card = document.querySelector(".product-case__card");
    const visual = document.querySelector(".product-case__visual");
    if (!card || !visual) {
      return;
    }

    const syncHeights = () => {
      const isDesktop = window.matchMedia("(min-width: 901px)").matches;
      if (!isDesktop) {
        visual.style.height = "";
        return;
      }
      visual.style.height = `${card.offsetHeight}px`;
    };

    syncHeights();
    window.addEventListener("resize", syncHeights);

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(syncHeights);
      resizeObserver.observe(card);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateFooterYear();
    setupClickTracking();
    setupLeadMagnetForm();
    setupLeadMagnetVideoTracking();
    setupProductCaseHeightSync();

    trackEvent("portfolio_page_ready", {
      page_title: document.title,
      page_path: window.location.pathname
    });
  });

  window.trackEvent = trackEvent;
})();
