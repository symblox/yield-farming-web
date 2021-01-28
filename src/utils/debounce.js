//rate limiting
let lastId;
export function debounce(idle, action) {
  return function () {
    var ctx = this,
      args = arguments;
    clearTimeout(lastId);
    lastId = setTimeout(function () {
      action.apply(ctx, args); // take action after `idle` amount of milliseconds delay
    }, idle);
  };
}
