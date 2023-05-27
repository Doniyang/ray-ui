<template>
	<view class="component ray-card" :class="{'ray-card--is-flat':flat}">
		<view class="ray-card__header">
			<slot name="header"></slot>
		</view>
		<view class="ray-card__body">
			<slot></slot>
		</view>
		<view class="ray-card__footer">
			<slot name="footer"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"ray-card",
		props:{
			flat:{
				type:Boolean,
				default:false
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-card{
   position: relative;	
   box-sizing: border-box;
   background: #FFFFFF;
   box-shadow: 0 0 10upx 0 rgba(0,0,0,0.04);
   border-radius: 20upx;
  
   &.ray-card--is-flat{
	   box-shadow: none;
   }
   
   &__header{
	   min-height: 0;
	   border-top-left-radius: 20upx;
	   border-top-right-radius: 20upx;
   }
   
   &__body{
	   min-height: 0;
	   background-color: #F2FFF7;
   }
   
   &__footer{
	   min-height: 0;
	   border-bottom-left-radius: 20upx;
	   border-bottom-right-radius: 20upx;
   } 
}	
</style>
