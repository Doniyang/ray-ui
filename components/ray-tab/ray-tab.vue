<!---->
<template>
	<scroll-view scroll-x="true" class="component ray-tab" :scroll-into-view="`TAB_ITEM_${value}`" scroll-with-animation>
		<view class="ray-tab-wrap">
			<view class="ray-tab-holder"></view>
			<slot></slot>
			<view class="ray-tab-holder"></view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name:"ray-tab",
		model:{
			event:'change'
		},
		props:{
			value:{
				type:[String,Number],
				default:0
			}
		},
		provide(){
			return {
				register:this.updateChildren,
				updateChildrenActivedState:this.updateChildrenActived
			}
		},
		data() {
			return {
			  children: []	
			}
		},
		mounted() {
		  this.$nextTick(()=>{
			 this.updateChildrenActived(this.value,false) 
		  })	
		},
		watch:{
			value(nv,ov){
				if(nv!==ov){this.updateChildrenActived(nv,false)}
			}
		},
		methods:{
		   updateChildren(fn){
			 this.children.push(fn)  
		   },
		   updateChildrenActived(name,isActived){
			 this.children.forEach(fn=>{
				 if(typeof fn === 'function'){fn.apply(this,[name])}
			 })
			 if(isActived){this.$emit("change",name)}	
		   }
		}
	}
</script>

<style lang="scss">
    .component.ray-tab{
		white-space: nowrap;
		background: #FFFFFF;
		.ray-tab-holder{
			width: 30upx;
		}
	    .ray-tab-wrap{
			min-width: calc(100vw);
			position: relative;
			display: flex;
			flex-wrap: nowrap;
		} 	
	}    
</style>