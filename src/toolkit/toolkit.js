export default class ToolKit {	
	/**
	 * 判断是不是null
	 * @param {Object} val
	 */
	static isNull(val){
		return val === null
	}
	/**
	 * 判断是不是undefined
	 * @param {Object} val
	 */
	static isUndef(val){
		return arguments.length === 1 && val === undefined
	}
	/**
	 * 判断是否是字符串
	 * @param {any} val
	 */
	static isString(val){
		return typeof val === 'string'
	}

	/**
	 * 判断是否是空字符
	 * @param {any} v
	 */
	static isEmptyString(v){
		return this.isString(v) && v.trim() === ''
	}
	
	/**
	 * 确认是数组
	 */
	static ensure(ary,def=[]){
		return Array.isArray(ary)? ary :  (this.isNull(ary) || this.isUndef(ary) || this.isEmptyString(ary))? def : [ary]
	}
	/**
	 * 判断是否是函数
	 * @param {Object} fn
	 */
	static isFunction(fn){
		return typeof fn === 'function'
	}
	
	/**
	 *    判断是否Object
	 * @param {any} obj
	 */
	static isObject(obj){
		return this.isNull(obj)===false && typeof obj === 'object' && Array.isArray(obj)===false
	}
	
	static isPlainObject(obj){
		const toString = {}.toString
		if(this.isObject(obj)===false||toString.call(obj)!=='[object Object]'){return false}
		const Ctor = obj.constructor
		if(this.isFunction(Ctor)===false){return false}
		const Prot = Ctor.prototype
		if(this.isObject(Prot)===false||toString.call(Prot)!=='[object Object]'){return false}
		if(Prot.hasOwnProperty('isPrototypeOf')===false){return false}
		return true
	}
	
	/**
	 * 获取对象的值
	 * @example 
	 *   getValueFromPath({a:{b: c:[] }},'a.b.c' ) //[]
	 * @param {Object} obj
	 * @param {String} path
	 * @param {any} def 
	 * @return { any }
	 */
	static getValueFromPath(obj,path,def=""){
		let paths = path.split('.')
		let  o = obj
		if(this.isObject(obj) == false){ return def}
		for (let i = 0; i < paths.length; i++) {
			let key = paths[i]
			o = o[key]
			if(this.isPlainObject(o)===false){
				break
			}
		}
	    return o
	}
}