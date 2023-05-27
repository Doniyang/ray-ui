<template>
	<view class="component aui-switch" :class="{'is-checked': isCkecked}" @click.stop="handleClick">
		<view class="aui-switch__item">{{checkedLabel}}</view>
		<view class="aui-switch__item">{{uncheckLabel}}</view>
		<view class="aui-switch__slider" :class="[isCkecked? 'is-checked':'is-unchecked']"></view>
	</view>
</template>

<script>
	import AuiField from '../aui-field/aui-field.vue'
	export default {
		name:"aui-switch",
		extends: AuiField,
		model: { event:"change" },
		data(){
			return{
				isCkecked:false,
			}
		},
		props:{
			disabled:{
				type:Boolean,
				default:false
			},
			checkedLabel:{
				type:String,
				default:'是'
			},
			uncheckLabel:{
				type:String,
				default:'否'
			},	
			checkedValue:{
				type:String,
				default:'Y'
			},
			uncheckValue:{
				type:String,
				default:'N'
			},
			checked:{
				type:Boolean,
				default:false
			},
			value:{
				type:String,
				default:'N'
			}
		},
		inject:{
			validate:{
				default:null
			}
		},
		watch:{
			checked(nv,ov){
				if(nv!=ov){ this.isCkecked = nv }
			},
			value(nv,ov){
				if(nv!==ov){this.updateSelectionState(nv,true)}
			}
		},
		methods:{
			/**
			 * 更新checked状态
			 * @param {String} vale
			 */
			updateSelectionState(vale,flag){
				this.isCkecked = vale ==this.checkedValue ? true:false; 
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			/**
			 * 点击事件
			 * @param {Object} e
			 */
			handleClick(e){
				if(this.disabled) return;
				this.updateFieldDirtyState(true)
				this.isCkecked =!this.isCkecked;
				this.$emit('change',this.isCkecked?this.checkedValue: this.uncheckValue);
			}
		},
		beforeMount() {
			this.isCkecked = this.checked
			this.updateSelectionState(this.value,false)
		}
	}
</script>

<style lang="scss" scoped>
	.aui-switch{
		width: 100upx;
		height: 50upx;
		border-radius: 30upx;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #CCCCCC;
	    &.is-checked{
			background-color: #00A73D;
		}
	   
	   &__item{
		   width: 50%;
		   color: #FFFFFF;
		   font-size: 24upx;
		   line-height: 50upx;
		   text-align: center;
		   overflow: hidden;
	   }
	  &__slider{
			 width: 46upx;
			 height: 46upx;
			 border-radius: 50%;
			 background-color:#FFFFFF;
			 position: absolute;
			 top:2upx;
			 transition:all .3s;
			 
			 &.is-unchecked{
				 left:2upx;
			 }
			 
			 &.is-checked{
				 right: 2upx;
			 }
	  }
	}
</style>
