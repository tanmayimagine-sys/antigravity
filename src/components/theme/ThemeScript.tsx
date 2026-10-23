import React from "react";

/**
 * Injected directly into <head> to prevent Flash of Unstyled Content (FOUC).
 * Evaluates localStorage and system time synchronously before initial paint.
 */
export function ThemeScript() {
  const code = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-mode') || 'adaptive';
        var schedStr = localStorage.getItem('theme-schedule');
        var schedule = { lightStart: '07:00', darkStart: '19:00' };
        if (schedStr) {
          try {
            var parsed = JSON.parse(schedStr);
            if (parsed.lightStart && parsed.darkStart) schedule = parsed;
          } catch(e) {}
        }
        
        var theme = 'light';
        if (mode === 'light') {
          theme = 'light';
        } else if (mode === 'dark') {
          theme = 'dark';
        } else {
          // Adaptive mode: local clock time
          var now = new Date();
          var curM = now.getHours() * 60 + now.getMinutes();
          var lParts = schedule.lightStart.split(':');
          var dParts = schedule.darkStart.split(':');
          var lM = parseInt(lParts[0], 10) * 60 + parseInt(lParts[1], 10);
          var dM = parseInt(dParts[0], 10) * 60 + parseInt(dParts[1], 10);
          if (lM < dM) {
            theme = (curM >= lM && curM < dM) ? 'light' : 'dark';
          } else {
            theme = (curM >= lM || curM < dM) ? 'light' : 'dark';
          }
        }

        var root = document.documentElement;
        if (theme === 'dark') {
          root.setAttribute('data-theme', 'dark');
          root.style.colorScheme = 'dark';
        } else {
          root.removeAttribute('data-theme');
          root.style.colorScheme = 'light';
        }
      } catch (err) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
