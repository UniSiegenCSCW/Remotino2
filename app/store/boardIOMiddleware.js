export const boardIOMiddleware = () => next => action => {
  if (action.boardIO) {
    action.boardIO();
  }
  next(action);
};
