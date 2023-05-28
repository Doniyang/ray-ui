<template>
	<input type="text" 
	            placeholder-class="ray-number-placeholder" 
				class="component ray-number"
		        :class="{ 'ray-number--is-disabled' : disabled }" 
				:placeholder="placeholder"
				:maxlength="maxlength"
		        :disabled="isDisabled" 
				:focus="focus"
				v-model="word"
				@blur="onFieldBlur" 
				@focus="onFieldFocus" 
				@input="onFieldInput" />
</template>

<script>
	import ToolKit from "../../src/toolkit/toolkit.js"
	import RayField from "../ray-field/ray-field.vue"
	export default {
		name: "ray-number",
		extends: RayField,
		props: {
			focus: {
				type: Boolean,
				default: false
			},
			maxlength: {
				type: [String, Number],
				default: 140
			},
			disabled: {
				type: [String, Boolean],
				default: false
			},
			readonly:{
				type:Boolean,
				default:false
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			value: {
				type: [String, Number]
			},
			pattern: {
				type: String,
				default: "[^0-9]+"
			},
			formator:{
				type: [Function,String],
				default(v){return v}
			},
			reset:{
				type:Function,
				default(v){return v}
			}
		},
		inject:{
			validate:{
				default:null
			}
		},
		data(){
			return {
				word:''
			}
		},
		computed:{
			isDisabled(){
				return this.readonly||this.disabled
			}
		},
		beforeMount() {
			this.updateFieldText(this.value,false)
		},
		watch:{
			value(nv,ov){
			   if(nv!==ov){
				   this.updateFieldText(nv,true)
			   }
			}
		},
		methods: {
			updateFieldText(text,flag){
				this.word = this.formator(text)
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			onFieldBlur(e) {
				this.$emit('blur', e)
				this.fireFieldValidate(this.validate,'blur')
			},
			onFieldFocus(e) {
				this.updateFieldDirtyState(true)
				this.$emit('focus', e)
			},
			onFieldInput(e) {
				this.$nextTick(()=>{
					const pattern = this.pattern || '[^0-9]+'
					let text = e.detail.value.replace(new RegExp(pattern, 'g'), '')
					this.updateFieldText(text)
					let word = ToolKit.isFunction(this.reset)?this.reset(text):text
					this.$emit('input',word)
				})	
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-number {
	flex: 1;
	box-sizing: border-box;
	text-align: right;
	font-size: 30upx;
	color: #000F21;
	width: 100%;
	
	&.ray-number--is-disabled {
		color: #999999;
	}
	
	.ray-number-placeholder {
		font-size: 30upx;
	}		
}
</style>
