var lengthOfLIS = function(nums) {
    var ans = []; 
    for (var i = 0; i < nums.length; i++) {
        var left = 0, right = ans.length;
        while (left < right) { //二分法
            var mid = left + right >>> 1;
            if (ans[mid] < nums[i]) left = mid + 1;
            else right = mid;
        } 
        if (right >= ans.length) ans.push(nums[i]); //如果找不到 在ans最后增加一项nums[i]
        else ans[right] = nums[i];
        console.log(ans)
    }
    return ans;
};
// var lengthOfLIS = function(nums) {
//     var dp = new Array(nums.length).fill(1);
//     var ans = 0;
//     for (var i=0; i<nums.length;i++){ //对于第i个元素nums[i]
//         for (var j=0; j<i;j++){ //遍历i前面的i-1个元素
//             if (nums[j]<nums[i]) dp[i] = Math.max(dp[i],dp[j]+1)
//             //如果nums[j]比nums[i]小 更新dp[i]
//         }
//         console.log(ans,dp)
//         ans = Math.max(ans,dp[i]);
//     }
//     return ans
// };
function promiseFn(fn){
    return function(method){
        return function(options){
            return new Promise((resolve,reject)=>{
                fn[method]({
                    ...options,
                    success: res=>resolve(res),
                    error: error=>reject(error)
                })
            })
        }
    }
}
console.log(lengthOfLIS([10,9,2,5,7,3,5,101,18]))
function curry(fn){
    let args = []
    return function func(...arg2){
        if(arg2.length===0){
            fn.apply(this,args)
        }
        args.concat(arg2)
        return func
    }
}