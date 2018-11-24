
// 
$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数

  render();
  // 发送ajax请求
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("firstTpl", info);
        $("tbody").html(htmlStr);

        // 当数据回来后 进行分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          // 绑定页码点击事件
          onPageClicked: function(a, b, c, page) {
            currentPage = page;

            // 重新渲染v
            render();
          }
        });
      }
    });
  }

  // 2.点击按钮显示模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
  });

  // 3表单校验功能
  $("#form").bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok", // 校验成功
      invalid: "glyphicon glyphicon-remove", // 校验失败
      validating: "glyphicon glyphicon-refresh" // 校验中
    },
    // 设置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 设置非空
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });

  // 4.注册表单校验成功事件  阻止默认表单的提交
  $("#form").on("success.form.bv", function(e) {
    // 阻止默认提交
    e.preventDefault();
    // 通过ajax提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      dataType: "json",
      success: function(info) {
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          render();

          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
        }
      }
    });
  });
});
