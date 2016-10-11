export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export function setVisibilityFilter(property, value) {
  return {
    type: SET_VISIBILITY_FILTER,
    property,
    value,
  };
}
