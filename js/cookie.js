function setMCookie(name, value, expires) {
	if(checkMParam(value)){
		if(expires == null){
			expires = new Date();
		    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
	    }
	    $.cookie(name,value,{expires:expires,path:"/",secure:false});
	    //document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString()));
    }
}
function checkMCookie(name, value){
	var c = getMCookie(name);
	if(checkMParam(c) && checkMParam(value) && c == value){
		return true;
	}
	return false;
}
function checkMParam(value){
	if(value != null && value != undefined && value != "" && value != "null" && value != "NULL" && value != "undefined" && value != "UNDEFINED"){
		return true;
	}
	return false;
}
function getMCookie(name) {
	return $.cookie(name);
	/*
    var start = document.cookie.indexOf(name + "="); 
    if (start == -1) {
    	return null;
    } 

    var len = start + name.length + 1; 

    var end = document.cookie.indexOf(";", len); 
    if(end == -1) {
    	end = document.cookie.length;
    } 

    return unescape(document.cookie.substring(len, end));
    */ 
}

function deleteCookie(name) 
{ 
    var expdate = new Date(); 
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
    setCookie(name, "", expdate); 
} 
