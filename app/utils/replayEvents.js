export function replayEvents(events, start, end) {
  const head = events[0];
  const tail = events.slice(1);

  // Exit condition, no events
  if (head === undefined) return;

  if (head.time > start && head.time < end) {
    const delay = head.time - start;
    setTimeout(() => {
      head.replay();
      replayEvents(tail, head.time, end);
    }, delay);
  } else {
    replayEvents(tail, start, end);
  }
}
