//1 
// function twoSum(nums, target) {
//     let result=[]
//     for(let i=0; i<nums.length;i++){
//         for(let j=i+1; j<nums.length;j++){
//             if(nums[i]+nums[j]===target){
//                 result=[i,j]
//             }
//         }
//     }
//     return result
// }
const twoSum = (nums, target) => {
    const prevNums = {};                    // 存储出现过的数字，和对应的索引               
  
    for (let i = 0; i < nums.length; i++) {       // 遍历元素   
      const curNum = nums[i];                     // 当前元素   
      const targetNum = target - curNum;          // 满足要求的目标元素   
      const targetNumIndex = prevNums[targetNum]; // 在prevNums中获取目标元素的索引
      if (targetNumIndex !== undefined) {         // 如果存在，直接返回 [目标元素的索引,当前索引]
        return [targetNumIndex, i];
      } else {                                    // 如果不存在，说明之前没出现过目标元素
        prevNums[curNum] = i;                     // 存入当前的元素和对应的索引
      }
    }
}
//console.log(twoSum([2,7,11,15],9))
//console.log(twoSum([3,2,4],6))
//console.log(twoSum([1,3,2,3,3],6))
// function throttle(fn,delay){
//     let timer=null,sTime=Date.now();
//     return function(...args){
//         let cTime = Date.now();
//         let remaining = delay - (cTime - sTime);
//         clearTimeout(timer)
//         console.log(remaining)
//         if(remaining<=0){
//             fn.apply(this,args)
//             cTime = Date.now();
//         }else{
//             timer = setTimeout(()=>{
//                 fn.apply(this,args)
//             },remaining)
//         }
//     }
// }
// let start = throttle((n)=>{console.log(n)},1000)
// setTimeout(()=>{
//     start(2)
// },1000)
//2
