<template>
	<view v-if="visible" class="component aui-popup" @touchmove.stop.prevent="onTouchMove">
		<view class="aui-popup__mask" :class="['aui-mask--is-'+type,{'aui-wrap-ani': animation }]" v-if="maskable" @click.stop="onClose"/>
		<view class="aui-popup__wrap" :class="['aui-popup__wrap--is-'+type,'aui-wrap-ani--is-'+type,{'aui-wrap-ani': animation}]">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'aui-popup',
		props: {
			// 开启动画
			animation: {
				type: Boolean,
				default: true
			},
			// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
			type: {
				type: String,
				default: 'center',
				validator(v){ return ['top','bottom','center'].includes(v) }
			},
			//是否显示阴影
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
			}
		},	
		methods: {
			onTouchMove(e){
				return false
			},
			onClose(){
				if(this.closeOnMaskClick){
					this.$emit('close')
					this.$emit('update:visible',false)
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
.component.aui-popup{
	position: fixed;
	/* #ifdef H5 */
	top: var(--window-top);
	/* #endif */
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	bottom: 0;
	left: 0;
	right: 0;
	overflow: hidden;
	z-index: 2023;
	
	.aui-popup__mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,0.28);
		opacity: 0;
	}
	
	.aui-popup__wrap {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
	}
	
    .aui-popup__wrap--is-top {
		top: 0;
		left: 0;
		right: 0;
		transform: translateY(-500px);
	}
	
	.aui-popup__wrap--is-bottom {
		bottom: 0;
		left: 0;
		right: 0;
		transform: translateY(500px);
	}
	
	.aui-popup__wrap--is-center {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		bottom: 0;
		left: 0;
		right: 0;
		top: 0;
		justify-content: center;
		align-items: center;
		transform: scale(1.2);
		opacity: 0;
	}
	
	.aui-wrap-ani {
		transition-property: transform, opacity;
		transition-duration: 0.2s;
	}
	
	
	.aui-wrap-ani--is-top {
		transform: translateY(0);
	}
	
	.aui-wrap-ani--is-bottom {
		transform: translateY(0);
	}
	
	.aui-wrap-ani--is-center {
		transform: scale(1);
		opacity: 1;
	}
	.aui-mask-ani {
		transition-property: opacity;
		transition-duration: 0.2s;
	}
	
	.aui-mask--is-top {
		opacity: 0.5;
	}
	
	.aui-mask--is-bottom {
		opacity: 0.5;
	}
	
	.aui-mask--is-center {
		opacity: 0.5;
	}		
}
</style>
