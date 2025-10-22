"use client";
import { useEffect } from "react";

export default function HideDevTools() {
  useEffect(() => {
    const hideButton = () => {
      // Try multiple selectors
      const selectors = [
        'button[aria-label="Open Next.js Dev Tools"]',
        'button[aria-label*="Next.js"]',
        'button[aria-label*="Dev Tools"]',
        'body > button[style*="position: fixed"]',
      ];

      selectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
          button.style.setProperty('display', 'none', 'important');
          button.style.setProperty('visibility', 'hidden', 'important');
          button.style.setProperty('opacity', '0', 'important');
          button.style.setProperty('pointer-events', 'none', 'important');
          button.remove(); // Just remove it completely
        });
      });
    };

    // Run immediately
    hideButton();

    // Run repeatedly for the first 2 seconds
    const intervals = [];
    for (let i = 0; i < 20; i++) {
      intervals.push(setTimeout(hideButton, i * 100));
    }

    // Set up a mutation observer to catch it if it's added later
    const observer = new MutationObserver(hideButton);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      intervals.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return null;
}
