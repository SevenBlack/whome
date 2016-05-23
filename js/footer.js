var shopid = $("#gloabshopid1").val();
var rooturl = $("#gloabrooturl1").val();
var currentTime = 0;
var vilidCode = null;
var indexUrl="";

var bid = WXUtil.get_Storage("buyerid");
if(!bid){
    bid = 0;
    WXUtil.set_Storage("buyerid", 0);
}

var user_login_m = "user_login_mobile_s_" + shopid ;
var user_login_p = "user_login_password_s" + shopid;

$("#footer_buyerid").val(WXUtil.get_Storage("buyerid"));
if(typeof(PAGE_FLAG) == "undefined"){
}else{
    //缓存验证前的  访问链接
    var redirect_shop_uri = window.location.href;
    $("#bottomNav").find("a").siblings().removeClass("cur");
    if(PAGE_FLAG=="home"){
        $('#home').addClass("cur");
    }else if(PAGE_FLAG=="classification"){
        $('#classification').addClass("cur");
    }else if(PAGE_FLAG=="dynamic"){
        $('#dynamic').addClass("cur");
    }else if(PAGE_FLAG=="shoppingCart"){
        $('#shoppingCart').addClass("cur");
        if(bid == 0){
            validate();
        }
    }else if(PAGE_FLAG=="userCenter"){
        $('#userCenter').addClass("cur");
        if(bid == 0){
            validate();
        }
    }
}

$(document).ready(function(){

    $("#li_vercode").hide();
    $("#li_set_password").hide();
    $("#li_set_nickname").hide();
    //关闭弹出提示层
    $('#close_show_Tip').click(function(){
        show_mecom_Tip('');
    });
    setFlowCount();

    initPlaceholder();  // 初始化input placeholder，当input获取焦点时清空placeholder
});

//去购物按钮
function goShoping(url){
    //gofooterIndex('${root}/whome/index');
    gofooterIndex(url);
}

//进入订单
function goOrder() {
    window.location = rooturl+'/wxnewtorders/goOrdersCenter/'+shopid;
}
//进入购物车
function goLinecar() {
    window.location.href = rooturl+'/wxtlinecar/golinecar/'+shopid;
}

//页面跳转
function gofooterIndex(url){
    var $form = $("#directform");
    $form.attr("action",url);
    var f_buyerid = $.trim($("#footer_buyerid").val());
    if (!f_buyerid || f_buyerid == 0){
        $("#footer_buyerid").val(bid);
    }
    $form.submit();
}

//提示弹出层
function show_mecom_Tip(type,show_text,time){
    var contentHeight = $(document).height();
    $('#show_mecom_Tip').css('height',contentHeight).show();
    if(type == 'get'){
        $("#show_Tip_text").html(show_text);
        if(time){
            var t=setTimeout("$('#show_mecom_Tip,#show_mecom_Tip_Tex').hide();",2000);
        }
        $('#show_mecom_Tip_Tex').show();
    }else{
        $('#show_mecom_Tip,#show_mecom_Tip_Tex').hide();
    }
}

function showValidateTip(type){
    var contentHeight = $(document).height();
    $('#validate_div').css('height',contentHeight).show();
    if(type == 'get'){
        $('#validate_box_div').show();
    }else{
        $('#validate_div,#validate_box_div').hide();
    }
}

function validate(){
    bid = WXUtil.get_Storage("buyerid");
    var isWxBrowser = WXUtil.isWeixin();
    if(!isWxBrowser && bid == 0){
        var c_m_val = getMCookie(user_login_m);
        var c_p_val = getMCookie(user_login_p);
        if (checkMParam(c_m_val) && checkMParam(c_p_val)){
            $.post(rooturl+"/wxutil/buyerLoginByCookie",{shopid:shopid,mobile:c_m_val, password:c_p_val},function(data){
                if(data && data.flag == 0){//验证成功
                    bid = data.buyerid;
                    $("#footer_buyerid").val(bid);
                    WXUtil.set_Storage("buyerid", bid);
                    if (typeof checkCallback == "function"){
                        checkCallback();
                    }
                }else {
                    showValidateTip('get');
                    return false;
                }
            },'json');
        }else{
            showValidateTip('get');
        }
        return false;
    }else{
        //直接跳转
        if(bid == 0){
            return false;
        }
    }
    return true;
}

