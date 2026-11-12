/* The home page's "What's new" card. Newest first; keep each to one line.
   Leave the array empty and the card doesn't render at all.
   House style: three-letter month ("Sep 2026"), no trailing full stop.

   Example:
   { when: "Nov 2026", text: "Shipped spaced-repetition emails for LeetCode Tracker" } */

export type Notice = {
  when: string; // short date label, e.g. "Nov 2026"
  text: string; // one line
};

export const notices: Notice[] = [
  {
    when: "Nov 2026",
    text: "Started my summer internship at Marpos",
  },
  {
    when: "Nov 2026",
    text: "Completed my penultimate year of university",
  },
  {
    when: "Sep 2026",
    text: "Now the 2027 Vice President of SESA, the Software Engineering Students Association",
  },
];
