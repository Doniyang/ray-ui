<template>
	<view class="component aui-cell" :class="{'aui-cell--is-divider':divider }">
		<view class="aui-cell__label">
			<slot name="label">{{label}}</slot>
		</view>
		<view class="aui-cell__field">
			<slot>{{value}}</slot>
		</view>
		<view class="aui-cell__extra">
			<slot name="extra"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "aui-cell",
		props: {
			divider:{
				type:Boolean,
				default:false
			},
			label: {
				type: String,
				default: ''
			},
			value: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.aui-cell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 100upx;
			
        &.aui-cell--is-divider{
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 200%;
				height: 200%;
				border-bottom: 1px solid #E6E6E6;
				box-sizing: border-box;
				transform: scale(0.5, 0.5);
				transform-origin: 0 0;
			}
		}
		
		   
		&__label {
			font-size: 30upx;
			line-height: 1;
			color: #303030;
		}

		&__field {
			text-align: right;
			font-size: 30upx;
			flex: 1;
			color: #666666;
		}
		&__extra{
			display: flex;
			align-items: center;
		}
	}
</style>
