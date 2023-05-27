<!--  -->
<template>
	<view class="component ray-card-list" @click.stop="handleClick">
		<view  class="ray-card-list__holde" :class="{'ray-card-list__header':headerOptions.length}" role="header">
			<slot name="title"></slot>
			<view class="ray-card-list__flexbox ray-card-list__align-center" v-if="isRowLine">
				<view v-for="(row,rowIndex) in rowLineList" :key="rowIndex" class="ray-card-list__flexbox-item" :class="[{'ray-card-list__strong': rowIndex==0}, row.class]">
					<text v-if="row.splitor" class="ray-card-list__splitor">{{row.splitor | rawSolitorFilter(0)}}</text>
					<text class="ray-card-list__text" :class="{'ray-card-list__text--is-no-gap': rowIndex==0}" @click.stop="handleItemClick(row)">{{ dataItem[row.key] | rawStringFilter(row.formator) }}</text>
					<text v-if="row.splitor" class="ray-card-list__splitor">{{row.splitor | rawSolitorFilter(1)}}</text>
				</view>
			</view>
			<view v-for="(item,index) in headerList" :key="index" :class="{ 'ray-card-list__gap': isRowLine }">
				<view class="ray-card-list__flexbox ray-card-list__align-top" :class="item.class">
					<template v-if="index==0 && isNolabel">
						<view class="ray-card-list__value ray-card-list__strong" v-if="item.clickable" @click.stop="handleItemClick(item)">{{ dataItem[item.key] | rawStringFilter(item.formator) }}</view>
						<view class="ray-card-list__value ray-card-list__strong" v-else>{{dataItem[item.key] | rawStringFilter(item.formator)}}</view>
						<image :src="item.icon" mode="aspectFit" class="ray-card-list__icons" v-if="item.icon"></image>
					</template>
					<template v-else>
						<view class="ray-card-list__label"  :class="{ 'ray-card-list__strong': (!isRowLine) && index==0 && (!isNolabel) }">{{item.label+':'}}</view>
						<view class="ray-card-list__value" :class="{ 'ray-card-list__strong': (!isRowLine) && index==0 && (!isNolabel) }" v-if="item.clickable" @click.stop="handleItemClick(item)">{{ dataItem[item.key] | rawStringFilter(item.formator) }}</view>
						<view class="ray-card-list__value" :class="{ 'ray-card-list__strong': (!isRowLine) && index==0 && (!isNolabel) }" v-else>{{dataItem[item.key] | rawStringFilter(item.formator)}}</view>
						<image :src="item.icon" mode="aspectFit" class="ray-card-list__icons" v-if="item.icon"></image>
					</template>	
				</view>
			</view>
			<slot name="row.header"></slot>
		</view>
		<view class="ray-card-list__holde" :class="{'ray-card-list__main':bodyList.length}" role="body">
			<view class="ray-card-list__flexbox ray-card-list__flexwrap ray-card-list__align-center">
				<view v-for="(item,index) in bodyList" :key="index" class="ray-card-list__item" :class="item.class">
					<text class="ray-card-list__item_label" :aria-label="item.label">{{item.label+': '}}</text>
					<text class="ray-card-list__item_value" @click.stop="bodyTxtClick(dataItem,item)" :aria-description="dataItem[item.key]">{{dataItem[item.key] | rawStringFilter(item.formator)}}</text>
					<image @click.stop="iconClick(dataItem,item)" v-if="item['icon']" :src="item['icon']" mode="aspectFit" class="ray-card-list__item_image"></image>
				</view>
			</view>
			<slot name="row.main"></slot>
		</view>
		<view class="ray-card-list__holde" :class="{'ray-card-list__footer': footerList.length || buttonList.length }" role="footer">
			<view class="ray-card-list__flexbox ray-card-list__flexwrap ray-card-list__align-center" v-if="footerList.length">
				<view v-for="(opt,dex) in footerList" :key="dex" class="ray-card-list__item" :class="opt.class">
					<text class="ray-card-list__item_label" :aria-label="item.label">{{ opt.label+': ' }}</text><text class="ray-card-list__item_value" :aria-description="dataItem[opt.key]">{{ dataItem[opt.key] | rawStringFilter(opt.formator) }}</text>
				</view>
			</view>
			<slot name="row.footer"></slot>
			<view class="ray-card-list__flexbox ray-card-list__flexwrap ray-card-list__align-center" v-if="buttonList.length">
				<template v-for="(btn,ex) in buttonList">
					<view class="ray-card-list__divider" :key="'DIVIDER'+ex" v-if="ex>0"></view>
					<view  :key="'BTN-'+ex" class="ray-card-list__btn" :class="btn.class">
						<ray-button @click.stop="handleBtnClick(btn)" :size="btn.size" :type="btn.type" ghost plain>{{btn.text}}</ray-button>
					</view>
				</template>
			</view>
		</view>
		<view class="ray-card-list__arrow" v-if="arrow"></view>
		<slot></slot>
	</view>
