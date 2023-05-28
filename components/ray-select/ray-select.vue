<template>
	<view class="component ray-select">
		<view class="ray-select__wrap" @click.once="onTapClick">
			<picker class="ray-select__picker" @change="onPickerChange" mode="selector" :value="selectedIndex" :range="selectOptionList"  :disabled="isDisabled">
				 <slot name="header">
					 <input  disabled placeholder-class="ray-select-placeholder"  class="ray-select__selection" :placeholder="placeholder" :value="selection" :class="{'ray-select__selection--is-disabled':disabled}"/>
				 </slot> 
			</picker>
			<image v-if="!isDisabled"  class="ray-select-icon" src="./icon/right.svg" mode="aspectFit"></image>
		</view>
		<slot :selection="selection" v-if="breakLine"></slot>
	</view>
</template>

<script>
	import RayField from "../ray-field/ray-field.vue"
	export default {
		name:"ray-select",
		extends: RayField,
		model:{ event: 'change' },
		props:{
			value:{
				type:[String,Number],
				default:''
			},
			picker:{
				type:Array,
				default:()=>[],
				required: true
			},
			disabled:{
				type:Boolean,
				default:false
			},
			readonly:{
				type:Boolean,
				default:false
			},
			placeholder:{
				type:String,
				default:'请选择'
			},
			breakLine:{
				type:Boolean,
				default:false
			},
			itemKey:{
				type:String,
				default:'key'
			},
			itemValue:{
				type:String,
				default:'val'
			}
		},
		inject:{
			validate:{
				default:null
			}
		},
		data() {
			return {
				selectedIndex: -1,
				selectOptionList:[]
			};
		},
		computed:{
			selection(){
				return this.picker.length && this.selectedIndex>0 ? this.picker[Math.max(this.selectedIndex-1,0)][this.itemValue] : ''
			},
			isDisabled(){
				return this.disabled || this.readonly
			}
		},
		beforeMount() {
			this.initSelectOptionList()
		},
		watch:{
			picker:{
				handler(val){ this.initSelectOptionList()},
				deep:true
			},
			value(nv,ov){
				if(nv!==ov){this.updateSelectionIndex(nv,true)}
			}
		},
		methods:{	
			/**
			 * 初始化选择项
			 */
			initSelectOptionList(){
				this.selectOptionList = ['请选择',this.picker.map(item=>item[this.itemValue])].flat()
				this.updateSelectionIndex(this.value,false)
			},
			/**
			 * 点击事件
			 * @param {Object} e
			 */
			onTapClick(e){
				this.updateFieldDirtyState(true)
			},
			/**
			 * @param {val} v
			 */
			updateSelectionIndex(v,flag){
				this.selectedIndex = this.picker.findIndex(item=>item[this.itemKey] ===  v) + 1
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			/**
			 * picke组件只改变
			 * @param {Object} e
			 */
			onPickerChange(e){
				this.selectedIndex = e.detail.value
				let code = this.selectedIndex >0 ?this.picker[Math.max(this.selectedIndex-1,0)][this.itemKey]:'' 
				this.$emit('change', code)
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-select{
    position: static;
	&__wrap{
		display: flex;
		align-items: center;
	}
	
	&__picker{
		flex: 1;
		width: 100%;
	}
	&-placeholder{
		color:rgba(153,153,153,1);
		font-size:30upx
	}
	&-icon{
		height: 30upx;
		width: 30upx;
	}
	&__selection{
		text-align: right;
		font-size: 30upx;
		color: #000F21;
		&--is-disabled{
			color: #999999;
		}
	}
}
</style>
