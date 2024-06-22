var twoSum = function(nums, target) {
    let obj =  new Map();
    for(let i = 0; i<nums.length; i++){
        let cur = nums[i]; let targetNum = target - cur;
        let targetIndex = obj.get(targetNum);
        if(targetIndex!==undefined){
            return [targetIndex,i]
        }else{
            obj.set(cur,i)
        }
    }
 };
 function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const curNum = nums[i];
      const targetNum = target - curNum;
      const targetNumIndex = map.get(targetNum);
  
      if (targetNumIndex !== undefined) {
        return [targetNumIndex, i];
      } else {
        map.set(curNum, i);
      }
    }
  }
console.log(twoSum([2,7,11,15],9))