'use strict';

require(['../require-config'], function () {
    require(["zepto"], function ($) {
        $(function () {
            $('.js_blur_sub').on('blur', function () {
                //搜索提交todo
            });
        });
    });
});