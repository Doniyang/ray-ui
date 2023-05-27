<template>
	<view class="component ray-avatar">
		<view class="ray-avatar__wrap" :class="{'ray-avatar--is-no-img':isNoImage}" :style="avatarStyle" @click.stop="onViewClick">
			<text v-if="isNoImage">{{alt}}</text>
			<image :src="src" mode="aspectFit" class="ray-avatar__img" v-else></image>
		</view>
		<view class="ray-avatar__view-wrap" v-if="isVisible" @click.stop="onClose">
			<view class="ray-avatar__view-header">
				<view class="ray-avatar__view-header_wrap">
					<view class="ray-avatar__view-close-box" @click.stop="onClose">
						<view class="ray-avatar__view-header_close">
							<span class="ray-avatar__view-close-icon is-top"></span><span class="ray-avatar__view-close-icon is-bottom"></span>
						</view>
					</view>
				</view>
			</view>
			<view class="ray-avatar__view-main">
				<image :src="src" mode="widthFix"></image>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "ray-avatar",
		props: {
			alt: {
				type: String,
				default: ''
			},
			src: {
				type: String,
				default: ''
			},
			size: {
				type: [String, Number],
				default: 116
			}
		},
		data() {
			return {
				isVisible: false
			}
		},
		computed: {
			isNoImage() {
				return (!this.src)
			},
			avatarStyle() {
				return {
					width: isNaN(this.size) ? this.size : (this.size + "upx"),
					height: isNaN(this.size) ? this.size : (this.size + "upx")
				}
			}
		},
		methods: {
			onViewClick(e) {
				if(this.isNoImage) {
					return false
				}
				this.isVisible = true
			},
			onClose(e){
				this.isVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ray-avatar {
		&__wrap {
			margin: 0;
			padding: 0;
			display: inline-flex;
			text-align: center;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			white-space: nowrap;
			position: relative;
			width: 64upx;
			height: 64upx;
			vertical-align: middle;
			font-size: 1.6em;
			font-weight: 600;
			border-radius: 100%;
			border: 4upx solid rgba(185, 185, 185, 0.37);
			background-color: #DCE2E9;

			&.ray-avatar--is-no-img {
				background-color: #1FB18D;
			}
		}

		&__img {
			width: 100%;
			height: 100%;
			border-radius: 100upx;
			overflow: hidden;
		}

		&__view-wrap {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 2024;
			background-color: rgba(0,0,0,0.78);
		}

		&__view-header {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: 150upx;
		}
         
		&__view-header_wrap{
			height: 150upx;
			width: 100%;
			position: relative;
			display: flex;
			align-items: center;
			border-top: 50upx solid transparent;
		}	
        &__view-close-box{
			display: flex;
			width: 45upx;
			height: 45upx;
			align-items: center;
			margin-left: 40upx;
		}
		
		&__view-close{
			height: 0;
			position: relative;
		}
		&__view-close-icon{
			position: absolute;
			display: inline-block;
			width: 24upx;
			height: 4upx;
			background-color: #FFFFFF;
			transform-origin: 0 50%;
			&.is-top{
				transform: rotate(45deg);
			}
			
			&.is-bottom{
				transform: rotate(-45deg);
			}
		}
		
		
			  
		&__view-main {
			height: calc(100vh - 150upx);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
