export function replayEvents(events, start, end) {
  const [head, ...tail] = events;

  // Exit condition, no events
  if (head === undefined) return;

  if (head.time >= start && head.time <= end) {
    const delay = head.time - start;
    setTimeout(() => {
      head.replay();
      replayEvents(tail, head.time, end);
    }, delay);
  } else {
    replayEvents(tail, start, end);
  }
}
