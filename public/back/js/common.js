$(function() {
  // 开启进度条
  // NProgress.start();
  // 结束进度条
  // NProgress.done();

  // ajax全局事件
  // 需求： 1.在第一个ajax发送时 开启进度条
  //    2.在全部的ajax请求完成时关闭进度条

  $(document).ajaxStart(function() {
    // 开启进度条
    NProgress.start();
  });

  $(document).ajaxStop(function() {
    // 开启进度条
    NProgress.done();
  });

  // 公共的功能
  // 1. 左侧二级切换功能

  $("#category").click(function() {
    // 找下一个兄弟元素
    $(this)
      .next()
      .stop()
      .slideToggle();
  });

  // 2.左侧侧边菜单切换
  $(".lt_topbar .icon_left").click(function() {
    // 让侧边菜单栏切换  添加一个公共类  让右侧显示区宽度变大
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
  });

  // 3.公共退出功能
  $(".lt_topbar .icon_right").click(function() {
    // 显示退出模态框
    $("#logoutModal").modal("show");
  });

  $("#logoutBtn").click(function() {
    //调用接口  让后台销毁当前用户的登陆状态
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function(info) {
        if (info.success) {
          //  销毁登陆状态成功，退出成功  跳转登陆页面
          location.href = "login.html";
        }
      }
    });
  });
});
