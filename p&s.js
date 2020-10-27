const listeners = new WeakMap();

function addListener(obj, listener) {
    if (!listeners.has(obj)) {
        listeners.set(obj, new Set());
    }
    listeners.get(obj).add(listener);
}

function triggerListeners(obj) {
    const listeners = listeners.get(obj);
    if (listeners) {
        for (const listener of listeners) {
            listener();
        }
    }
}