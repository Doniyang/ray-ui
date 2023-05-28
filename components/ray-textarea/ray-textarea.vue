<template>
	<view class="component ray-textarea" :class="{'ray-textarea--is-flat': flat}">
		<textarea  class="ray-textarea-field"
		                 placeholder-class="ray-textarea-placeholder"  
		                 :class="{'is-auto-height':autoHeight,'is-disabled':disabled}" 
						 :auto-height="autoHeight"
						 :maxlength="maxlength" 
						 :disabled="isDisabled" 
						 :placeholder="placeholder" 
						 :value="value" 
						 :focus="focus" 
						 @blur="handleBlur"
						 @input="handleInput"
						 @focus="handleFocus" />
			<view class="ray-textarea-tips" v-if="tip">
				<span style="color: #E26E1F;">{{ value.length }}</span>
				<span>{{'/'+maxlength+'字'}}</span>
			</view>			 
	</view>
</template>

<script>
	import RayField from "../ray-field/ray-field.vue"
	export default {
		name:"ray-textarea",
		extends:RayField,
		props:{
			maxlength: {
				type: [String, Number],
				default: 256
			},
			value: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			readonly:{
				type:Boolean,
				default:false
			},
			autoHeight: {
				type: Boolean,
				default: false
			},
			focus: {
				type: Boolean,
				default: false,
			},
			//提示
			tip: {
				type: Boolean,
				default: true,
			},
			//扁平化--去除边框
			flat: {
				type: Boolean,
				default: false
			}
		},
		inject:{
			validate:{
				default:null
			}
		},
		computed:{
			isDisabled(){
				return this.disabled || this.readonly || this.value.length > this.maxlength
			}
		},
		watch:{
			value(nv,ov){
				if(nv != ov) this.fireFieldValidate(this.validate,'change')
			}
		},
		methods: {
			handleBlur(e) {
				this.$emit('blur', e)
				this.fireFieldValidate(this.validate,'blur')
			},
			handleInput(e) {
				this.$emit('input',e.detail.value)
			},
			handleFocus(e) {
				this.updateFieldDirtyState(true)
				this.$emit('focus', e);
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-textarea{
	position: relative;
	padding: 20upx;
	margin:1px;
	box-sizing: border-box;
	&.ray-textarea--is-flat{
		padding: 10upx 0upx;
	}
	&:not(.ray-textarea--is-flat)::before {
		position: absolute;
		content: "";
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		border: 1px solid #E6E6E6;
		border-radius: 20upx;
		transform: scale(.5, .5);
		transform-origin: 0 0;
	}
	.ray-textarea-placeholder{
		color:rgba(153,153,153,1);
		font-size:30upx
	}
	
	.ray-textarea-tips{
		text-align: right;
		line-height: 20upx;
		font-size: 20upx;
		color: #999999;
	}
	
	.ray-textarea-field {
		width: 100%;
		min-height: 100upx;
		margin: 0;
		padding: 0 0 30upx;
		font-size: 30upx;
		overflow: hidden;
		text-align: left;
	
		&.is-auto-height {
			min-height: 30upx;
			padding: 0;
			height: auto;
		}
	
		&.is-disabled {
			color: #999999;
		}
	}
}
</style>
