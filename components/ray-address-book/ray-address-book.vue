<template>
	<view class="component ray-address-book">
		<view class="ray-address-book__header">
			<view class="ray-address-book__blank" @click.stop="onOpenClick">
				<slot name="header" :selection="selection_addr"></slot>
			</view>
			<slot name="suffix"></slot>
			<image src="./icon/right.svg" mode="aspectFit" class="ray-address-book-icon" v-if="!disabled" @click.stop="onOpenClick"></image>
		</view>
		<slot :selection="selection_addr"></slot>
		<ray-popup animation :maskable="false" type="bottom" :visible="isOpen">
			<view class="ray-address-book-popup-wrap">
				<view class="ray-address-book-popup-header">
					<view class="ray-address-book-popup-cancel" @click.stop="onClose">取消
					</view>
					<view class="ray-address-book-popup-title">{{ label }}</view>
					<view class="ray-address-book-popup-confirm" @click.stop="onConfirm">确定</view>
				</view>
				<view class="ray-address-book-popup-selection">
					<view class="ray-address-book-popup-selection-item" v-for="(sel,mx) in selection_addr_list" :class="{'is-actived':sel[itemKey] === selection_code}" :key="mx" @click.stop="onSelectionClick(mx)">{{sel[itemValue]}}</view>
				</view>
				<view class="ray-address-book-popup-main">
					<view class="ray-address-book-popup-aside">
						<scroll-view scroll-y="true" class="ray-address-book-full">
							<view v-for="ltt of letters" :key="`LETTER_${ltt}`" class="ray-address-book-letter" :class="{'is-actived': ltt == search_word }" @tap.stop="onSearchClick(ltt)">{{ltt}}</view>
						</scroll-view>
					</view>
					<view class="ray-address-book-popup-panel">
						<scroll-view class="ray-address-book-full" scroll-y="true" scroll-with-animation :scroll-into-view="`ADDR_BOOk_${search_word}`">
							<view v-for="(addr,dx) in addrList" class="ray-address-book-item" :id="`ADDR_BOOk_${addr.code}`" :key="`ADDR_BOOk_${dx}`">
								<view class="ray-address-book-item-letter">{{addr.code}}</view>
								<view class="ray-address-book-item-group">
									<view class="ray-address-book-item-group-item" v-for="(det,dex) in addr.children" :key="`ADDR_BOOk_${dx}_${dex}`" :class="{'is-actived': det.value === selection_code }" @click.stop="onChooseAddr(det)">
										<view class="ray-address-book__selection"></view>
										<view class="ray-address-book__label">{{det[itemValue]}}</view>
									</view>
								</view>
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
		name: "ray-address-book",
		components: {
			RayPopup
		},
		props: {
			value: {
				type: Array,
				default: () => []
			},
			label: {
				type: String
			},
			placeholder: {
				type: String,
				default: "请选择"
			},
			dataItems: {
				type: Array,
				default: () => []
			},
			itemKey: {
				type: String,
				default: 'area_code'
			},
			itemValue: {
				type: String,
				default: 'area_name'
			},
			itemChildren: {
				type: String,
				default: 'children'
			},
			splitor: {
				type: String,
				default: 'PY'
			},
			lazy: {
				type: Boolean,
				default: false
			},
			lazyLoadChildren: {
				type: Function,
				default: null
			},
			disabled: {
				type: Boolean,
				default: false
			},
			level:{
				type:Number,
				default:3
			}
		},
		data() {
			return {
				search_word: '',
				letters: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
				addrList: [],
				selection_addr_list: [],
				selectionIndex: 0,
				selection_code: '',
				selection_addr: '',
				isOpen: false,
				dirty:false,
				store: null
			}
		},
		created() {
			this.selectionIndex = 0
		},
		beforeMount() {
			this.initSelectionAddrList()
			this.store = new Store(this.dataItems, {
				itemKey: this.itemKey,
				itemValue: this.itemValue,
				itemChildren: this.itemChildren,
				itemSplitor: this.splitor
			}, '0.0.0.0')
			this.updateAddrList('0.0.0.0')
			this.updateSelectionList(this.dataItems)
		},

		beforeDestroy() {
			this.store.destory()
			this.store = null
		},
		watch: {
			dataItems(nv, ov) {
				this.updateStoreAndAddrList(nv, '0.0.0.0')
				this.updateSelectionList(nv)
			},
			value(nv, ov) {
				if(this.isArrayChange(nv)){
					this.selectionIndex = 0
					this.updateAddrList('0.0.0.0')
					this.updateSelectionList(this.dataItems)
					this.emitValidateChange()
				}
			}
		},
		methods: {
			/**
			 * 提交更新事件
			 */
			emitValidateChange(){
			   	this.$emit("change:validate",this.dirty)
			},
			/**
			 * 判断Value是否包含在selection_addr_list
			 * @param {Array<String>} ary
			 */
			isArrayChange(ary){
			   let  bry = this.selection_addr_list.filter(data =>!!data[this.itemKey])
			   return ary.length!=bry.length || bry.some(dto=>ToolKit.ensure(ary).some(code=>code !== dto[this.itemKey]))
			},
			/**
			 * 点击选择项
			 * @param {Number} selectionIndex
			 */
			onSelectionClick(selectionIndex){
				let node = this.selection_addr_list[selectionIndex]
				if(ToolKit.isEmptyString(node[this.itemKey]) || node.disabled) {return false}
				this.selectionIndex = selectionIndex
				this.selection_addr_list = this.selection_addr_list.slice(0,selectionIndex+1)
				let addrs = this.store.getAddrList(node.pid || '0.0.0.0')
				this.selection_code = node[this.itemKey]
				if(addrs.length > 0) {
					this.addrList = addrs
					this.initSelectionAddrList()
				}
			},
			/**
			 * 根据value反选地址
			 * @param {Array} ary
			 */
			updateSelectionList(ary) {
				if(this.value.length === 0) { this.selection_addr_list = [] }
				this.updateSelectionText()
				let code = this.value[Math.max(this.selectionIndex,0)]
				if(!code) { return false }
				this.selection_code = code
				let node = ary.find(data => data[this.itemKey] === code)
				if(node) {this.updateAddrListWhenChange(node, this.updateSelectionList)}	
			},
			/**
			 * 更新
			 * @param {Object} node
			 * @param {Object} callback
			 */
			updateAddrListWhenChange(node,callback){
				this.selection_addr_list.splice(Math.max(this.selectionIndex,0), 1, node)
				if(this.selectionIndex  < this.level){
					this.loadChildren(node,this.itemKey,callback)
				}	
			},
			
			/**
			 * 初始化selection
			 */
			initSelectionAddrList() {
				if(this.selection_addr_list.slice(-1).some(item=>item[this.itemKey]=='')){ return false }
				if(this.selection_addr_list.length === this.level) { return false }
				this.selection_addr_list.push({[this.itemKey]: '', [this.itemValue]: this.placeholder,disabled:true})
			},
			/**
			 * 更新列表
			 * @param {String} pid
			 */
			updateAddrList(pid) {
				this.addrList = this.store.getAddrList(pid)
			},
			/**更新本地存储及列表
			 * @param {Array<Obect>} ary
			 * @param {String} pid
			 */
			updateStoreAndAddrList(ary, pid) {
				this.store.updateAddrList(pid, ary)
				if(ary.length && (this.selectionIndex + 1) < this.level){this.updateAddrList(pid)}
			},
			/**
			 * 打开Popup
			 */
			onOpenClick() {
				if(this.disabled) {return}
				this.dirty = true
				this.isOpen = true
			},
			/**
			 * 关闭Popup
			 */
			onClose() {
				this.isOpen = false
			},
			/**
			 * 提交事件
			 */
			onConfirm() {
				this.onClose()
				this.updateSelectionText()
				this.$emit('change', this.selection_addr_list.filter(data => !!data[this.itemKey]))
			},
			/**
			 * 更新显示文字
			 */
			updateSelectionText(){
				this.selection_addr = this.selection_addr_list.filter(data =>!!data[this.itemKey]).map(area => area[this.itemValue]).join('')
			},
			/**
			 * 选择地址
			 * @param {Object} item
			 */
			onChooseAddr(item) {
				this.selection_addr_list.splice(this.selectionIndex, 1, item)
				this.selection_code = item.value
				if(this.selectionIndex < this.level){
					this.loadChildren(item,'value',null)
				}	
			},
			/**
			 * 更新下级地址
			 * @param {Object} node
			 */
			loadChildren(node, key, callback) {
				let addrs = this.store.getAddrList(node[key]||'0.0.0.0')
				if(addrs.length > 0) {
					this.addrList = addrs
					if((this.selectionIndex + 1) < this.level){ this.selectionIndex += 1 }
					this.initSelectionAddrList()
					
					if(callback) {
						callback.call(this, this.store.getDataList(node[this.itemKey]||'0.0.0.0'))
					}			
				}
				
				if(addrs.length === 0 && this.lazy &&ToolKit.isFunction(this.lazyLoadChildren)) {
					this.loadChildrenFromParent(node).then(child => {
						this.updateStoreAndAddrList(child, node[this.itemKey])
						if(child.length) {
							if((this.selectionIndex + 1) < this.level){ this.selectionIndex += 1 }
							this.initSelectionAddrList()
						}
						if(callback) {
							callback.call(this, this.store.getDataList(node[this.itemKey]))
						}
					})
				}
			},
			/**
			 *  懒加载下级地址
			 * @param {Object} node
			 */
			loadChildrenFromParent(node) {
				return new Promise((resolve, reject) => {
					this.lazyLoadChildren(node, resolve, reject)
				})
			},
			/**
			 * 字母点击
			 * @param {String} word
			 */
			onSearchClick(word) {
				let txt = word
				this.search_word = txt
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ray-address-book {
		flex: 1;
		width: 100%;

		&__header {
			display: flex;
			align-items: center;
			width: 100%;
			min-height: 100upx;
		}

		&-icon {
			height: 30upx;
			width: 30upx;
		}

		&-full {
			width: 100%;
			height: 100%;
		}
		
		&__blank{
			flex: 1;
		}

		&-popup-wrap {
			position: relative;
			overflow: hidden;
			border-radius: 30upx 30upx 0 0;
			background: #FFFFFF;
		}

		&-popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 88upx;
			background: #F4F7FC;
			border-radius: 30upx 30upx 0 0;
			overflow: hidden;
		}

		&-popup-main {
			position: relative;
			background-color: #FFFFFF;
		}

		&-popup-panel {
			height: 740upx;
			overflow: hidden;
		}

		&-popup-aside {
			position: absolute;
			padding: 20upx 0;
			width: 40upx;
			right: 40upx;
			top: 20upx;
			bottom: 20upx;
			border-radius: 20upx;
			background-color: #F4F7FC;
			z-index: 10;
		}

		&-popup-cancel {
			font-size: 32upx;
			color: #000000;
			margin-left: 30upx;
		}

		&-popup-confirm {
			font-size: 32upx;
			color: #00A32E;
			margin-right: 30upx;
		}

		&-popup-title {
			color: #303030;
			font-size: 32upx;
			line-height: 32upx;
			text-align: center;
		}

		&-letter {
			padding: 10upx 0;
			text-align: center;
			font-size: 30upx;
			line-height: 30upx;
		}

		&-item {
			padding: 0 40upx;
			overflow: hidden;

			&-letter {
				line-height: 60upx;
				font-size: 30upx;
				color: #000F21;
				margin-bottom: 10upx;

				&::after {
					content: '';
					width: 100%;
					height: 1px;
					transform: scaleY(0.5);
					background-color: #E6E6E6;
					display: block;
				}
			}

			&-group {
				overflow: hidden;

				&-item {
					display: flex;
					align-items: center;
				}
			}
		}

		&__selection {
			display: none;
			width: 25upx;
			height: 15upx;
			border-left: 2px solid #00A73D;
			border-bottom: 2px solid #00A73D;
			margin-right: 20upx;
			transform: rotateZ(-35deg);
			transition: display 300ms ease-in-out;
		}

		&__label {
			font-size: 30upx;
			line-height: 80upx;
			color: #41444C;
		}

		&-popup-selection {
			display: flex;
			margin: 20upx;
			align-items: center;
			flex-wrap: wrap;
			box-sizing:
				border-box;
		}

		&-popup-selection-item {
			position: relative;
			font-size: 30upx;
			color: #666666;
			line-height: 52upx;
			padding: 10upx 30upx;
		}

		.is-actived {
			color: #00A73D;
			font-weight: 500;

			.ray-address-book__selection {
				display: block;
			}

			.ray-address-book__label {
				color: #00A73D;
				font-weight: 500;
			}

			&.ray-address-book-popup-selection-item {
				&::after {
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
