export function replayEvents(events, currentTime) {
  const head = events[0];
  const tail = events.slice(1);

  // Exit condition, no events
  if (head === undefined) return;

  if (head.timestamp > currentTime) {
    const delay = head.timestamp - currentTime;
    setTimeout(() => {
      head.replay();
      replayEvents(tail, head.timestamp);
    }, delay);
  } else {
    replayEvents(tail, currentTime);
  }
}
