<template>
	<view class="component ray-form-detail">
		<template v-for="(field,dx) in fieldList">
			<ray-cell :label="field.label" divider :key="dx" v-if="showFormItem(field.linkage,field.show)">
				<text>{{dataItem[field.key] | rawStringFilter(field.formator) }}</text>
				<template v-slot:extra>
					<ray-button v-if="field.bValue" size="mini" :block="false" class="ray-form-detail--suffix-btn" @click.stop="onExtraBtnClick(field)">{{field.bValue}}</ray-button>
				</template>
			</ray-cell>
		</template>
	</view>
</template>

<script>
	import RayCell from '../ray-cell/ray-cell.vue'
	import RayButton from '../ray-button/ray-button.vue'
	import ToolKit from '../../src/toolkit/toolkit.js'
	import { money, percent, selection, phone } from "../../src/formater/formater.js"
	export default {
		name:"ray-form-detail",
		components:{ RayCell,RayButton },
		props:{
			options:{
				type:Array,
				default:()=>[]
			},
			dataItem:{
				type:Object,
				default:()=>({})
			}
		},
		filters:{
			rawStringFilter(str,formater) {
				return  formater(str) || '--'
			}
		},
		data() {
			return {
				fieldList:[]
			};
		},
		beforeMount() {
		   this.updateFieldList(this.options)	
		},
		methods:{
			/**
			 * @param {Object} data
			 * @param {Array<Object>} cfgList
			 */
			updateFieldList(cfgList){
			   this.fieldList = cfgList.map(cfg=>this.updateCfgItem(cfg))	
			},
			/**
			 * 更新配置
			 * @param {Object} cfg
			 */
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
			/**
			 * @param {Object} linkage
			 * @param {Boolean} flag
			 */
			showFormItem(linkage,flag){
				if(Array.isArray(linkage)) { return linkage.some(o => this.isAllIn(o,this.dataItem))}
				if(ToolKit.isPlainObject(linkage)) { return this.isAllIn(linkage,this.dataItem) }
				return ToolKit.isBoolean(flag) ? flag : true
			},
			/**
			 * 判断是否在data中
			 * @param {Object} o
			 * @param {Object} data
			 */
			isAllIn(o,data){
				return Object.keys(o).every(key => ToolKit.ensure(o[key]).includes(data[key]))
			},
			/**
			 * 按钮点击
			 * @param {Object} item
			 */
			onExtraBtnClick(item){
				this.$emit('click:extra',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-form-detail{
	display: block;
	padding: 0  30upx 10upx;
	margin: 0;
	background: #FFFFFF;
}
.ray-form-detail--suffix-btn{
	vertical-align: middle;
	border-radius: 40upx;
	background-color: #E5F9E5;
	color: #00A73D;
	margin-left: 10upx;
	
	&::after {
		border: none !important;
	}
}
</style>
