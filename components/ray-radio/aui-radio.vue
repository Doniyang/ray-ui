<template>
	<radio-group class="component aui-radio">
		<view class="aui-radio__wrap" @change="onChange">
			<view class="aui-radio__item" v-for="(opt,dx) in picker" :key="dx">
				<radio :value="opt[itemKey]" :disabled="disabled" :checked="opt[itemKey] === chdVal" color="#00A73D" class="aui-radio__field"/><text class="aui-radio__txt">{{opt[itemValue]}}</text>
			</view>
		</view>
	</radio-group>
</template>

<script>
	import AuiField from "../aui-field/aui-field.vue"
	export default {
		name:"aui-radio",
		extends: AuiField,
		model:{ event:'change' },
		props:{
              picker:{
				  type:Array,
				  default:()=>[]
			  },
			  itemKey:{
				  type:String,
				  default:'key'
			  },
			  itemValue:{
				  type:String,
				  default:'val'
			  },
			  value:{
				  type:[String,Number],
				  default:''
			  },
			  disabled:{
				  type:Boolean,
				  default:false
			  },
		},
		inject:{
			validate:{
				default:null
			}
		},
		data() {
			return {
				chdVal:''
			}
		},
		beforeMount() {
		   this.updateRadioSelection(this.value,false)
		},
		watch:{
			value(nv,ov){
				if(nv!=ov){ this.updateRadioSelection(nv,true) }
			}
		},
		methods:{
			/**
			 * 更新radio值
			 * @param {Object} val
			 * @param {Object} flag
			 */
			updateRadioSelection(val,flag){
				this.chdVal = val
				if(flag) this.fireFieldValidate(this.validate,'change')
			},
			/**
			 * radio的change事件
			 * @param {Object} e
			 */
			onChange(e){
				this.chdVal = e.detail.value
				this.updateFieldDirtyState(true)
				this.$emit('change', e.detail.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
.aui-radio{
	&__wrap{
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		justify-content: flex-end;
	}
	&__item{
		width: auto;
		overflow: hidden;
		white-space: nowrap;
		&+&{
			margin-left: 30upx;
		}
	}
	
	&__field{
		transform: scale(0.8);
		transform-origin: 50% 50%;
	}
	&__txt{
		font-size: 30upx;
		display: inline-block;
		padding-left: 10upx;
		line-height: 1.25;
		vertical-align: middle;
	}
}
</style>
