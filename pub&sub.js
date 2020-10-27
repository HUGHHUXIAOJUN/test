// 发布、订阅模式

var pubsub = {};

(function (myObject){
    var topics = {};

    var subUid = -1;

    // 发布指定订阅
    myObject.publish = function (topic, args) {
        if (!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic];
        var len = subscribers ? subscribers.length : 0;
        while(len--) {
            subscribers[len].func(topic, args);
        }
        return this;
    }

    // 向订阅中心添加订阅
    myObject.subscribe = function (topic, func) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        })
        return token;
    }

    // 向订阅中移除订阅
    myObject.unSubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return this;
    };
})(pubsub);

pubsub.subscribe("test", ()=>{console.log("hello world")});
pubsub.publish("test");