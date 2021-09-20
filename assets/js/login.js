$(function () {
    $('#link_reg').on('click', function (){
        $('.login-box').hide()
        $('.register-box').show()

    })
    $('#link_login').on('click', function (){
        $('.login-box').show()
        $('.register-box').hide()

    })

    var form = layui.form
    form.verify({
        pwd: [
          /^[\S]{6,12}$/
          , '密码必须6到12位，且不能出现空格'
        ], 
        repwd: function (value) {
            var pwd = $('.register-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致';
            }
        }
      })
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        var data = {username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
        $.post('/api/reguser', data
          , function (res){
              if (res.status !== 0){
                layui.layer.msg(res.message)
              }else
              {
                layui.layer.msg('注册成功！')
              }
         })
    })

    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function (res){
                console.log(res);
                if (res.status !== 0){
                  return layui.layer.msg('登录失败！')
                }
                layui.layer.msg('登录成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })  
    })
})