</template>

<script>
	import RayButton from "../ray-button/ray-button.vue"
	import ToolKit from "../../src/toolkit/toolkit.js"
	import { money, percent, selection,phone } from "../../src/formater/formater.js"
	export default {
		name: "ray-card-list",
		components: {
			RayButton
		},
		props: {
			headerOptions: {
				type: Array, //第一列数据
				default: () => []
			},
			mainOptions: {
				type: Array, //第二列数据
				default: () => []
			},
			footerOptions: {
				type: Array, //第三列数据
				default: () => []
			},
			buttonList: {
				type: Array, //按钮数组
				default: () => []
			},
			isRowLine: {
				type: Boolean, //控制第一列表头的样式  true:第一行多数据排列  false:单一逐行排列
				default: false
			},
			arrow: { //是否显示箭头
				type: Boolean,
				default: false
			},
			dataItem: { //数据项
				type: Object,
				default: () => ({}),
			},
			isNolabel: { //首行不显示label
				type: Boolean,
				default: false
			},
			clickable: { //是否可点击
				type: Boolean,
				default: false
			},
			background: { //背景颜色
				type: String
			}
		},
		filters: {
			rawSolitorFilter(splitor, dx) {
				return splitor.split('')[dx]
			},
			rawStringFilter(str,formater) {
				return  formater(str) || '--'
			}
		},
		data() {
			return {
				rowLineList: [],
				headerList: [],
				bodyList: [],
				footerList: []
			}
		},
		beforeMount() {
			this.updateListCfgOptions()
		},
		methods: {
			updateListCfgOptions(){
				if(this.isRowLine) {
					this.headerList = this.headerOptions.filter(d => !!d.label)
					this.rowLineList = this.headerOptions.filter(d => !d.label)
				} else {
					this.headerList = this.headerOptions
					this.rowLineList = []
				}
				this.headerList = this.headerList.map(cfg=>this.updateCfgItem(cfg))
				this.rowLineList = this.rowLineList.map(cfg=>this.updateCfgItem(cfg))
				this.bodyList = this.mainOptions.map(cfg=>this.updateCfgItem(cfg))
				this.footerList = this.footerOptions.map(cfg=>this.updateCfgItem(cfg))
			},
			updateCfgItem(cfg){
				if(cfg.type==='select'){
					if(ToolKit.isUndef(cfg.picker) && ToolKit.isEmptyString(cfg.source) == false){ cfg.picker = ToolKit.getValueFromPath(this,cfg.source) }
					cfg.formator = selection(cfg.picker,cfg.itemKey||'key',cfg.itemValue||'val')
				}
				if(cfg.formator === 'money'){
					cfg.formator = money()
				}
				if(cfg.formator === 'percent'){
					cfg.formator = percent(cfg.fixed||6)
				}
				if(cfg.formator === 'phone'){
				   cfg.formator = phone()
				}
				
				if(ToolKit.isFunction(cfg.formator) ===false){
					cfg.formator = function(str){ return str } 
				}
				return cfg
			},
			handleClick(e) {
				if(!this.clickable) { return false }
				this.$emit('click:card',this.dataItem)
			},
			handleItemClick(item){
				if(item.clickable !== true){ return false }
				let data = Object.assign({},item,{value:this.dataItem[item.key]})
				this.$emit('click:cell',data)
			},
			handleBtnClick(btn) {
			   this.$emit('click:btn',this.dataItem,btn)
			},
			/**
			 * body单行触发点击事件
			 * @param {Object} dataItem 当前触发项信息
			 * @param {Object} opt 当前触发项具体配置
			 */
			bodyTxtClick(dataItem,item) {
				if(!item.clickable) return
				this.$emit('click:body',{dataItem,item})
			},
			/**
			 * body图片触发点击事件
			 * @param {Object} dataItem 当前触发项信息
			 * @param {Object} opt 当前触发项具体配置
			 */
			iconClick(dataItem,item) {
				this.$emit('click:icon',{dataItem,item})
			}
		}
	}
