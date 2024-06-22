// function getMaxValue(n,j,w,v){
//     let dp = new Array(n+1).fill().map(() => new Array(j+1).fill(0))
//     for(let i=1; i<=n; i++){
//         for(let m=1; m<=j; m++){
//             if(m<w[i]){
//                 //不能放入背包
//                 dp[i][m] = dp[i-1][m]
//             }else{
//                 dp[i][m] = Math.max(dp[i-1][m],dp[i-1][m-w[i]]+v[i])
//             }
//         }
//     }
//     return dp
// }
// function getMaxValue(n,j,w,v){
//     let dp = new Array(j+1).fill(0)
//     for(let i=1; i<=n; i++){
//         for(let m=j; m>=1; m--){
//             // 当二维数组存在的时候正反遍历都可以，但一维的时候需要用到之前的值，不能让之前的值变更最新的，需要反向遍历
//             if(m>=w[i]){
//                 // 这边只有放的下的时候才会覆盖上一个值，不然保持不变，放不下就不用写入了
//                 dp[m] = Math.max(dp[m],dp[m-w[i]] + v[i])
//             }
//         }
//     }
//     return dp
// }
// function getMaxValue(n,j,w,v){
//     let dp = new Array(n+1).fill().map(() => new Array(j+1).fill(0))
//     for(let i=1; i<=n; i++){
//         for(let m=1; m<=j; m++){
//             for(let k=0;k<=m/w[i];k++){
//                 dp[i][m] = Math.max(dp[i-1][m],dp[i][m-k*w[i]]+k*v[i])
//             }
//         }
//     }
//     return dp
// }
function getMaxValue(n,j,w,v){
    let dp = new Array(j+1).fill(0)
    for(let i=1; i<=n; i++){
        for(let m=w[i]; m<=j; m++){
            dp[m] = Math.max(dp[m],dp[m-w[i]] + v[i])
        }
    }
    return dp
}
let w = [0,2,3,4,7];
let v = [0,1,3,5,9];
let val = getMaxValue(4,10,w,v)
console.log(val)