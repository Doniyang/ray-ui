<template>
	<view class="component ray-cascade">
		   <view class="ray-cascade__header" @click.stop="onOpenClick">
			 <slot name="header" :selection="selection_txt"></slot>
			  <image src="./icon/right.svg" mode="aspectFit" class="ray-cascade-icon" v-if="!disabled"></image>
		   </view>
		   <slot :selection="selection_txt"></slot>
		   <ray-popup animation :maskable="false" type="bottom" :visible="isOpen">
			   <view class="ray-cascade-popup-wrap">
			   	   <view class="ray-cascade-popup-header">
						<view class="ray-cascade-popup-cancel" @click.stop="onClose">取消</view>
						<view class="ray-cascade-popup-title">{{ label }}</view>
						<view class="ray-cascade-popup-confirm" @click.stop="onConfirm">确定</view>
			   	   </view>
				   <view class="ray-cascade-popup-selection">
				   	    <view class="ray-cascade-popup-selection-item" v-for="(sel,mx) in selection_list" :class="{'is-actived':sel.value === selection_code}" :key="mx" @click.stop="onSelectionClick(mx)">{{sel[itemValue]}}</view>
				   </view>
				   <view class="ray-cascade-popup-main">
					   <view class="ray-cascade-popup-panel">
						   <scroll-view class="ray-cascade-full" scroll-y="true">
								   <view v-for="(item,dx) in cascadeList" class="ray-cascade-item" :key="dx" :class="{'is-actived': item.value === selection_code }"  @click.stop="onChoose(item)">
									   <view class="ray-cascade-item__selection"></view>
									   <view class="ray-cascade-item__label">{{ item.label }}</view>
								   </view>
						   </scroll-view>
					   </view>
				   </view>
			   </view>
		   </ray-popup>
	</view>
</template>

