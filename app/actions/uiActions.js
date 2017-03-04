export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    locale
  };
//  return {
//    type: CHANGE_LOCALE,
//    locale
//  };
}

export const VISIBLE_INTERVAL_CHANGED = 'VISIBLE_INTERVAL_CHANGED';
export function visibleIntervalChanged(interval) {
  return {
    type: VISIBLE_INTERVAL_CHANGED,
    interval
  };
}

export function changeVisibleInterval(interval) {
  return (dispatch) => {
    dispatch(visibleIntervalChanged(interval));
  };
}

export const AUTOSCROLLING_CHANGED = 'AUTOSCROLLING_CHANGED';
export function autoscrollChanged(autoscroll) {
  return {
    type: AUTOSCROLLING_CHANGED,
    autoscroll
  };
}

export function changeAutoscroll(autoscroll) {
  return (dispatch) => {
    dispatch(autoscrollChanged(autoscroll));
  };
}
