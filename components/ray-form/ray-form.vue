<template>
	<form class="component ray-form" @submit="onFormSubmit" @reset="onFormReset">
		<slot></slot>
	</form>
</template>

<script>
	export default {
		name:"ray-form",
		/**
		 * 属性定义
		 */
		props:{
			/**
			 * form数据
			 */
			formData:{
				type:Object
			}
		},
		/**
		 * 组件的provide
		 */
		provide(){
			return {
				getFormData:this.getFormFieldData,
				register:this.updateValidChildren,
				unregister:this.delValidChildren
			}	
		},
		data() {
			return {
				validChildren:[],
				isPrending:false
			};
		},
		methods:{
			onFormSubmit(e){
				if(!this.isPrending){
					this.isPrending = true
					if(this.validator()){this.$emit('submit',e)}
					setTimeout(()=>{ this.isPrending = false},600)
				}
			},
			onFormReset(e){
					this.reset()
					this.$emit('reset',e)
			},
			updateValidChildren(children){
				this.validChildren.push(children)
			},
			delValidChildren(uuid){
			   	this.validChildren = this.validChildren.filter(vm=>vm.isDiffConponent(uuid))
			},
			getFormFieldData(key){
				return key ? this.formData[key]:this.formData;
			},
			validator(){
				return this.validChildren.map(vm=>vm.validator()).every(flag=>flag===true)
			},
			resetValid(){
				this.validChildren.forEach(vm=>{
					vm.resetValid()
				})
			},
			reset(){
				this.resetValid()
			}
		}
	}
</script>

<style lang="scss" scoped>
.component.ray-form{
	display: block;
	padding: 0  0 10upx;
	margin: 0;
	background: #FFFFFF;
}
</style>
