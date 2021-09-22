$(function() {

    var layer = layui.layer
    var form = layui.form

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
// 美化
    template.defaults.imports.dataFormat = function(data) {

        const dt = new Data(data)

        var y =padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0'+n
    }

    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,    
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
            }
        })
    }

    function initCate() {


        $.ajax({
            method: 'GET',
            url: '/my/article/cates', 
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlstr = template('tpl-cate', res)
                $('#cate_id').html(htmlstr)
                form.render()
            }
        })
    }
})
