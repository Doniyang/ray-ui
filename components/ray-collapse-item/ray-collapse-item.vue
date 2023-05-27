<template>
	<view class="component aui-collapse-panel">
		<view class="aui-collapse-panel-header" @tap="handleTap" v-if="!noTitle">
			<image src="./icon/prefix.png" class="aui-collapse-panel-image"></image>
			<view class="aui-collapse-panel-title">{{title}}</view>
			<slot name="extra"></slot>
			<image class="aui-collapse-panel-arrow" :class="{'is-open':isOpened}" src="/static/icon/right.svg"></image>
		</view>
	     <view class="aui-collapse-panel-wrap" v-if="isOpened">
			 <slot></slot>
		 </view>
	</view>
</template>

<script>
	export default {
		name:"aui-collapse-panel",
		props:{
			title:{ type:String },
			noTitle:{
				type:Boolean,
				default:false
			},
			name:{
				type: [String,Number]
			},
			actived:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				isOpened:false,
				uuid:null
			}
		},
		beforeMount() {
			this.updateOpenState(this.actived)
		},
		watch:{
			actived(nv,ov){
				if(nv!==ov){this.updateOpenState(nv)}
			}
		},
		methods:{
			handleTap(){
				this.updateOpenState(!this.isOpened)
				this.$emit('change', this.isOpened)
			},
			updateOpenState(isOpen){
				this.isOpened = isOpen
			}
		}
	}
</script>

<style lang="scss" scoped>
 .aui-collapse-panel{
	position: relative;
	width: 100%;
	
	&-header{
		display: flex;
		width: 100%;
		height: 100upx;
		flex-wrap: nowrap;
		overflow: hidden;
		align-items: center;
		background-image: linear-gradient(179deg, #F3FEF9 1%, #FFFFFF 58%);
	}
	&-image{
		margin:0 20upx 0 30upx;
		width: 32upx;
		height: 32upx;
	}
	
	&-title{
		font-size: 32upx;
		color: #000F21;
		flex: 1;
		font-weight: 500;
	}
	
	&-arrow{
		width: 32upx;
		height: 32upx;
		margin-right: 30upx;
		transition: transform 400ms ease-in-out;
		transform: rotate(0deg);
		&.is-open{
			transform: rotate(90deg);
		}
	}
	
	&-wrap{
		position: relative;
	}
	
}
</style>
