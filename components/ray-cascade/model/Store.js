/**
 * 本地存储地址列表
 * 
 */
export default class Store {
	constructor(data,cfg,pid) {
	    this.cache = []
		this.root = pid
		this.options = cfg
		this.init(data,pid)
	}
	get datakey(){
		return this.options.itemKey || 'area_code'
	}
	get datavalue(){
		return this.options.itemValue || 'area_name'
	}
	
	get datachildren(){
		return this.options.itemChildren || 'children'
	}
	/**
	 * 树结构数组转换数组
	 * [{key,value,children}]-->[key,value,pid]
	 * @param {Object} ary
	 * @param {Object} pid
	 */
	init(ary,pid){
		if(this.isRootKey(pid)) { this.clean() }
		ary.forEach(item=>{
			let key = this.datakey
			let value = this.datavalue
			let children = this.datachildren
			if(!this.has(item[key])){this.cache.push(Object.assign({label: item[value], value: item[key], pid: pid}, item))}			
			if(Array.isArray(item[children])){
				this.init(item[children], item[key])
			}
		})
	}
    /**
	 * 是否是root
	 * @param {Object} key
	 */
	isRootKey(key){
		return this.root === key
	}
	/**
	 * 清空
	 */
	clean(){
		 this.cache = []
	}
	/**
	 * @param {Object} nid
	 */
	has(nid){
		return this.cache.some(data=>data.value === nid)
	}
	/**
	 * @param {Object} pid
	 */
	getList(pid){
		 return this.cache.filter(data=>data.pid === pid)
	}
	/**
	 * @param {Object} pid
	 * @param {Object} ary
	 */	
	updateList(pid,ary){
		this.init(ary,pid)
	}
	/**
	 * 
	 */
	destory(){
		this.cache = null
		this.option = null
	}
}