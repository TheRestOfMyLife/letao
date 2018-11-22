$(function() {
  // 开启进度条
  // NProgress.start();
  // 结束进度条
  // NProgress.done();


  // ajax全局事件
  // 需求： 1.在第一个ajax发送时 开启进度条
      //    2.在全部的ajax请求完成时关闭进度条

  $(document).ajaxStart(function(){
    // 开启进度条
  NProgress.start();
  })

  $(document).ajaxStop(function(){
    // 开启进度条
  NProgress.done();
  })
});