var wait2=60 * 5;
function time2() {
    if (wait2 == 0) {
        $("#getCheckCode").attr("disabled", false);
        $("#getCheckCode").val("获取验证码");
        wait2 = 60 * 5;
    } else {
        $("#getCheckCode").attr("disabled", true);
        wait2--;
        $("#getCheckCode").val(wait2 + " 秒后重新获取");
        setTimeout(function() {
            time2();
        },1000);
    }
}

var wait=60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        wait = 60;
    } else {
        o.setAttribute("disabled", true);
        wait--;
        setTimeout(function() {
            time(o);
        },1000);
    }
}

$(".getCheckCode").click(function(){
    var mobile = $("#login_mobile").val();
    mobile = $.trim(mobile);
    var logintype = $("#login_type").val();
    if(mobile){
        var regex = /(^((\+86)|(86))?(1)\d{10}$)/;
        if(!regex.test(mobile)){
            $("#tip1").html("请输入正确的手机号码");
            return false;
        }else{
            $("#tip1").html("");
        }
    }else{
        $("#tip1").html("请输入手机号码");
        return false;
    }

    $.get(rooturl+"/wxutil/sendVercode",{shopid:shopid,mobile: mobile,logintype:logintype},function(data){
        if(!data){
            return false;
        }
        if(data.flag == 0){
            vilidCode = data.vilidCode;
            currentTime = data.currentTime;
            $("#tip").show();
            time2();
            setTimeout(function() {
                $("#tip").hide();
            },1000);
        }else if(data.flag == 1){
            $("#tip1").html(data.msg);
            return false;
        }
    },"json");
});

$('#getVipReg').click(function(){
    $("#login_type").val(2);
    var logintype = $("#login_type").val();
    var mobile = $("#login_mobile").val();
    mobile = $.trim(mobile);

    if(! submitVali(logintype,mobile)){
        return false;
    }

    var vercode = $("#vercode").val();
    vercode = $.trim(vercode);
    if(vercode.length > 0){
        var regex = /^\d{6}$/;
        if(!regex.test(vercode)){
            $("#tip3").html("验证码为6位数字，请重新输入");
            return false;
        }else{
            $("#tip3").html("");
        }
    }else{
        $("#tip3").html("请输入手机收到的6位数字验证码");
        return false;
    }

    var password = $("#login_set_password").val();
    password = $.trim(password);
    if(password){
        if(password.length < 4){
            $("#tip4").html("密码至少4位");
            return false;
        }else{
            $("#tip4").html("");
        }
    }else{
        $("#tip4").html("请输入密码");
        return false;
    }

    var nick = $("#login_set_nick").val();
    nick = $.trim(nick);
    if(!nick){
        $("#tip5").html("请输入昵称");
        return false;
    }
    //验证手机号与验证码
    $.post(rooturl+"/wxutil/regBuyer",{shopid:shopid,mobile:mobile,oldvercode:vilidCode,vercode:$("#vercode").val(),currentTime:currentTime,
        password:password,nick:nick},function(data){
        if(!data){
            return false;
        }
        if(data.flag == 0){//验证成功
            bid = data.buyerid;
            $("#footer_buyerid").val(bid);
            WXUtil.set_Storage("buyerid", bid);

            setBuyerCookie(data.mobile,data.md5);

            if(data.isAttention == 0){//没有关注微信号,提示关注
                showValidateTip('');

                show_mecom_Tip('get',"您还没有关注微信号：<b>"+data.generalname+"</b>!请关注微信号<b>"+data.generalname+"</b>以便获取更多优惠及服务!");

                $('#close_show_Tip').click(function(){
                    show_mecom_Tip('');
                    //页面跳转
                    gofooterIndex(indexUrl);
                });
            }else{
                gofooterIndex(indexUrl);
            }
        }else if(data.flag == 1){
            $("#tip1").html(data.msg);
            return false;
        }else if(data.flag == 2){
            $("#tip3").html(data.msg);
            return false;
        }
    },'json');
});
function backLogin(){
    $("#login_type").val(1);
    var logintype = $("#login_type").val();
    var mobile = $("#login_mobile").val();
    mobile = $.trim(mobile);

    if(! submitVali(logintype,mobile)){
        return false;
    }
}
function resetPwdClick(){
    $("#login_type").val(3);
    var logintype = $("#login_type").val();
    var mobile = $("#login_mobile").val();
    mobile = $.trim(mobile);

    if(! submitVali(logintype,mobile)){
        return false;
    }

    var vercode = $("#vercode").val();
    vercode = $.trim(vercode);
    if(vercode.length > 0){
        var regex = /^\d{6}$/;
        if(!regex.test(vercode)){
            $("#tip3").html("验证码为6位数字，请重新输入");
            return false;
        }else{
            $("#tip3").html("");
        }
    }else{
        $("#tip3").html("请输入手机收到的6位数字验证码");
        return false;
    }

    var password = $("#login_set_password").val();
    password = $.trim(password);
    if(password){
        if(password.length < 4){
            $("#tip4").html("密码至少4位");
            return false;
        }else{
            $("#tip4").html("");
        }
    }else{
        $("#tip4").html("请输入新密码");
        return false;
    }

    var nick = $("#login_set_nick").val();
    nick = $.trim(nick);

    $.get(rooturl+"/wxutil/resetPwd",{shopid:shopid,mobile:mobile,oldvercode:vilidCode,vercode:$("#vercode").val(),currentTime:currentTime,
        password:password,nick:nick},function(data){
        if(!data){
            return false;
        }
        if(data.flag == 0){//验证成功
            bid = data.buyerid;
            $("#footer_buyerid").val(bid);
            WXUtil.set_Storage("buyerid", bid);
            var expires = 30 * 24 * 60 * 60 * 1000;
            setMCookie(user_login_m,data.mobile,expires);
            setMCookie(user_login_p,data.md5,expires);
            showValidateTip('');
            show_mecom_Tip('get',"已成功修改用户信息!");
            $('#close_show_Tip').click(function(){
                show_mecom_Tip('');
                //页面跳转
                gofooterIndex(indexUrl);
            });
        }else if(data.flag == 1){
            $("#tip1").html(data.msg);
            return false;
        }else if(data.flag == 2){
            $("#tip3").html(data.msg);
            return false;
        }
    },'json');
}

