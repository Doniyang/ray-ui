<template>
	<ray-popup type="center" animation :visible="isVisible">
		<view class="component ray-dialog">
			<view class="ray-dialog__header">
				<view class="ray-dialog__title">{{title}}</view>
				<view class="ray-dialog__close" @click="onClose">
					<span class="ray-dialog__icon"></span>
					<span class="ray-dialog__icon"></span>
				</view>
			</view>
			<view class="ray-dialog__body">
				<slot></slot>
			</view>
			<view class="ray-dialog__footer">
				<slot name="footer"></slot>
			</view>
		</view>
	</ray-popup>
</template>

<script>
	import RayPopup from '../ray-popup/ray-popup.vue'
	export default {
		name:"ray-dialog",
		components:{ RayPopup },
		props:{
			maskable: {
				type: Boolean,
				default: true
			},
			closeOnMaskClick:{
			   type:Boolean,
			   default:true
			},
			visible: {
				type: Boolean,
				default: false
			},
			title:{
				type:String,
				default:''
			}
		},
		data() {
			return {
			    isVisible:false
			}
		},
		beforeMount() {
		  this.updateDialogState(this.visible)	
		},
		watch:{
			visible(nv,ov){
				if(nv!=ov){
					this.updateDialogState(nv)	
				}
			}
		},
		methods:{
			/**
			 * 更新visible
			 * @param {Object} visible
			 */
			updateDialogState(visible){
				this.isVisible = visible
			},
			/**
			 * 关闭
			 * @param {Object} e
			 */
			onClose(e){
				this.isVisible = false
				this.$emit('close')
				this.$emit('update:visible',false)
			},
			
		}
	}
</script>

<style lang="scss" scoped>
 .ray-dialog{
	background: #FFFFFF;
	box-shadow: 0 0 16upx 0 rgba(0,0,0,0.20);
	border-radius: 14upx;
	border-radius: 14upx;
	overflow: hidden;
	 
	 &__header{
		 position: relative;
		 background: #F4F7FC;
		 border-radius: 14upx 14upx 0 0;
	 }
	 
	 &__title{
		 font-size: 32upx;
		 color: #303030;
		 letter-spacing: 0;
		 text-align: center;
		 line-height: 36upx;
		 padding: 30upx 0;
	 }
	 
	&__close{
		 position: absolute;
		 top: 50%;
		 right: 34upx;
		 min-width: 32upx;
		 min-height: 32upx;
		 transform: translate(0,-50%);
	}
	
	&__icon{
		 position: absolute;
		display: inline-block;
		width: 30upx;
		height: 4upx;
		right: 0;
		top: 50%;
		 margin: -2upx 0 0 -15upx;
		background: #555555;
		transform-origin: center;
		vertical-align: middle;
		
		&:nth-child(1){
			transform: rotate(45deg);
		}
		&:nth-child(2){
			transform: rotate(-45deg);
		}
	}
	 
	 &__body{
		 padding: 30upx;
	 }
	 &__footer{
		 min-height: 0;
	 }
 }
</style>
