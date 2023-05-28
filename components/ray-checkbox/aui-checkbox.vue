<template>
   <checkbox-group class="component ray-checkbox" @change="onChange">
	   <view class="ray-checkbox__wrap">
	   	  <view class="ray-checkbox__item" v-for="(opt,dx) in picker" :key="dx">
	   	  	<checkbox :value="opt[itemKey]" :checked="isCheckboxChecked(opt[itemKey])" :disabled="disabled" color="#00A73D" class="ray-checkbox__field"/><text class="ray-checkbox__txt">{{opt[itemValue]}}</text>
	   	  </view>
	   </view>
   </checkbox-group>
</template>
<script>
	import RayField from "../ray-field/ray-field.vue"
	import ToolKit from '../../src/toolkit/toolkit.js'
	export default {
		name:"ray-checkbox",
		extends: RayField,
		model:{event:'change'},
		props:{
			picker:{
			  type:Array,
			  default:()=>[]
			},
			itemKey:{
			  type:String,
			  default:'key'
			},
			itemValue:{
			  type:String,
			  default:'val'
			},
			value:{
			  type:Array,
			  default:()=>[]
			},
			disabled:{
			  type:Boolean,
			  default:false
			}
		},
		inject:{
			validate:{
				default:null
			}
		},
		data() {
			return {
				chkList:[]
			};
		},
		beforeMount() {
		   this.updateCheckboxSelection(this.value,false)
		},
		watch:{
			value(nv,ov){
				if(!this.isSameArray(nv,ov)){ this.updateCheckboxSelection(nv,true) }
			}
		},
		methods:{
			/**
			 * 比较两个数组
			 * @param {Object} ary
			 * @param {Object} bry
			 */
			isSameArray(ary,bry){
				return ToolKit.ensure(ary).every(a=>ToolKit.ensure(bry).includes(a)) && ToolKit.ensure(bry).every(b=>ToolKit.ensure(ary).includes(b))
			},
			/**
			 * 更新checkbox值
			 * @param {Object} val
			 * @param {Object} flag
			 */
			updateCheckboxSelection(val,flag){
				this.chkList = val
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			/**
			 * checked  or not
			 * @param {Object} value
			 */
			isCheckboxChecked(value){
				return this.chkList.includes(value)
			},
			/**
			 * checkbox的change事件
			 * @param {Object} e
			 */
			onChange(e){
				this.chkList = e.detail.value
				this.updateFieldDirtyState(true)
				this.$emit('change', e.detail.value)
			}
		}
}
</script>

<style lang="scss" scoped>
.ray-checkbox{
	&__wrap{
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		justify-content: flex-end;
		overflow: hidden;
	}
	&__item{
		width: auto;
		overflow: hidden;
		white-space: nowrap;
		&+&{
			margin-left: 30upx;
		}
	}
	&__field{
		transform: scale(0.75);
		transform-origin: center;
	}
	&__txt{
		font-size: 30upx;
		display: inline-block;
		line-height: 1.25;
		padding-left:10upx;
		vertical-align: middle;
	}
}

/deep/uni-checkbox .uni-checkbox-input-checked{
	background-color: currentColor;
}
</style>
