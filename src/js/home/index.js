require(['../require-config'], function() {
    require(["zepto"], function($) {
        $(function() {
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
            $(document).ready(function() {
                // 倒计时执行
                GetRTime();
                //名单滚动
                var speed = 50
                ul2.innerHTML = ul1.innerHTML
                var end_top=ul1.offsetHeight*2-ul.offsetHeight;

                function Marquee_ul() {
                    // if (ul2.offsetTop - ul.scrollTop <= 0)
                    //     ul.scrollTop -= ul1.offsetHeight
                    // else {
                    //     ul.scrollTop++
                    // }
                    if (ul.scrollTop > end_top)
                        ul.scrollTop -= ul1.offsetHeight
                    else {
                        ul.scrollTop++
                    }
                    // console.log('ul2.offsetTop_'+ul2.offsetTop);
                    // console.log('ul.scrollTop_'+ul.scrollTop);
                    //console.log(ul.scrollTop);
                }
                var MyMar_ul = setInterval(Marquee_ul, speed)
                    // ul.onmouseover = function() {
                    //     clearInterval(MyMar_ul)
                    // }
                    // ul.onmouseout = function() {
                    //     MyMar_ul = setInterval(Marquee_ul, speed)
                    // }
                ul_share2.innerHTML = ul_share1.innerHTML
                var end_share_top=ul_share1.offsetHeight*2-ul_share.offsetHeight;

                function Marquee_share_ul() {
                    // if (ul_share2.offsetTop - ul_share.scrollTop <= 0)
                    //     ul_share.scrollTop -= ul1.offsetHeight
                    // else {
                    //     ul_share.scrollTop++
                    // }
                    if (ul_share.scrollTop > end_share_top)
                        ul_share.scrollTop -= ul_share1.offsetHeight
                    else {
                        ul_share.scrollTop++
                    }
                }
                var MyMar_share_ul = setInterval(Marquee_share_ul, speed);


                //点击开抢按钮
                $('.js_qiang_button').on('click', function() {
                    $('.zheceng').show();
                    //出现可以抢的
                    $('.js_chai').show();
                    //出现不可以抢的
                    //$('.js_chai_no').show();
                });
                //点击拆--动画
                $('.js_chai_button').on('click', function() {
                    $(this).addClass('dong');
                });
                //关闭弹框和这层--并移除动画效果
                $('.js_close').on('click', function() {
                    $('.zheceng').hide();
                    $('.js_chai').hide();
                    $('.js_chai_no').hide();
                    $('.js_chai_button').removeClass('dong');
                })
            });
        })
    })
})
