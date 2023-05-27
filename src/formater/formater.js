
/**
 *格式化金额 
 */
export function money(){
	return function(data){
		if(!data){
			return '--'
		}else{
			let temp = 0
			if(data.includes(',')){
				temp = parseFloat(data.split(',').join(''))
			}else{
				temp = parseFloat(data)
			}
			return temp.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
		}
	}		
}

/**
 *还原金额数字
 */
export function re_money(){
	return function(data){
		if(data=='--' || (!data)){ return ''}
		return (data+'').replace(/,/g,'')
	}
}
/**
 * 格式化 百分比
 * @param {Object} fix
 */
export  function percent(fix){
	return function  (data){
		if(( !data ) || data== '--'){ return '--' }
		let  deal = parseFloat(data * 100).toFixed(fix);
		let num = deal.length;
		let count = 0;
		for (let i = num; i > 0; i--) {
			if (deal.substring(i - 1, i) == '0') {
				count++;
			} else if (deal.substring(i - 1, i) == '.') {
				count++;
				break;
			} else {
				break;
			}
		}
		return deal.substring(0, num - count)		
	}
}
/**
 * 百分比转小数
 * @param {NUMBER} fix
 */
export  function  re_percent(fix){
	return function  (data){
		if(( !data ) || data== '--'){ return '' }
		let  deal = parseFloat(data/100).toFixed(fix);
		let num = deal.length;
		let count = 0;
		for (let i = num; i > 0; i--) {
			if (deal.substring(i - 1, i) == '0') {
				count++;
			} else if (deal.substring(i - 1, i) == '.') {
				count++;
				break;
			} else {
				break;
			}
		}
		return deal.substring(0, num - count)		
	}
}
/**
 * 获取selct
 * @param {Object} picker
 * @param {Object} key
 * @param {Object} value
 */
export function selection(picker,key,value){
	return function(search){
		if(Array.isArray(picker)==false){ picker = [] }
		let node = picker.find(item=>item[key] === search)
		if(node){
			return node[value]
		}
		return ''
	}
}

export function phone(){
	return function(text){
		return text.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3')
	}
}