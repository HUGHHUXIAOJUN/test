//(?=)会作为匹配校验，但不会出现在匹配结果字符串里面

//(?:)会作为匹配校验，并出现在匹配结果字符里面，它跟(...)不同的地方在于，不作为子匹配返回
var data = 'windows 98 is ok';
data.match(/windows (?=\d+)/);  // ["windows "]
data.match(/windows (?:\d+)/);  // ["windows 98"]
data.match(/windows (\d+)/);    // ["windows 98", "98"]