$(function() {

      // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    var layer = layui.layer

    initEditor()
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if(res.status!== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                layui.form.render()
            }
        })
    }

    $('#btnChooseImg').on('click', function (){
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e){
        var file = e.target.files[0]
        if (file.length == 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    var art_state = '已发布'
    $('#btnSave2').on('click', function(){
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e){
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)

                publishArticle(fd)
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status!==0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布成功！')
                location.href = '/article/art_list.html'
            }
        })
        

    }

})