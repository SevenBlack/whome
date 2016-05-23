/*******************************
 * wxjs sdk 分享代码
 * Description:微信分享通用代码
 * 使用方法：WXShare({tit});
 *******************************/
function WXShare (option){
    //初始化参数
   var o = {
		   title:document.title, // 分享标题
		   desc:'', // 分享描述
		   link:document.location.href,// 分享链接
           imgUrl:'', // 分享图标
           type:'', // 分享类型,music、video或link，不填默认为link
           dataUrl:'', // 如果type是music或video，则要提供数据链接，默认为空
           success:function(){},//用户确认分享后执行的回调函数
           cancel:function(){} // 用户取消分享后执行的回调函数
   } ;

    if (option.link){
        //去掉code 和openId,如果code参数或者openId是?号后面的，为了保证参数正确，替换为c=c,oi=oi
        option.link = option.link.replace(/(^|&)code=([^&]*)/g, "").replace(/(^|&)openId=([^&]*)/g, "").replace(/(^|\?)code=([^&]*)/g, "?c=c").replace(/(^|\?)openId=([^&]*)/g, "?oi=oi");
    }

   $.extend(o,option);//传入参数

   this.setOption = function(args){
       if (args.link){
           //去掉code 和openId
    	   args.link = args.link.replace(/(^|&)code=([^&]*)/g, "").replace(/(^|&)openId=([^&]*)/g, "").replace(/(^|\?)code=([^&]*)/g, "?c=c").replace(/(^|\?)openId=([^&]*)/g, "?oi=oi");
       }
	   $.extend(o,args);//传入参数
       _wxshare();
   };

    function _wxshare(){
        wx.onMenuShareAppMessage({
            title: o.title, // 分享标题
            desc: o.desc, // 分享描述
            link: o.link, // 分享链接
            imgUrl: o.imgUrl, // 分享图标
            type: o.type, // 分享类型,music、video或link，不填默认为link
            dataUrl: o.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                o.success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                o.cancel();
            }
        });

        wx.onMenuShareTimeline({
            title: o.title ? (o.title + ' ' + o.desc) : o.desc, // 分享标题
            link: o.link, // 分享链接
            imgUrl: o.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                o.success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                o.cancel();
            }
        });

        wx.onMenuShareQQ({
            title: o.title, // 分享标题
            desc: o.desc, // 分享描述
            link: o.link, // 分享链接
            imgUrl: o.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                o.success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                o.cancel();
            }
        });

        wx.onMenuShareWeibo({
            title: o.title, // 分享标题
            desc: o.desc, // 分享描述
            link: o.link, // 分享链接
            imgUrl: o.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                o.success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                o.cancel();
            }
        });

        WXUtil.showOptionMenu();
    }

    wx.ready(_wxshare);

};


