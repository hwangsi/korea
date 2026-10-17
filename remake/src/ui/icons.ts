// Small line icons and side flags for the command-console UI (docs/graphics.md 9). Inline SVG, drawn with
// currentColor, so no image files are needed and the standalone build stays one file.

const svg = (body: string, fill = false) =>
  `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" ${fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"'}>${body}</svg>`;

export const ICON = {
  newGame: svg('<path d="M4 14.5V1.8M4 2.6h8.2l-2 3 2 3H4"/>'),
  save: svg('<path d="M2.5 2.5h8.5l2.5 2.5v8.5h-11z"/><path d="M5 2.5v3.5h5.5V2.5M5 13.5v-4h6v4"/>'),
  reports: svg('<path d="M4 1.5h6l2.5 2.5v10.5H4z"/><path d="M6 6.5h4.5M6 9h4.5M6 11.5h3"/>'),
  sound: svg('<path d="M6 12.3V3.2l7-1.6v8.8"/><circle cx="4.6" cy="12.4" r="1.6"/><circle cx="11.6" cy="10.6" r="1.6"/>'),
  tutorial: svg('<path d="M8 4.2C6.4 3 4.4 2.7 1.8 3v9.9c2.6-.3 4.6 0 6.2 1.2 1.6-1.2 3.6-1.5 6.2-1.2V3C11.6 2.7 9.6 3 8 4.2zM8 4.2v9.9"/>'),
  air: svg('<path d="M8 1.2c.7 0 1.1 1 1.1 2.1v3.1l5.2 3.1v1.6L9.1 9.6v3l1.6 1.2v1.3L8 14.3l-2.7.8v-1.3l1.6-1.2v-3l-5.2 1.5V9.5l5.2-3.1V3.3c0-1.1.4-2.1 1.1-2.1z"/>', true),
  layers: svg('<path d="M8 2l6 3-6 3-6-3z"/><path d="M2 8.2l6 3 6-3M2 11.2l6 3 6-3"/>'),
  supply: svg('<path d="M2 5l6-3 6 3v6.2L8 14.2l-6-3z"/><path d="M2 5l6 3 6-3M8 8v6.2M5 3.5l6 3"/>'),
  reinforcements: svg('<path d="M3 9.5l5-4 5 4M3 13.5l5-4 5 4M3 5.5l5-4 5 4"/>'),
  victory: svg('<path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/>', true),
} as const;

/** Flag of the side the player commands (UN: light blue with the emblem; Communist: red with a gold star). */
export function sideFlag(side: 'un' | 'communist'): string {
  if (side === 'un') {
    return `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#5b92e5"/>
      <g fill="none" stroke="#fff"><circle cx="15" cy="10" r="4.4" stroke-width="1"/>
      <path d="M15 5.6v8.8M10.6 10h8.8M11.9 7.4c1.9.9 4.3.9 6.2 0M11.9 12.6c1.9-.9 4.3-.9 6.2 0" stroke-width=".6"/>
      <path d="M9.2 6.3c-1.7 2.4-1.7 5 0 7.4M20.8 6.3c1.7 2.4 1.7 5 0 7.4" stroke-width="1.1"/></g></svg>`;
  }
  return `<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#c8302c"/>
    <path d="M7.5 3l1.2 3.7h3.9l-3.2 2.3 1.2 3.7-3.1-2.3-3.2 2.3 1.2-3.7-3.1-2.3h3.9z" fill="#ffd34d"/></svg>`;
}
