require(['../require-config'], function() {
    require(["zepto"], function($) {
        $(function() {
            //点击加载更多
            $('.js_more').on('click', function() {
                //发送加载请求——
                //请求成功后执行
                var new_list='<li><span class="fr">提现<i>￥400.0</i>成功</span>2017-09-09  17:30</li><li><span class="fr">提现<i>￥400.0</i>成功</span>2017-09-09  17:30</li><li><span class="fr">提现<i>￥400.0</i>成功</span>2017-09-09  17:30</li>';
                $('.js_crash_get_list ul').append(new_list);
            });
        });
    });
});
