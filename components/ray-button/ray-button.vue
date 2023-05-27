<template>
    <button class="component ray-button" :form-type="formType" :class="btnCls"  :plain="plain" :loading="loading" :disabled="disabled" :type="type" @click="onClick">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name:"ray-button",
		props:{
			type:{
				type: String,
				default:'default',
				validator(v){ return ['default','primary','warn'].includes(v) }
			},
			formType:{
				type:String,
				validator(v){ return ['submit','reset'].includes(v) }
			},
			disabled:{
				type:Boolean,
				default:false
			},
			plain:{
				type:Boolean,
				default:false
			},
			ghost:{
				type:Boolean,
				default:false
			},
			loading:{
				type:Boolean,
				default:false
			},
			size:{
				type: String,
				default:'normal',
				validator(v){return ['mini','small','normal','big','large'].includes(v) }
			},
			block:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				isPrending:false
			}
		},
		computed:{
			btnCls(){
				return ['ray-button__'+this.type,'ray-button--is-'+this.size,{'ray-button--is-block': this.block,'ray-button--is-plain':this.plain,'ray-button--is-ghost':this.ghost } ]
			}
		},
		methods:{
			onClick(e){
				e.stopPropagation()
				if(!this.isPrending){
					this.isPrending = true
					this.$emit('click',e)
					setTimeout(()=>{
						this.isPrending = false
					},500)
				}	
			},
			onTap(e){
				e.stopPropagation()
				if(!this.isPrending){
					this.isPrending = true
					this.$emit('tap',e)
					setTimeout(()=>{
						this.isPrending = false
					},500)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.ray-button{
	display: inline-block;
	
	&.ray-button__default{
		&.ray-button--is-ghost{
			border: none;
		}
	}
	&.ray-button__primary{
		background: #00A73D;
		color: #fff;
	    &.ray-button--is-plain{
			color: #00A73D;
			border: 1px solid #00A73D;
			background-color: rgba(0,0,0,0);
			&.ray-button--is-ghost{
				border: none;
			}
		}
		
	}
	&.ray-button__warn{
		background: #E26E1F;
		color: #fff;
		&.ray-button--is-plain{
			color: #E26E1F;
			border: 1px solid #E26E1F;
			background-color: rgba(0,0,0,0);
			&.ray-button--is-ghost{
				border: none;
			}
		}
	}
	
	&.ray-button--is-mini{
	    width: auto;
		height: auto;
		padding: 20upx 30upx;
		font-size: 20upx;
		line-height: 20upx;	
	}
	
	&.ray-button--is-small{
		width: auto;
		height: auto;
		padding: 28upx 40upx;
		font-size: 26upx;
		line-height: 26upx;	
	}
	
	&.ray-button--is-normal{
		width: auto;
		height: auto;
		padding: 30upx 50upx;
		font-size: 30upx;
		line-height: 30upx;	
	}
	&.ray-button--is-big{
		width: auto;
		height: auto;
		padding: 40upx  60upx;
	    font-size: 36upx;
		line-height: 36upx;	
	}
	&.ray-button--is-large{
		width: auto;
		height: auto;
		padding: 40upx  70upx;
		font-size: 40upx;
		line-height: 40upx;	
	}
	
	&.ray-button--is-block{
		display: block;
		width: 100%;
	}
}
</style>
