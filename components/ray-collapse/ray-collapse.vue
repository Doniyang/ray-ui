<template>
	<view class="component ray-collapse">
		<slot />
	</view>
</template>
<script>
	export default {
		name: 'ray-collapse',
		props: {
			accordion: {
				// 是否开启手风琴效果
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			return {}
		},
		provide() {
			return {
				collapse: this
			}
		},
		created() {
			this.childrens = []
		},
		methods: {
			onChange() {
				let activeItem = []
				this.childrens.forEach((vm, index) => {
					if (vm.isOpen) {
						activeItem.push(vm.nameSync)
					}
				})
				this.$emit('change', activeItem)
			},
			resize() {
				this.childrens.forEach(vue => {
					vue._getSize()
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ray-collapse {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column
	}
</style>