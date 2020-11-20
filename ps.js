const listeners = new WeakMap();

function addListener(obj, listener) {
    console.log(listeners.get(obj),listeners.set(obj, new Set()))
    (listeners.get(obj)||listeners.set(obj, new Set())).add(listener)
}
function triggerListeners(obj) {
    const listeners = listeners.get(obj);
    if (listeners) {
        for (const listener of listeners) {
            listener();
        }
    }
}
function delListener(obj,listener) {
    listener?listeners.get(obj).delete(listener):listeners.delete(obj)
}
let a={};
addListener(a,getKey)
function getKey(key){
    console.log(key)
}
triggerListeners(a)
