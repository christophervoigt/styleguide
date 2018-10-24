function triggerEvent(eventType) {
  let event;

  if (window.dispatchEvent) {
    try {
      event = new Event(eventType, {
        bubbles: true,
        cancelable: true,
      });
    } catch (error) {
      event = document.createEvent('HTMLEvents');
      event.initEvent(eventType, true, true);
    }
    return window.dispatchEvent(event);
  }
  return window.fireEvent(`on${eventType}`, document.createEventObject());
}

function preventDefaultEvent(event) {
  event.preventDefault();
}

export { triggerEvent, preventDefaultEvent };
