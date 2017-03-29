//倒计时
var start_time = "2017-03-15 12:10:30".replace(/-/g, '/'); //活动开始时间,更改样式，保证ie及相关浏览器兼容时间格式
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
    // 6天倒计时执行
    GetRTime();
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
        //$(this).addClass('dong');
        $(this).hide();
        $('.js_img_button').addClass('dong');
        //执行抽红包ajax——todo
        //执行成功后 去除动画——$('.js_chai_button').removeClass('dong'); $('.js_chai_button').show();$('.js_img_button').removeClass('dong').hide();
    });
    //关闭弹框和这层--并移除动画效果
    $('.js_close').on('click', function() {
        $('.zheceng').hide();
        $('.js_chai').hide();
        $('.js_chai_no').hide();
        // $('.js_chai_button').removeClass('dong');
        $('.js_chai_button').show();
        $('.js_img_button').removeClass('dong');
    })
});
