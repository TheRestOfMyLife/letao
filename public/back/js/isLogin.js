// 登陆拦截
$(function() {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function(info) {
      console.log(info);
      if (info.success) {
        console.log("该用户一登录");
      }
      if (info.error === 400) {
        location.href = "login.html";
      }
    }
  });
});