$('#getVipSure').click(function(){
    $("#login_type").val(1);
    var logintype = $("#login_type").val();
    var mobile = $("#login_mobile").val();
    mobile = $.trim(mobile);
    var password = $("#login_password").val();
    password = $.trim(password);

    if(! submitVali(logintype,mobile,password)){
        return false;
    }

    if(password){
        if(password.length < 4){
            $("#tip2").html("密码至少4位");
            return false;
        }else{
            $("#tip2").html("");
        }
    }else{
        $("#tip2").html("请输入密码");
        return false;
    }

    //验证手机号与验证码
    $.post(rooturl+"/wxutil/buyerLogin",{shopid:shopid,mobile:mobile,oldvercode:vilidCode,vercode:$("#vercode").val(),currentTime:currentTime,
        password:password},function(data){
        if(!data){
            return false;
        }
        if(data.flag == 0){//验证成功
            bid = data.buyerid;
            $("#footer_buyerid").val(bid);
            WXUtil.set_Storage("buyerid", bid);
            setBuyerCookie(data.mobile,data.md5);
            if(data.isAttention == 0){//没有关注微信号,提示关注
                showValidateTip('');

                show_mecom_Tip('get',"您还没有关注微信号：<b>"+data.generalname+"</b>!请关注微信号<b>"+data.generalname+"</b>以便获取更多优惠及服务!");

                $('#close_show_Tip').click(function(){
                    show_mecom_Tip('');
                    //页面跳转
                    gofooterIndex(indexUrl);
                });
            }else{
                gofooterIndex(indexUrl);
            }
        }else if(data.flag == 1){
            $("#tip1").html(data.msg);
            return false;
        }else if(data.flag == 2){
            $("#tip2").html(data.msg);
            return false;
        }
    },'json');
});
function submitVali(type,mobile,password){
    $("#login_title").html("");
    if(type == 1){
        $("#login_title").html("手机号登录");
        $("#regandlogin").show();
        $("#resetpwd").hide();
        $("#a_reset").show();
        $("#a_back").hide();
        $("#li_password").show();
        $("#li_vercode").hide();
        $("#li_set_password").hide();
        $("#li_set_nickname").hide();
    }
    if(type == 2){
        $("#login_title").html("手机号注册");
        $("#li_password").hide();
        $("#li_vercode").show();
        $("#li_set_password").show();
        $("#li_set_nickname").show();
    }
    if(type == 3){
        $("#login_title").html("重置密码");
        $("#a_reset").hide();
        $("#a_back").show();
        $("#regandlogin").hide();
        $("#resetpwd").show();
        $("#li_password").hide();
        $("#li_vercode").show();
        $("#li_set_password").show();
        $("#li_set_nickname").hide();
    }
    $("#tip1").html("");
    $("#tip2").html("");
    $("#tip3").html("");
    $("#tip4").html("");
    $("#tip5").html("");
    if(mobile){
        var regex = /(^((\+86)|(86))?(1)\d{10}$)/;
        if(!regex.test(mobile)){
            $("#tip1").html("请输入正确的手机号码");
            return false;
        }else{
            $("#tip1").html("");
        }
    }else{
        $("#tip1").html("请输入手机号码");
        return false;
    }
    return true;
}

