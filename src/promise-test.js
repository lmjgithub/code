console.log("script start");

async function async1() {
  await async2();
  console.log("async1 end");
  // new Promise(resolv => resolv()).then(_ => console.log("end11"));
}
async function async2() {
  console.log("async2 end");
   new Promise(resolve => {
    resolve();
  })
    .then(e => console.log("async2 end2"))
    .then(e => console.log("end3"));
  // .then(e => console.log("end4"));
}
async1();

setTimeout(function() {
  console.log("setTimeout");
}, 0);

new Promise(resolve => {
  console.log("Promise");
  resolve();
})
  .then(() => console.log("promise1"))
  .then(() => console.log("promise2"))
  .then(() => console.log("promise3"))
  .then(() => console.log("promise4"))
  .then(() => console.log("promise5"));

console.log("script end");
// 此时执行完awit并不先把await后面的代码注册到微任务队列中去，而是执行完await之后，直接跳出async1函数，执行其他代码。然后遇到promise的时候，把promise.then注册为微任务。其他代码执行完毕后，需要回到async1函数去执行剩下的代码，然后把await后面的代码注册到微任务队列当中，注意此时微任务队列中是有之前注册的微任务的。所以这种情况会先执行async1函数之外的微任务(promise1,promise2)，然后才执行async1内注册的微任务(async1 end). 可以理解为，这种情况下，await 后面的代码会在本轮循环的最后被执行. 浏览
