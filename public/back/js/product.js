$(function() {
  // 声明一个空数组  专门用于存储上传的图片
  var picArr = [];
  // 一进入发送ajax请求
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);

        // 分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          // 注册点击事件
          onPageClacked: function(a, s, d, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  // 2.点击添加商品按钮  显示模态框

  $("#addBtn").click(function() {
    $("#addModal").modal("show");
    // 发送ajax  请求所有的二级分类数据进行渲染

    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
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

  // 3.将获取到的二级分类数据 渲染给下拉框  添加点击事件

  $(".dropdown-menu").on("click", "a", function() {
    // 获取文本
    var txt = $(this).text();
    //设置给按钮
    $("#dropdownText").text(txt);
    // 获取id
    var id = $(this).data("id");
    // id设置给隐藏域
    $('[name="brandId"]').val(id);

    // 将隐藏域的校验状态改成VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  // 4. 配置fileupload, 实现文件上传
  $("#fileupload").fileupload({
    dataType: "json",
    done: function(e, data) {
      // 存储的是图片的信息
      var picObj = data.result;
      // 添加到数组中
      picArr.unshift(picObj);
      // 获取图片地址，将图片添加到结构的最前面
      var picUrl = picObj.picAddr;
      $("#imgBox").prepend('<img src="' + picUrl + '" style="width: 100px;" >');

      // 如果长度大于3  说明超出范围  需要将图片删除

      if (picArr.length > 3) {
        // 删除数组的最后一项

        picArr.pop();
        // 删除最后一张图片
        $("#imgBox img:last-of-type").remove();
      }
      console.log(picArr);
      if(picArr.length === 3){
        // 说明图片已经上传慢3张需要将 picStatus 校验状态改成 VALID
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });

  // 5.配置表单校验
  $('#form').bootstrapValidator({
    excluded: [],

    
    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:'请选择二级分类'
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:'请输入商品名称'
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:'请输入商品描述'
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:'q请输入商品库存'
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:'商品库存必须是非零开头的数字'
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:'请输入尺码'
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:'必须是xx-xx的格式, xx是两位数字, 例如: 36-44'
          }
        }
      },
      oldprice:{
        validators:{
          notEmpty:{
            message:'请输入商品原价'
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:'请输入商品现价'
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:'请上传3张图片'
          }
        }
      }
    }
  })

  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax提交

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    var paramsStr = $('#form').serialize(); // 所有表单内容数据
    // 还需要拼接上图片地址和名称
    // paramsStr += "&key1=value1&key2=value2"
    paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;


    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:paramsStr,
      dataType:'json',
      success:function(info){
        console.log(info);

        if(info.success){
          // 添加成功关闭模态框
          $('#addModal').modal('hide');
          // 页面渲染第一页
          currentPage = 1;
          render();


          // 重置所有的表单内容和状态 
          $('#form').data('bootstrapValidator').resetForm(true);

          // 下拉菜单的重置

          $('#dropdownText').text('请选择二级分类');

          // 图片重置  并且清空数组

          $('#imgBox img').remove();
          picArr = [];
        }
        
      }
    })
  })
});
