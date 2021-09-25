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

                renderPage(res.total)
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

    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.state = state
        q.cate_id = cate_id
        initTable()
    })
    // 渲染分页控件
    function renderPage(total) {
        layui.laypage.render(
            {
                elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
                count: total,
                layout: ['count','limit', 'prev', 'page', 'next','skip'],
                limits: [2, 3, 5, 10, 20],
                limit: q.pagesize,
                curr: q.pagenum,
                jump: function(obj, first){
                    q.pagenum = obj.curr
                    if(!first){
                        initTable()
                     }
                }
            }
        )
    }

    $('tbody').on('click', '#btn-delete', function (res){
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if( len === 1 ) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    
                    initTable()
                }
            })
            layer.close(index);
          });
    })

    $('tbody').on('click', '#btn-edit', function() {
        var id = $(this).attr('data-id')
        var data = null
        $.ajax({
            method: 'GET',
            url: '/my/article/'+ id ,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章详情失败！')
                }
                data = res.data
                
            }
        })
        indexAdd = layer.open({
            type: 2,
            area: ['840px', '600px'],
            title: '修改文章类别'
            ,content: '/article/art_edit.html',
            success: function(layero,index){
                var sbody = $($(layero).find('iframe')[0].contentDocument.body)
                sbody.find('[name = Id]').val(data.Id)
                sbody.find('[name = title]').val(data.title)
                sbody.find('[name = index]').val(index)
              }
          })
        
    })
})
