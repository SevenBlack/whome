var WXUtil = {
     
      root:"",
     
     setPrefix :function(root){
        this.root = root;
     },
    
     /**
       *获取url上面的参数值
       *name 参数名
       *return 参数值
      */  
      getUrlParam:function(name){
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
          var r = window.location.search.substr(1).match(reg);  //匹配目标参数
          if (r!=null) return unescape(r[2]); return null; //返回参数值
      },
      
      //隐藏网页右上角按钮
      hideOptionMenu:function(){

              if (typeof WeixinJSBridge == "undefined"){
                  if( document.addEventListener ){
                      document.addEventListener('WeixinJSBridgeReady', function(){WeixinJSBridge.call('hideOptionMenu');}, false);
                  }else if (document.attachEvent){
                      document.attachEvent('WeixinJSBridgeReady', function(){WeixinJSBridge.call('hideOptionMenu');});
                      document.attachEvent('onWeixinJSBridgeReady', function(){WeixinJSBridge.call('hideOptionMenu');});
                  }
              }else {
                  WeixinJSBridge.call('hideOptionMenu');
              }
      },
       //显示网页右上角按钮
      showOptionMenu:function(){

          if (typeof WeixinJSBridge == "undefined"){
              if( document.addEventListener ){
                  document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('showOptionMenu');}, false);
              }else if (document.attachEvent){
                  document.attachEvent('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('showOptionMenu');});
                  document.attachEvent('onWeixinJSBridgeReady', function(){ WeixinJSBridge.call('showOptionMenu');});
              }
          }else{
              WeixinJSBridge.call('showOptionMenu');
          }
      },
      
      //隐藏网页底部导航栏
      hideToolbar:function(){
         document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			   WeixinJSBridge.call('hideToolbar');
		  });
      },
      //显示网页底部导航栏
      showToolbar:function(){
         document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			   WeixinJSBridge.call('showToolbar');
		  });
      },
      //关闭当前显示页面
      closeWxWindow:function(){
    	  WeixinJSBridge.call('closeWindow');
      },
      
      //获取网络状态
      /**
        *network_type:wifi wifi网络
		*network_type:edge 非wifi,包含3G/2G
	    *network_type:fail 网络断开连接
	    *network_type:wwan（2g或者3g）
        *
       */
      getNetworkType:function(){
           WeixinJSBridge.invoke('getNetworkType',{},
              function(e){
                return e.err_msg;
	      });
      },
      

     
     /**
     *判断是否是微信浏览器
     * @author Bill
	 * @version 1.0
	 * @Since  2013-12-18
     */ 
    isWeixin:function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			return true;
	 	} else {
			return false;
		}
	},
	
	/**
     *判断是否是iPhone手机
     * @author Bill
	 * @version 1.0
	 * @Since  2013-12-18
     */ 
    isIphone:function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/iPhone/i)=="iphone") {
			return true;
	 	} else {
			return false;
		}
	},
	
	/**
     *判断是否是Android手机
     * @author Bill
	 * @version 1.0
	 * @Since  2013-12-18
     */ 
    isAndroid:function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/Android/i)=="android") {
			return true;
	 	} else {
			return false;
		}
	},
	/**
	 *判断浏览器是否支持本地存储
	 */
	 isStorage:function(){
	   if(window.localStorage)return true;
	   return false; 
	 },
	 
	 /**
	  *设置本地存储值
	  *
	  */
	  setStorage:function(key,value){
	    localStorage[key]=value;
	    return localStorage;
	  },
	  /**
	  * 设置本地存储值
	  */
	  getStorage:function(key){
	    return localStorage[key];
	  },
	  /**
	   *检测key对应的值是否和被检测值相同
	  */
	  testStorage:function(key,testValue){
	       var key_value = localStorage[key];
	       if(checkMParam(testValue) && key_value===testValue)return true;
	       return false;
	  },
	  
	  /**
	  *监测参数
	  */
	 checkMParam:function(value){
		if(value && value != null && value != undefined && value != "" && value != "null"  && value != "undefined" ){
			return true;
		}
	   return false;
	},

	  //判断微信版本号是否大于5.2
	 checkWxVersion:function() {
		var ua = navigator.userAgent;
		var index = ua.indexOf("MicroMessenger");
		if(index >-1){
				var substr = ua.substr(index);
				substr = substr.replace("MicroMessenger/");
				if(substr>"5.2"){
					return true;
				}
				return false;

		}else{
			return false;
		} 
	},

    /**
     * 网页授权，获取openid
     * @param appId
     * @param shopid
     * @param getOpenidUrl
     */
    getOpenId:function(appId,shopid,getOpenidUrl){
        if (WXUtil.checkMParam(appId)){
            //微信授权的固定url
            var redirect_uri = window.location.href.replace(/#.*/g, ""); //去掉链接里的#号
            var param = "/oauth2?appId="+appId+"&scope=snsapi_base&state=123&url="+encodeURIComponent(redirect_uri);
            var url = getOpenidUrl + param;
            window.location.href = url;

        }else{
            $.ajax({
                url: WXUtil.root +"/wxutil/getAppid",
                type:"POST",
                data:{shopid:shopid,ts:(new Date()).getTime()},
                dataType:"json",
                async:false,
                success:function(data){
                    var appid  = data.appid;
                    if(!appid){
                        return data;
                    }
                    WXUtil.set_Storage("appId",appid);
                    //微信授权的固定url
                    var redirect_uri = window.location.href.replace(/#.*/g, ""); //去掉链接里的#号
                    var param = "/oauth2?appId="+appid+"&scope=snsapi_base&state=123&url="+encodeURIComponent(redirect_uri);
                    var url = getOpenidUrl + param;
                    window.location.href = url;
                    return true;
                },
                error:function(jqXHR,textStatus){
                    return {errcode:"01",errmsg:"获取公众号的appid失败!"};
                }
            });
        }

   },
    /**
     * 网页授权，获取用户信息，昵称，头像，openId 会弹出框
     * @param appId
     * @param shopid
     * @param getOpenidUrl
     */
    getOpenUserInfo : function(appId,shopid,getOpenidUrl){

        if (WXUtil.checkMParam(appId)){
            //微信授权的固定url
            var redirect_uri = window.location.href.replace(/#.*/g, ""); //去掉链接里的#号
            var param = "/oauth2?appId="+appId+"&scope=snsapi_userinfo&state=o2o&url="+encodeURIComponent(redirect_uri);
            var url = getOpenidUrl + param;
            window.location.href = url;

        }else{
            $.ajax({
                url: WXUtil.root +"/wxutil/getAppid",
                type:"POST",
                data:{shopid:shopid,ts:(new Date()).getTime()},
                dataType:"json",
                async:false,
                success:function(data){
                    var appid  = data.appid;
                    if(!appid){
                        return data;
                    }
                    //微信授权的固定url
                    var redirect_uri = window.location.href.replace(/#.*/g, ""); //去掉链接里的#号
                    var param = "/oauth2?appId="+appId+"&scope=snsapi_userinfo&state=o2o&url="+encodeURIComponent(redirect_uri);
                    var url = getOpenidUrl + param;
                    window.location.href = url;
                    return true;
                },
                error:function(jqXHR,textStatus){
                    return {errcode:"01",errmsg:"获取公众号的appid失败!"};
                }
            });
        }
    },

    getParamenter:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },

    /**
     *
     * 设置打开链接,去掉连接中的链接参数openid
     *
     */
    set_delOpenid : function(openId){
        window.location.href = window.location.href.replace("openId="+openId,"");
     },



    //设置key，value到本地sessionStorage，自动监测浏览器的支持情况，优先选择本地存储
    set_Storage:function(key,value){
        if(WXUtil.isSessionStorage()){
            WXUtil.setSessionStorage(key,value);
        }
    },
    //获取key，value到本地sessionStorage，自动监测浏览器的支持情况，优先选择本地存储**/
    get_Storage:function(key){
        if(WXUtil.isSessionStorage()){
            return WXUtil.getSessionStorage(key);
        }
    },
    isSessionStorage:function(){
        if(window.sessionStorage)
            return true;
        else
            return false;
    },
    setSessionStorage:function(key,value){
        sessionStorage.setItem(key,value);
        return sessionStorage;
    },
    getSessionStorage:function(key){
        return sessionStorage.getItem(key);
    }
}

WXUtil.hideOptionMenu();

$(function(){
    var pv_uuid_e = $('#pv_uuid');
    if (pv_uuid_e.length == 0){
        var goodsPvURL = WXUtil.get_Storage("goodsPvURL");
        if (goodsPvURL){
            $.get(goodsPvURL,{t:new Date().getTime()},function(){WXUtil.set_Storage("goodsPvURL",'')});
        }
    }
});


 