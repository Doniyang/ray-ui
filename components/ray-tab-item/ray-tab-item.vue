<!--  -->
<template>
	<view class="ray-tab-item" :class="{'ray-tab-item--is-actived':isActived}" @tap="handleClick" :id="`TAB_ITEM_${value}`">
		<slot>{{label}}</slot>
	</view>
</template>

<script>
	export default {
		name:"ray-tab-item",
		props:{
			value:{
				type:[String,Number],
				default:0,
				required:true
			},
			label:{
				type:String,
				default:""
			}
		},
		inject:{
			register:{
				default:null
			},
			updateChildrenActivedState:{
				default:null
			}
		},
		data() {
			return {
			   isActived:false	
			};
		},
		created() {
			if(this.register){this.register(this.updateActivedState)}
		},
		methods:{
		    updateActivedState(name){
			   this.isActived = this.value === name 	
			},
			handleClick(){
			   if(!this.isActived && this.updateChildrenActivedState){
				   this.updateChildrenActivedState(this.value,true)
			   } 	
			}
		}
	}
</script>

<style lang="scss">
.ray-tab-item{
	position: relative;
	flex:1 0 auto;
	min-width: 90upx;
	text-align: center;
	font-size: 28upx;
	padding: 20upx 40upx;
	overflow: hidden;
	&.ray-tab-item--is-actived{
		font-weight: bold;
		color: #00A32E;
		transition: color 300ms ease;
		&::after{
			content: "";
			position: absolute;
			width: 90upx;
			height: 6upx;
			background-color: #00A32E;
			left: 50%;
			bottom: 0;
			transform: translate(-50%,0);
			transition: all 300ms ease;
		}
	}
}
</style>