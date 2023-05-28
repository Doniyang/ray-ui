<template>
	<input class="component ray-input"
	            placeholder-class="ray-input-placeholder" 
	            :type="type"
	            :disabled="isDisabled"
				:class="{ 'ray-input--is-disabled' : disabled }"
				:focus="focus" 
				:placeholder="placeholder"
				:value="fmtValue"  
				@input="onInput"  
				@blur="onBlur" 
				@focus="onFocus"/>
</template>

<script>
	import ToolKit from '../../src/toolkit/toolkit.js'
	import RayField from "../ray-field/ray-field.vue"
	export default {
		name:"ray-input",
		extends:RayField,
		props:{
			type:{
				type:String,
				default:'text',
				validator(v){return ['text','number','digit','idcard'].indexOf(v)>-1}
			},
			focus: {
				type: Boolean,
				default: false
			},
			value:{
				type:[Number,String],
				default:''
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			disabled:{
				type:Boolean,
				default:false
			},
			readonly:{
				type:Boolean,
				default:false
			},
			formator:{
				type: [Function,String],
				default(v){return v}
			},
			reset:{
				type:Function,
				default(v){return v}
			},
		},
		inject:{
			validate:{
				default:null
			}
		},
		data(){
			return {
				fmtValue:''
			}
		},
		computed:{
			isDisabled(){
				return this.readonly||this.disabled
			}
		},
		mounted() {
			this.updateFieldValue(this.value,false)
		},
		watch:{
			value(nv,ov){
				if(nv!==ov) this.updateFieldValue(nv,true)
			}
		},
		methods:{
			/**
			 * @param {Object} val
			 * @param {Object} flag
			 */
			updateFieldValue(val,flag){
				this.fmtValue = this.formator(val)
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			onInput(evt){
			   let val = ToolKit.isFunction(this.reset)?this.reset(evt.detail.value):evt.detail.value
			   this.$emit('input',val)
			},
			onFocus(e){
				this.updateFieldDirtyState(true)
				this.$emit('focus', e)
			},
			onBlur(e){
				this.$emit('blur', e)
				this.fireFieldValidate(this.validate,'blur')
			}
		}
	}
</script>

<style lang="scss" scoped>
.component.ray-input {
	flex: 1;
	box-sizing: border-box;
	text-align: right;
	font-size: 30upx;
	color: #000F21;
	width: 100%;
	
	&.ray-input--is-disabled {
		color: #999999;
	}
	
	.ray-input-placeholder {
	   font-size: 30upx;
	}
}
</style>
