/**
 * 格式化小数，小数点后面是0不显示
 * @param number
 * @returns
 */
function formatNumber(number){
	if (/^[-+]?[1-9]+[0-9]*]*$/.test(number)){
		return number; //如果不是小数直接返回
	}
	number = parseFloat(number).toFixed(2);
    var regex = /\.0$/;
    if(regex.test(number)){
    	return parseFloat(number).toFixed(0);
    }
    regex = /\.00$/;
    if(regex.test(number)){
    	return parseFloat(number).toFixed(0);
    }
    regex = /\.[1-9]0$/;
    if(regex.test(number)){
    	return parseFloat(number).toFixed(1);
    }
    return number;
}