<script>
	import RayPopup from '../ray-popup/ray-popup.vue'
	import Store from './model/Store.js'
	import ToolKit from '../../src/toolkit/toolkit.js'
	export default {
		name:"ray-cascade",
		components:{RayPopup},
		props:{
		   value:{
			 type:Array,
			  default:()=>[]
		   },
		   label : {
			   type:String
		   },	   
		   placeholder:{
			   type:String,
			   default:"请选择"
		   },
		   dataItems:{
			   type:Array,
			   default:()=>[]
		   },
		   itemKey:{
			   type:String,
			   default:'key'
		   },
		   itemValue:{
			   type:String,
			   default:'name'
		   },
		   itemChildren:{
			   type:String,
			   default:'children'
		   },
		   lazy:{
			   type:Boolean,
			   default:false
		   },
		   lazyLoadChildren:{
			   type:Function,
			   default:null
		   },
		   disabled:{
			  type:Boolean,
			  default: false
		   },
		   splitor:{
			   type:String,
			   default:'>'
		   }
		},
		data() {
			return {
				cascadeList:[],
				selection_list: [],
				selectionIndex: 0,
				selection_code: '',
				selection_txt: '',
				isOpen:false,
				dirty:false,
				store:null
			}
		},
		created() {
		  this.selectionIndex = 0	
		},
		beforeMount() {
			this.initSelectionList()
		   	this.store = new Store(this.dataItems,{
				itemKey:this.itemKey,
				itemValue:this.itemValue,
				itemChildren:this.itemChildren
			},'0.1.0.1')
			this.updateCascadeList('0.1.0.1')
			this.updateSelectionList(this.dataItems)
		},
		beforeDestroy() {
		   this.store.destory()
			this.store = null   
		},
		watch:{
			dataItems(nv,ov){
				this.updateStoreAndCascadeList(nv,'0.1.0.1')
			},
			value(nv,ov){
				if(this.isArrayChange(nv)){
					this.selectionIndex = 0
					this.updateSelectionList(this.dataItems)
					this.emitValidateChange()
				}			
			}
		},
		methods:{
			/**
			 * 提交更新事件
			 */
			emitValidateChange(){
			   	this.$emit("change:validate",this.dirty)
			},
			/**
			 * 判断Value是否包含在selection_list
			 * @param {Array<String>} ary
			 */
			isArrayChange(ary){
			   return this.selection_list.filter(data => !!data[this.itemKey]).some(dto=>ToolKit.ensure(ary).some(code=>code !== dto[this.itemKey]))
			},
			/**
			 * 点击选择项
			 * @param {Number} selectionIndex
			 */
			onSelectionClick(selectionIndex){
				let node = this.selection_list[selectionIndex]
				if(ToolKit.isEmptyString(node[this.itemKey]) || node.disabled){return false}	
				this.selectionIndex= selectionIndex
				this.selection_list = this.selection_list.slice(0,selectionIndex+1)
				let nodeList = this.store.getList(node.pid||'0.1.0.1')	
				this.selection_code = node.value
				if(nodeList.length > 0) {
					this.cascadeList = nodeList
					this.initSelectionList()
				}
			},
			/**
			 * 根据value反显
			 * @param {Array} ary
			 */
			updateSelectionList(ary){
			    if(this.value.length === 0) { this.selection_addr_list = [] }
			    this.updateSelectionText()
				let code = this.value[this.selectionIndex]
				if(!code){ return false}
				this.selection_code = code
				let node = ary.find(data=>data[this.itemKey] === code)
				if(node){this.updateAddrListWhenChange(node, this.updateSelectionList) }
			},
			/**
			 * @param {Object} node
			 * @param {Object} callback
			 */
			updateAddrListWhenChange(node,callback=null){
				this.selection_list.splice(Math.max(this.selectionIndex,0), 1, node)
				this.selection_code = node.value
				this.loadChildren(node,'value',callback)
			},
			/**
			 * 初始化selection
			 */
			initSelectionList(){
			   if(this.selection_list.slice(-1).some(item=>item[this.itemKey]=='')){ return false }
			   this.selection_list.push({ [this.itemKey]: '', [this.itemValue]: this.placeholder,disabled:true})	
			},
			/**
			 * 更新列表
			 * @param {String} pid
			 */
			updateCascadeList(pid){
				this.cascadeList = this.store.getList(pid) 
			},
			/**更新本地存储及列表
			 * @param {Array<Obect>} ary
			 * @param {String} pid
			 */	
			updateStoreAndCascadeList(ary,pid){
				this.store.updateList(pid,ary)
				if(ary.length){this.updateCascadeList(pid)}
			},
			/**
			 * 打开Popup
			 */
			onOpenClick(){
				if(this.disabled) { return }
				this.dirty = true
				this.isOpen = true
			},
			/**
			 * 关闭Popup
			 */
			onClose(){
			   this.isOpen = false	
			},
			/**
			 * 提交事件
			 */
			onConfirm(){
				this.onClose()	
				this.$emit('change', this.selection_list.filter(data=>!!data[this.itemKey]).map(item=>item[this.itemKey]))
			},
			
			/**
			 * 更新显示文字
			 */
			updateSelectionText(){
				this.selection_txt = this.selection_list.filter(data =>!!data[this.itemKey]).map(a=> a[this.itemValue]).join(this.splitor)
			},
			/**
			 * 选择地址
			 * @param {Object} item
			 */
			onChoose(item,callback=null){
			    this.selection_list.splice(this.selectionIndex,1,item)
				this.selection_code = item.value
			    this.loadChildren(item,'value',null)   		
			},
			/**
			 * 更新下级分类
			 * @param {Object} node
			 */
			loadChildren(node,key,callback=null){
				let items =  this.store.getList(node[key]) 
				if(items.length > 0 ){ 
					this.cascadeList = items
					this.selectionIndex += 1
					this.initSelectionList()
					if(callback){callback.call(this,items)}
				}				
				
				if(items.length === 0 && this.lazy && ToolKit.isFunction(this.lazyLoadChildren)){
					this.loadChildrenFromParent(node).then(child=>{
						this.updateStoreAndCascadeList(child,node[this.itemKey])
						if(child.length) {
							this.selectionIndex += 1
							this.initSelectionList()
						}
						if(callback){callback.call(this,this.store.getList(node[this.itemKey]))}
					})
				}
			},
			/**
			 *  懒加载下级分类
			 * @param {Object} node
			 */
			loadChildrenFromParent(node){
			     return new Promise((resolve,reject)=>{
					 this.lazyLoadChildren(node,resolve,reject)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-cascade{
	flex: 1;
	width: 100%;
	
	&__header{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		min-height: 100upx;
	}
		
	&-icon{
		height: 30upx;
		width: 30upx;
	}
	
	&-full{
		width: 100%;
		height: 100%;
	}
	
	&-popup-wrap{
		position: relative;
		overflow: hidden;
		border-radius: 30upx 30upx 0 0;
		background: #FFFFFF;
	}
	
	&-popup-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 88upx;
		background: #F4F7FC;
		border-radius: 30upx 30upx 0 0;
		overflow: hidden;
	}
	
	&-popup-main{
		position: relative;
		background-color: #FFFFFF;
	}
	
	&-popup-panel{
		height: 540upx;
		overflow: hidden;
	}
	
	&-popup-cancel{
		font-size: 32upx;
		color:#000000;
		margin-left: 30upx;
	}
	
	&-popup-confirm{
		font-size: 32upx;
		color:#00A32E;
		margin-right: 30upx;
	}
	
	&-popup-title{
		color:#303030;
		font-size:32upx;
		line-height:32upx;
		text-align: center;
	}

	&-item{
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		&::after {
			position: absolute;
			bottom: 0;
			left: 0;
			content: '';
			width: 100%;
			height: 1px;
			transform: scaleY(0.5);
			background-color: #E6E6E6;
			display: block;
		}
	}
	
	&-item__selection{
		display: none;
		width: 25upx;
		height: 15upx;
		border-left: 2px solid #00A73D;
		border-bottom: 2px solid #00A73D;
		margin-right: 20upx;
		margin-left: 40upx;
		transform: rotateZ(-35deg);
		transition: display 300ms ease-in-out;
	}
	&-item__label{
		padding: 10upx 40upx;
		font-size: 30upx;
		line-height: 40upx;
		color: #41444C;
		flex: 1;
	}
	&-popup-selection{
		display: flex;
		margin: 20upx;
		align-items: center;
		flex-wrap: wrap;
		box-sizing: 
		border-box;
	}
	&-popup-selection-item{
		position: relative;
		font-size: 30upx;
		color: #666666;
		line-height: 52upx;
		padding: 10upx 30upx;
	}

	.is-actived{
		color:#00A73D;
		font-weight: 500;
		
		.ray-cascade-item__selection{
			display: block;
		}
		.ray-cascade-item__label{
			color:#00A73D;
			font-weight: 500;
			padding-left: 0;
		}
		
		&.ray-cascade-popup-selection-item{
			&::after{
				position: absolute;
				bottom: 0;
				left: 50%;
				content: '';
				width: 88upx;
				height: 4px;
				margin: 0 0 0 -44upx;
				transform: scaleY(0.5);
				background-color: #00A73D;
			}
		}
	}
}
</style>