</script>
<style lang="scss">
	.ray-card-list {
		position: relative;
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 20upx;
		overflow: hidden;
		box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.04);
         
		 &__holde{
			 min-height: 0;
			 height: 0;
		 } 
		&__header {	
			position: relative;
			height: auto !important;
			padding: 30upx 24upx;
		}

		&__main {
			position: relative;
			padding: 30upx 24upx 14upx;
			position: relative;
			height: auto !important;
			padding: 30upx 24upx;
			background: #F2FFF7;
		}
		
		&__item {
			font-size: 28upx;
			color: #41444C;
			min-width: 50%;
			line-height: 28upx;
			padding-right: 20upx;
            margin-bottom: 16upx;    
			&>uni-text {
				font-size: inherit;
				color: inherit;
				line-height: 1;
				
				& > *{
					line-height: 1;
					vertical-align: middle;
				}
			}
			&_image {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
				display: inline-block;
				vertical-align: middle;
			}
		}

		&__footer {
			position: relative;
			height: auto !important;
			padding: 20upx 24upx;
		}

		&__flexbox {
			display: flex;
		}

		&__align-center {
			align-items: center;
		}

		&__align-top {
			align-items: flex-start;
		}

		&__flexwrap {
			flex-wrap: wrap;
		}

		&__flexbox-item {
			display: inline-flex;
			align-items: center;
			font-size: 28upx;
			line-height: 28upx;
			color: #666666;
			white-space: nowrap;
			word-wrap: normal;
			word-break: keep-all;
			   
			&>uni-text {
				font-size: inherit;
				color: inherit;
				line-height: 1;
				& > *{
					line-height: 1;
					vertical-align: middle;
				} 		
			}
		}
		&__text{
			display: inline-block;
			padding: 0 10upx;
			vertical-align: middle;
		}
		
		&__text--is-no-gap{
		  padding: 0 10upx 0 0;
		}
		
		&__splitor{
			display: inline-block;
			vertical-align: middle;
		}

		&__gap {
			margin-top: 20upx;
		}

		&__strong {
			font-size: 32upx;
			color: #000F21;
			letter-spacing: 0;
			line-height: 36upx;
			font-weight: 500;
		}

		&__label {
			font-size: 28upx;
			color: #666666;
			line-height: 40upx;
		}

		&__value {
			font-size: 28upx;
			color: #41444C;
			line-height: 40upx;
		}
       &__icons{
		   align-self: center;
		   width: 28upx;
		   height: 28upx;
		   margin-left: 10upx;
	   }   
		&__arrow {
			position: absolute;
			width: 16upx;
			height: 16upx;
			right: 35upx;
			top: 60upx;
			transform: rotate(45deg);
			border-top: 1px solid #565656;
			border-right: 1px solid #565656;
		}
        
		&__line-blank{
			display: inline-block;
			width: 20upx;
	 	}
	    &__divider{
			height: 30upx;
			width: 2upx;
			background: #EEEEEE;
			border-radius: 4upx;
		}
		&__btn {
			flex: 1 0 auto;
			/deep/ .ray-button {
				&::after {
					border: none !important;
				}
			}
		}
	}
</style>
