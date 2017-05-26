require(['../require-config'], function() {
    require(["zepto"], function($) {
        $(function() {
            $(document).ready(function() {
                //点击切换
                $('.js_qiehuan_menu').on('click', 'li', function() {
                    var li_index = $(this).index();
                    $(this).addClass('tab').siblings('li').removeClass('tab');
                    $('.js_qiehuan_name').eq(li_index).show().siblings('.js_qiehuan_name').hide();
                });
            });
        })
    })
})
