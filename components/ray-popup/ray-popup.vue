<template>
	<view v-if="visible" class="component ray-popup" @touchmove.stop.prevent="onTouchMove">
		<view class="ray-popup__mask" :class="['ray-mask--is-'+type,{'ray-wrap-ani': animation }]" v-if="maskable" @click.stop="onClose"/>
		<view class="ray-popup__wrap" :class="['ray-popup__wrap--is-'+type,'ray-wrap-ani--is-'+type,{'ray-wrap-ani': animation}]">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ray-popup',
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
.component.ray-popup{
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
	
	.ray-popup__mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,0.28);
		opacity: 0;
	}
	
	.ray-popup__wrap {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
	}
	
    .ray-popup__wrap--is-top {
		top: 0;
		left: 0;
		right: 0;
		transform: translateY(-500px);
	}
	
	.ray-popup__wrap--is-bottom {
		bottom: 0;
		left: 0;
		right: 0;
		transform: translateY(500px);
	}
	
	.ray-popup__wrap--is-center {
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
	
	.ray-wrap-ani {
		transition-property: transform, opacity;
		transition-duration: 0.2s;
	}
	
	
	.ray-wrap-ani--is-top {
		transform: translateY(0);
	}
	
	.ray-wrap-ani--is-bottom {
		transform: translateY(0);
	}
	
	.ray-wrap-ani--is-center {
		transform: scale(1);
		opacity: 1;
	}
	.ray-mask-ani {
		transition-property: opacity;
		transition-duration: 0.2s;
	}
	
	.ray-mask--is-top {
		opacity: 0.5;
	}
	
	.ray-mask--is-bottom {
		opacity: 0.5;
	}
	
	.ray-mask--is-center {
		opacity: 0.5;
	}		
}
</style>
