/* The home page's "What's new" card. Newest first; keep each to one line.
   Leave the array empty and the card doesn't render at all.

   Example:
   { when: "Nov 2026", text: "Shipped spaced-repetition emails for LeetCode Tracker." } */

export type Notice = {
  when: string; // short date label, e.g. "Nov 2026"
  text: string; // one line
};

export const notices: Notice[] = [];
