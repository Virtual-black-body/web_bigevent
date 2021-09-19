$(function () {
    $('#link_reg').on('click', function (){
        $('.login-box').hide()
        $('.register-box').show()

    })
    $('#link_login').on('click', function (){
        $('.login-box').show()
        $('.register-box').hide()

    })
})