$(function() {
  var currentPage = 1;
  var pageSize = 5;
  render();
  // 一进入页面发送ajax请求  渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        var htmlStr = template("secondTpl", info);
        $("tbody").html(htmlStr);

        // 设置分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号，
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          // 给每个页码添加点击事件

          onPageClicked: function(a, s, d, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  // 2.点击添加分类按钮 显示模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");

    // 发送ajax请求  请求所有的一级分类列表进行渲染

    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);

        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  // 3.给下拉菜单添加选中功能（事件委托）
  $(".dropdown-menu").on("click", "a", function() {
    // 获取a文本
    var txt = $(this).text();
    // 设置给按钮
    $("#dropdownText").text(txt);
    // 获取a中自定义属性存储的id
    var id = $(this).data("id");
    // 赋值给隐藏域  用于提交
    $('[name="categoryId"]').val(id);
    // 手动将隐藏域的校验状态, 改成成功
    $('#form').data('bootstrapValidator').updateStatus( "categoryId", "VALID" );
  });

  // 调用fileUpload方法  发送文件上传请求

  $("#fileupload").fileupload({
    dataType: "json", //需要返回的数据类型
    done: function(e, data) {
      console.log(data);
      var result = data.result; // 后台返回的结果
      // 获取图片地址，赋值给img的src
      var picUrl = result.picAddr;
      $("#imgBox img").attr("src", picUrl);
      // 将图片地址赋值给你隐藏域
      $('[name="brandLogo"]').val(picUrl);
      // 重置隐藏域的校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo',"VALID");
    }
  });

  // 5.添加表单元素
  $("#form").bootstrapValidator({
    // 配置排除项
    excluded: [],
    // 配置小图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok", // 校验成功
      invalid: "glyphicon glyphicon-remove", // 校验失败
      validating: "glyphicon glyphicon-refresh" // 校验中
    },
    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });


  // 6.注册表单校验成功事件  阻止默认的提交，通过ajax提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          // 添加成功
          $('#addModal').modal('hide');
          currentPage = 1;
          render();


          // 重置表单及内容
          $('#form').data('bootstrapValidator').resetForm(true);
          // 由于下拉框及图表不是表单元素 无法一起情况  需要手动重置
          $('#dropdownText').text('请选择一级分类');
          $('#imgBox img').attr('src','./images/none.png');
        }
        
      }
    })
  })
});
