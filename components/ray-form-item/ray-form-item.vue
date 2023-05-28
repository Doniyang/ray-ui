<template>
	<view class="component ray-form-item">
		<view :class="wrapClass">
			<view class="ray-form-item--is-prefix">
				<slot name="prefix"></slot>
			</view>
			<view class="ray-form-item-label-wrap" :class="labelClass">
				<slot name="label">{{label}}</slot>
			</view>
			<view class="ray-form-item-input-wrap" :class="fieldClass">
				<slot></slot>
			</view>
			<view class="ray-form-item--is-suffix">
				<slot name="suffix"></slot>
			</view>
		</view>
		<slot name="error.message">
			<view class="ray-form-item-msgbox" v-if="invalid">
				<text class="ray-form-item-tip">*</text>
				<text class="ray-form-item-tip">{{ errMsg }}</text>
			</view>
		</slot>	
		<view class="ray-form-item-divider" :class="{'ray-form-item--has-error': invalid }"></view>
	</view>
</template>

<script>
	import ToolKit from "../../src/toolkit/toolkit.js"
	export default {
		name:"ray-form-item",
		props:{
			wrapClass:{
				type:[String,Object,Array],
				default:'ray-form-item-wrap'
			},
			fieldClass:{
				type:[String,Object,Array],
				default:''
			},
			labelClass:{
				type:[String,Object,Array],
				default:''
			},
			label:{
				type:String
			},
			prefix:{
				type:String
			},
			suffix:{
				type:String
			},
			prop:{
				type:String,
				required:true
			},
			rules:{
				type:Array,
				default:()=>[]
			},
			required:{
				type:Boolean,
				default:false
			},
			validState:{
				type:[String,Number,Boolean],
				default:false
			}
		},
		inject:{
			getFormData:{
				default:null
			},
			register:{
				default:null
			},
			unregister:{
				default:null
			}
		},
		provide(){
			return {
				validate:this.validator
			}		
		},
		data() {
			return {
				msgList:[],
				invalid:false,
				valid:false,
				uuid:null
			};
		},
		computed:{
			errMsg(){
				return this.msgList.length>0?this.msgList[0].msg : ''
			}
		},
		created() {
			this.uuid = (Math.random()*0x10).toString(32).substring(6,12).toUpperCase()
		},
		beforeMount() {
			if(this.required){ this.rules.unshift({ required: true })}
		},
		mounted() {
			if(this.rules.length>0 && this.register){
				this.register(this)
			}
		},
		beforeDestroy() {
			if(this.rules.length>0 && this.unregister){
				this.unregister(this.uuid)
			}
		},
		watch:{
			validState(nv,ov){
				if(nv!==ov){
					this.lazyValidateField()
				}
			}
		},
		methods:{
			/**
			 * 不同组件
			 */
			isDiffConponent(uuid){
				return this.uuid !== uuid
			},
			/**
			 * 校验
			 */
			lazyValidateField(){
			    let rs = this.validator('change')
				this.$emit('update:validState',rs)	
			},
			/**
			 * [{required:true,message:'xhhxh'},{pattern:/ggsgsg/,message:'shshhs'},{custom(val,form){},message:'sssh' }]
			 * @param {Object} trigger
			 */
			validator(trigger){
				let tempMsgList = []		
				this.rules.filter(a=>a.trigger===undefined||a.trigger.indexOf(trigger)>-1).forEach(rule=>{
					let value = ToolKit.isFunction(this.getFormData) ? this.getFormData(this.prop) : ''
					if(rule.required){
						tempMsgList.push({valid: value==null || value ==undefined || value.length===0,msg: rule.message || this.label+'是必填项'})
					}
					if(rule.pattern){
						let reg = new RegExp(rule.pattern)
						tempMsgList.push({valid:reg.test(value)?false:true,msg:rule.message||this.label+'格式不正确'})
					}
					if(rule.custom){
						tempMsgList.push({valid:rule.custom.apply(this,[value,this.getFormData()]),msg:rule.message})
					}
				})
				this.msgList = tempMsgList.filter(item=>item.valid)
				this.invalid = this.msgList.length > 0
				this.valid = this.msgList.length === 0
				return this.valid;
			},
			resetValid(){
				this.msgList= []
				this.valid = false
				this.invalid = false
			}
		}
	}
</script>

<style lang="scss" scoped>
.component.ray-form-item{
	position: relative;
	padding: 0 30upx;
	&:nth-last-child(1){
	    .ray-form-item-divider:not(.ray-form-item--has-error){
			display: none;
		} 
	}
	
	
	.ray-form-item-wrap{
		display: flex;
		align-items: center;
		overflow: hidden;
		min-height: 100upx;
	}
	.ray-form-item-label-wrap{
		display: flex;
		align-items: center;
		width: auto;
	}
	.ray-form-item-input-wrap{
		flex: 1;
		max-width: calc(100%);
		position: relative;
		padding: 0 0 0 30upx;
	}
	
	.ray-form-item-msgbox{
		position: absolute;
		bottom: 0;
		right: 30upx;
	}
	.ray-form-item-tip{
		color: #FF0000;
		font-size: 20upx;
		line-height: 20upx;
	}
	.ray-form-item-divider{
		position: absolute;
		left: 20upx;
		right: 20upx;
		bottom: 0;
		height: 1px;
		transform: scaleY(0.5);
		background-color:  #E6E6E6;
		&.ray-form-item--has-error{
			background-color: #FF7474;
		}
	}
}	

</style>
