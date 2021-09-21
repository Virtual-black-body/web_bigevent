$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '请输入小于6字符的用户昵称'
            }
        }
    })
    
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置
    $('.layui-btn').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('提交失败！')
                }
                layer.msg('提交成功！')
                window.parent.getUserInfo()
            }
        })
     })
})