function setBuyerCookie(m,p){
    var c_m_val = getMCookie(user_login_m);
    var c_p_val = getMCookie(user_login_p);
    if (!checkMParam(c_m_val) && !checkMParam(c_p_val)){
        var expires = 30 * 24 * 60 * 60 * 1000;
        setMCookie(user_login_m,m,expires);
        setMCookie(user_login_p,p,expires);
    }
}

function checkBuyerCookie(){
    var c_m_val = getMCookie(user_login_m);
    var c_p_val = getMCookie(user_login_p);
    return checkMParam(c_m_val) && checkMParam(c_p_val);
}

function showFinger(){
    //弹出层提示关注微信号
    var tip = '<div id="shareTip" style="width:100%;height:100%;position: fixed; float: left;background:#000;-webkit-opacity: 0.6;-moz-opacity: 0.6;opacity: 0.6; top:0;left:0; z-index: 99999;font-size:16px;text-align:center;">';
    tip +='<img src=\''+rooturl+'/skins/imageswap/shareTip.png\' style="float:left;width:100%;"/>';
    tip +='<p style="color:#FFF;font-size:18px;font-weight:600;line-height:24px;position:fixed;bottom:20px;left:0;width:100%;text-align:center;word-break:break-all;word-wrap:break-word;">';
    tip +='</p></div>';
    $(tip).appendTo($("body"));
    $('#tip').css('height',$(document).height());
    setTimeout(function(){$('#shareTip').remove();}, 3000);
}

//弹窗提示
function dialog(str){
    easyDialog({
        HTML:"<div id='blackDialog'>"+str+"</div>",
        timeout:1.5,
        bgOpacity:0,
        zIndex:9000000
    });
}
function dialogNoClose(str){
    easyDialog({
        HTML:"<div id='blackDialog'>"+str+"<span id='easyDialogCloseBtn'></span></div>",
        timeout:1.5,
        bgOpacity:0,
        timeout:0,
        clickClose:false,
        zIndex:9000000
    });
}
function setFlowCount(){
    var buyerid = bid;
    if (!buyerid || buyerid == '' || buyerid == null){
        buyerid = 0;
    }
    var url=rooturl+'/wxuser/setflowCount/'+shopid+'/'+buyerid;
    $.ajax({
       url:url,
        type:'post',
        dataType:'json',
        success:function(data){
        }
    });
}
// 初始化input placeholder，当input获取焦点时清空placeholder
function initPlaceholder() {
    $('input[placeholder]').each(function() {
        var $this = $(this);
        var placeholder = $this.attr('placeholder');
        $this.focus(function(){
            $this.attr('placeholder', '');
        });
        $this.blur(function() {
            if ($this.text() == '') {
                $this.attr('placeholder', placeholder);
            }
        });
    });
}