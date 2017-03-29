"use strict";

require(['../require-config'], function () {
    require(["zepto"], function ($) {
        $(function () {
            //倒计时
            var start_time = "2017-03-18 14:10:30".replace(/-/g, '/'); //活动开始时间,更改样式，保证ie及相关浏览器兼容时间格式
            var date = new Date(start_time);
            var timer_rt = null;
            function GetRTime() {
                var t = date - new Date();
                var nD = parseInt(t / (1000 * 60 * 60 * 24));
                var nH = parseInt(t / (1000 * 60 * 60)) % 24;
                var nM = parseInt(t / (1000 * 60)) % 60;
                var nS = parseInt(t / 1000) % 60;
                $("#hour").text(nD * 24 + nH);
                $("#minite").text(nM);
                $("#seconds").text(nS);
                if (t <= 0) {
                    $("#hour").text('0');
                    $("#minite").text('0');
                    $("#seconds").text('0');
                    clearTimeout(timer_rt);
                    return false;
                } else {
                    timer_rt = window.setTimeout(GetRTime, 1000);
                }
            }
            $(document).ready(function () {
                // 倒计时执行
                GetRTime();
                //到底部
                $('.js_down').on('click', function () {});
                //名单滚动
                var speed = 50;
                ul2.innerHTML = ul1.innerHTML;

                function Marquee_ul() {
                    if (ul2.offsetTop - ul.scrollTop <= 0) ul.scrollTop -= ul1.offsetHeight;else {
                        ul.scrollTop++;
                    }
                }
                var MyMar_ul = setInterval(Marquee_ul, speed);
                ul.onmouseover = function () {
                    clearInterval(MyMar_ul);
                };
                ul.onmouseout = function () {
                    MyMar_ul = setInterval(Marquee_ul, speed);
                };
            });
        });
    });
});