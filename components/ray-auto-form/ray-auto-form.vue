<!--  form单组件 -->
<template>
	<RayForm :formData="formData" @reset="onReset" @submit="onSubmit">
		<slot name="header"></slot>
		<template v-for="(field,dex) in fieldList">
			<!-- 普通输入框 type可指定为text,number,digit,idcard  -->
			<RayFormItem v-if="!['address','textarea','network','select','checkbox','switch','radio','date-picker','fulladdress','cascade','wrap-select'].includes(field.type) &&  updateFieldShowState(field.linkage,field.show)"  :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RayNumber v-if="field.type=='number'" v-model="formData[field.key]" :maxlength="field.maxlength" :readonly="field.readonly" :disabled="field.disabled" :focus="field.focus" :placeholder="field.placeholder" :pattern="field.pattern" :formator="field.formator" :reset="field.reset" @input="e=>{onFieldChange(e,field.key)}"/>
				<RayInput v-else v-model="formData[field.key]" :type="field.type" :readonly="field.readonly" :disabled="field.disabled" :focus="field.focus" :placeholder="field.placeholder" :formator="field.formator" :reset="field.reset" @input="e=>{onFieldChange(e,field.key)}"></RayInput>
				<template v-slot:suffix>
					<slot name="suffix.extra" :code="field.key">
						<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
					</slot>		
				</template>
			</RayFormItem>
			<!-- 地址组件 -->
			<RayFormItem v-if="field.type=='address' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea" labelClass="ray-auto-form-item--is-hide">
				<RayAddressBook :dataItems="addrList" :label="field.label" :level="field.level" :item-key="field.itemKey" :item-value="field.itemValue" :item-children="field.itemChildren" :splitor="field.splitor" :disabled="field.disabled" lazy :lazyLoadChildren="loadAddrData" :value="formData[field.key]" @change:validate="dirty=>{ updateValidateState(dirty,field.key) }"   @change="e=>{onAddressChange(e,field.key)}">
					<template v-slot:header>
						<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
						<slot name="label.extra" :code="field.key">
							<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
						</slot>
						<view class="ray-auto-form-blank"></view>	
					</template>
                    <template v-slot:suffix>
						<slot name="suffix.extra" :code="field.key">
							<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
						</slot>
					</template>    
					<template v-slot:default="{selection}">
						<RayTextarea :value="selection" flat readonly auto-height :tip="false" :placeholder="field.placeholder"  :disabled="field.disabled"/>
					</template>
				</RayAddressBook>
			</RayFormItem>
			<!-- 网格地址组件 -->
			<RayFormItem v-if="field.type=='network' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea" labelClass="ray-auto-form-item--is-hide">
				<RayAddressBook :dataItems="networkAddrsList" :label="field.label" :item-key="field.itemKey" :item-value="field.itemValue" :item-children="field.itemChildren" :splitor="field.splitor" :disabled="field.disabled" lazy :lazyLoadChildren="loadNetAddrData" :value="formData[field.key]" @change:validate="dirty=>{ updateValidateState(dirty,field.key) }"  @change="e=>{onAddressChange(e,field.key)}">
					<template v-slot:header>
						<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
						<slot name="label.extra" :code="field.key">
							<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
						</slot>
						<view class="ray-auto-form-blank"></view>
					</template>
					<template v-slot:default="{selection}">
						<RayTextarea :value="selection" flat readonly auto-height :tip="false" :placeholder="field.placeholder"  :disabled="field.disabled"/>
					</template>
				</RayAddressBook>
			</RayFormItem>
			<!-- 输入域组件 -->
			<RayFormItem v-if="field.type=='textarea' &&  updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
					<view class="ray-auto-form-blank"></view>
					<slot name="suffix.extra" :code="field.key">
						<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
					</slot>
				</template>
				<RayTextarea v-model="formData[field.key]" :maxlength="field.maxlength" :readonly="field.readonly" :disabled="field.disabled" :focus="field.focus" :placeholder="field.placeholder" :auto-height="field.autoHeight" :tip="field.tip" :flat="field.flat" @input="e=>{onFieldChange(e,field.key)}"/>
			</RayFormItem>
			<!-- 普通选择 -->
			<RayFormItem v-if="field.type=='select' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RaySelect v-model="formData[field.key]" :picker="field.picker" :item-key="field.itemKey" :item-value="field.itemValue" :readonly="field.readonly" :disabled="field.disabled" :placeholder="field.placeholder" @change="e=>{onFieldChange(e,field.key)}"/>
				<template v-slot:suffix>
					<slot name="suffix.extra" :code="field.key">
						<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
					</slot>
				</template>
			</RayFormItem>
			<!-- 时间组件 -->
			<RayFormItem v-if="field.type=='date-picker' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RayDatePicker v-model="formData[field.key]" :start="field.start" :end="field.end" :formator="field.formator" :field="field.field" :placeholder="field.placeholder" :disabled="field.disabled" @change="e=>{onFieldChange(e,field.key)}"/>
				<template v-slot:suffix>
					<slot name="suffix.extra" :code="field.key">
						<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
					</slot>		
				</template>
			</RayFormItem>
			<!-- 详细地址组件 -->
			<RayFormItem v-if="field.type=='fulladdress' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea" labelClass="ray-auto-form-item--is-hide">
				<RayFulladdresss :value="formData[field.key]" :address="formData[field.addressKey]" :level="field.level" :disabled="field.disabled" @change:validate="dirty=>{ updateValidateState(dirty,field.key) }" @change="(code,name)=>{onFulladdressChange(code,name,field.key,field.addressKey)}">
					<template v-slot:header>
						<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
						<slot name="label.extra" :code="field.key">
							<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
						</slot>
						<view class="ray-auto-form-blank"></view>
					</template>
					<template v-slot:icon>
						<view class="ray-auto-form-btn__icon"><text class="cuIcon-addressbook"></text></view>
					</template>
					<template v-slot:suffix>
						<slot name="suffix.extra" :code="field.key">
							<ray-button v-if="(!field.disabled) && field.bValue" size="mini" :block="false" class="ray-auto-form--suffix-btn" @click.stop="onSuffixBtnClick(field)">{{field.bValue}}</ray-button>
						</slot>
					</template>
					<template v-slot:default="{address}">
						<RayTextarea :value="address" flat readonly auto-height  :tip="false" :placeholder="field.placeholder"  :disabled="field.disabled"/>
					</template>
				</RayFulladdresss>
			</RayFormItem>
			<!-- switch组件-->
			<RayFormItem v-if="field.type=='switch' &&updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key"  :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" fieldClass="ray-auto-form-item--is-right">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RaySwitch v-model="formData[field.key]" :disabled="field.disabled" :checked="field.checked" :uncheck-value="field.uncheckValue" :checked-value="field.checkedValue" :uncheck-label="field.uncheckLabel" :checked-label="field.checkedLabel" @change="e=>{onFieldChange(e,field.key)}"/>
			</RayFormItem>
			<!-- radio -->
			<RayFormItem v-if="field.type=='radio' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" :wrapClass="[{'ray-auto-form-item-wrap':field.wrap}]" :fieldClass="[{'ray-auto-form-item-field-wrap':field.wrap}]">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RayRadio v-model="formData[field.key]" :picker="field.picker" :item-key="field.itemKey" :item-value="field.itemValue" :disabled="field.disabled" @change="e=>{onFieldChange(e,field.key)}"/>
			</RayFormItem>
			<!-- checkbox -->
			<RayFormItem v-if="field.type=='checkbox' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" :wrapClass="[{'ray-auto-form-item-wrap':field.wrap}]" :fieldClass="[{'ray-auto-form-item-field-wrap':field.wrap}]">
				<template v-slot:label>
					<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
					<slot name="label.extra" :code="field.key">
						<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
					</slot>
				</template>
				<RayCheckbox v-model="formData[field.key]" :picker="field.picker" :item-key="field.itemKey" :item-value="field.itemValue" :disabled="field.disabled" @change="e=>{onFieldChange(e,field.key)}"/>
			</RayFormItem>
			<!-- Cascade联级选择 -->
			<RayFormItem v-if="field.type=='cascade' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea" labelClass="ray-auto-form-item--is-hide">
				<RayCascade :value="formData[field.key]" :data-items="field.picker"  :label="field.label" :item-key="field.itemKey" :item-value="field.itemValue" :item-children="field.itemChildren" :splitor="field.splitor" :disabled="field.disabled" :lazy="field.lazy" :lazyLoadChildren="field.lazyLoadChildren" @change:validate="dirty=>{ updateValidateState(dirty,field.key) }"  @change="e=>{onChange(e,field.key)}">
					<template v-slot:header>
						<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
						<slot name="label.extra" :code="field.key">
							<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
						</slot>
						<view class="ray-auto-form-blank"></view>
					</template>
					<template v-slot:default="{selection}">
						<RayTextarea :value="selection" flat auto-height readonly :tip="false" :placeholder="field.placeholder" :disabled="field.disabled"/>
					</template>
				</RayCascade>
			</RayFormItem>
			<!-- 换行select -->
			<RayFormItem v-if="field.type=='wrap-select' && updateFieldShowState(field.linkage,field.show)" :divider="(dex+1) < fieldList.length" :key="field.key" :prop="field.key" :label="field.label" :required="field.required" :rules="field.rules" :validState="validstate[field.key]" wrapClass="ray-auto-form-item-wrap" fieldClass="ray-auto-form-item--is-textarea" labelClass="ray-auto-form-item--is-hide">
				<RaySelect :value="formData[field.key]" :picker="field.picker" :item-key="field.itemKey" :item-value="field.itemValue" :readonly="field.readonly" :disabled="field.disabled" :placeholder="field.placeholder" break-line @change="e=>{onFieldChange(e,field.key)}">
					<template v-slot:header>
						<view class="ray-auto-form-label" :class="{'ray-auto-form-label--is-required':field.required}">{{field.label}}</view>
						<slot name="label.extra" :code="field.key">
							<image :src="iconURI" class="ray-auto-form-label__extra" @click.stop="onExtraClick(field)" v-if="field.flag"></image>
						</slot>
					</template>
					<template v-slot:default="{selection}">
						<RayTextarea :value="selection" auto-height flat readonly :tip="false" :placeholder="field.placeholder" :disabled="field.disabled"/>
					</template>
				</RaySelect>
			</RayFormItem>
		</template>
		<slot></slot>
	</RayForm>
</template>

<script>
	import RayForm from '../ray-form/ray-form.vue'
	import RayFormItem from '../ray-form-item/ray-form-item.vue'
	import RayInput from '../ray-input/ray-input.vue'
	import RayNumber from '../ray-number/ray-number.vue'
	import RayTextarea from '../ray-textarea/ray-textarea.vue'
	import RaySelect from '../ray-select/ray-select.vue'
	import RayDatePicker from '../ray-date-picker/ray-date-picker.vue'
	import RayAddressBook from '../ray-address-book/ray-address-book.vue'
	import RaySwitch from '../ray-switch/ray-switch.vue'
	import RayRadio from '../ray-radio/ray-radio.vue'
	import RayCheckbox from '../ray-checkbox/ray-checkbox.vue'
	import RayFulladdresss from '../ray-fulladdress/ray-fulladdress.vue'
	import RayCascade from '../ray-cascade/ray-cascade.vue'
	import RayButton from '../ray-button/ray-button.vue'
	import ToolKit from '../../src/toolkit/toolkit.js'
	import { money,percent,re_money,re_percent } from '../../src/formater/formater.js'
	export default {
		name: 'ray-auto-form',
		components: {
			RayForm,
			RayFormItem,
			RayInput,
			RayNumber,
			RayTextarea,
			RaySelect,
			RayDatePicker,
			RayAddressBook,
			RayFulladdresss,
			RayRadio,
			RaySwitch,
			RayCheckbox,
			RayCascade,
			RayButton
		},
		props: {
			formFields: {
				type: Array,
				default: () => []
			},
			formData: {
				type: Object,
				default: () => ({})
			},
			queryType:{
				type:String,
				default:''
			},
			lazyVerifiable:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				iconURI: 'data:image/png;base64,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',
				validstate: {},
				fieldList: [],
				addrList: [],
				networkAddrsList: []
			}
		},
		beforeMount() {
			this.updateFormFields()
			this.fetchApi()
		},
		watch:{
			lazyVerifiable(nv,ov){
				if( nv!=ov && nv==true ){
					this.updateFormValidState()
				}
			}
		},
		methods: {
			/**
			 * 修改配置
			 * @param {Object} cfg
			 * @param {Object} keys
			 */
			updateFormFieldCfg(cfg,keys){
				this.fieldList.forEach((field,dx)=>{
					if(ToolKit.ensure(keys).includes(field.key)){
						if(ToolKit.isString(cfg.source) && (!ToolKit.isEmptyString(cfg.source))){
							let picker = ToolKit.getValueFromPath(this,cfg.source,[])
							this.$set(this.fieldList,dx,Object.assign(field,cfg,{picker}))
						}else{
							this.$set(this.fieldList,dx,Object.assign(field,cfg))
						}
					}
				})
			},
			/**
			 * 动态更新picker项
			 * @param {Object} source
			 * @param {Object} key
			 */		
			updatePickerSource(source,key){
				if(ToolKit.isEmptyString(source)){ return false}
				this.fieldList.forEach((field,dx)=>{
					if(field.key === key){
						let picker = ToolKit.getValueFromPath(this,source,[])
						this.$set(this.fieldList,dx,Object.assign(field,{picker}))
					}
				})
			},
			/**
			 * 更新field的格式化函数及选择项
			 */
			updateFormFields() {
				this.fieldList = this.formFields.map(field => {
					let copy_field = Object.assign({},field)
					//处理select/radio/checkbo/wrap-select选择项
					if(['select', 'radio', 'checkbox','wrap-select'].includes(field.type)) {
						if(ToolKit.isUndef(field.picker) && ToolKit.isString(field.source) && ToolKit.isEmptyString(field.source) == false){
						  copy_field.picker = ToolKit.getValueFromPath(this,field.source,[])
						}
					}
					//金额格式化函数
					if(field.formator == 'money') {
						copy_field = Object.assign(copy_field,{
							formator: money(),
							reset:re_money()
						})
					}
					//百分比
					if(field.formator == 'percent') {
						copy_field.formator = 
						copy_field = Object.assign(copy_field,{
							formator: percent(field.fixed),
							reset:re_percent(field.fixed)
						})
					}
					return copy_field
				})
			},
			/**
			 * 根据linkage或者show显示或隐藏formitem
			 * @param {Object|Array<Object>} linkage
			 * @example 
			 *            1. [{ is_mgr:'Y' },{is_role: 'Y'}] 表示 formdata中只要is_mgr是Y或者is_role是Y 就显示 否则根据配置show来显示
			 *            2. {is_mgr:'Y,is_role: 'Y''}      表示 formdata中只要is_mgr是Y且is_role是Y 就显示 否则根据配置show来显示    
			 * @param {Boolean} flag
			 */
			updateFieldShowState(linkage, flag) {
				if(Array.isArray(linkage)) { return linkage.some(o => this.isAllInFormData(o))}
				if(ToolKit.isPlainObject(linkage)) { return this.isAllInFormData(linkage) }
				return flag
			},
			/**
			 * 判断是否匹配到 linkage 配置的数据
			 * @param {Object} o
			 */
			isAllInFormData(o) {
				return Object.keys(o).every(key =>ToolKit.ensure(o[key]).some(code=>ToolKit.ensure(this.formData[key]).includes(code)))
			},
			/**
			 * 更新form校验
			 */
			updateFormValidState(){
				this.fieldList.filter(field=>field.required || ToolKit.ensure(field.rules).length).forEach(data=>{
					this.updateValidateState(data.key)
				})
				this.$emit('update:lazyVerifiable',false)
			},
			/**
			 * 更新validstate
			 * @param {Boolean} isDirty 
			 * @param {String} key
			 */
			updateValidateState(isDirty,key){
				if(isDirty) this.$set(this.validstate, key, Date.now())
			},
			/**
			 * reset事件
			 * @param {Object} e
			 */
           onReset(e){
			   this.fieldList.forEach(field=>{				   
				   if(['address','checkbox','network','fulladdress','cascade'].includes(field.type)){
					   this.$set(this.formData,field.key,[])
					   if(field.type ==='fulladdress'){ this.$set(this.formData,field.addressKey,'')}
				   }else{
					    this.$set(this.formData,field.key,'')
				   }
			   })
			   this.$emit('reset',e)
		   }, 
		  /**
		   * submit事件
		   * @param {Object} e
		   */	
		   onSubmit(e){
			  this.$emit('submit',e) 
		   },
		   /**
		    * 初始化网格地址及地址组件的初始数据
		    */
		   fetchApi(){
		   	if(this.formFields.some(cfg=>cfg.type == 'address')){this.fetchAddrsList()}
		   	if(this.formFields.some(cfg=>cfg.type == 'network')){this.fetchNetworkAddrsList()}
		   },
			/**
			 * 加载地址组件的首批数据
			 */
			async fetchAddrsList() {
				if(this.addrList.length) { return }
				const { data } = await this.$yuApi.post(this.$appConf.retailHost + '/AREA001_RequestDTO.do', {
					area_type:'province',
					area_parent_code:'',
				});
				if(data.ec == '0') {
					this.addrList = data.data.result
				}
			},
            
			/**
			 * 加载网格地址组件的首批数据
			 */
			async fetchNetworkAddrsList() {
				if(this.networkAddrsList.length) return
				const { data } = await this.$yuApi.post(this.$appConf.retailHost + '/JD054_RequestDTO.do', {
					area_parent_code:'',
					area_type:'town',
					whether:'Y',
					currentUserId:uni.getStorageSync('app.retail.usr_cde'),
					attr_orgid:uni.getStorageSync('app.retail.bch_cde'),
					queryFlag:this.queryType
				});
				if(data.ec == '0') {
					this.networkAddrsList = data.data.result
				}
			},
			/**
			 * 留痕点击事件
			 * @param {Object} field
			 */
			onExtraClick(field) {
				this.$emit('click:extra', field)
			},
			/**
			 * 最后的按钮点击事件
			 * @param {Object} field
			 */
			onSuffixBtnClick(field) {
			   this.$emit('click:suffix', field)
			},
			/**
			 * 值改变
			 * @param {any} value
			 * @param {String} key
			 */
			onFieldChange(value,key){
				this.$set(this.formData, key, value)
				this.onEmitChange(key)
			},
			/**
			 * change事件
			 * @param {Array<Object>} addrs
			 * @param {String} key
			 */
			onChange(code, key) {
				this.$set(this.formData, key, code)
				this.onEmitChange(key)
			},
			/**
			 * 地址组件change事件
			 * @param {Object} code
			 * @param {Object} key
			 */
			onAddressChange(addrs, key) {
				this.$set(this.formData, key, addrs.map(a=>a.area_code))
				this.onEmitChange(key)
			},
			/**
			 * 详细地址的change事件
			 * @param {Object} code
			 * @param {Object} name
			 * @param {Object} key
			 * @param {Object} adkey
			 */
			onFulladdressChange(code,name,key,adkey){
				this.onChange(code,key)
				this.$set(this.formData, adkey, name)
			},
			
			
			/**
			 * 提交change事件
			 * @param {String} key
			 */
			onEmitChange(key){
			   this.$emit('change',key,this.formData)	
			},
			/**
			 *  懒加载下级网格地址
			 * @param {Object} addr
			 * @param {Object} reslove
			 * @param {Object} reject
			 */
			async loadNetAddrData(addr, reslove, reject) {
				const MAP = {
					town:"country",
					country:"group"
				}
				if(addr.area_type ==='group'){
					reslove([])
					return false
				}
				const { data } = await this.$yuApi.post(this.$appConf.retailHost + '/JD054_RequestDTO.do', {
					area_parent_code: addr.area_code,
					area_type:MAP[addr.area_type],
					whether:'Y',
					currentUserId:uni.getStorageSync('app.retail.usr_cde'),
					attr_orgid:uni.getStorageSync('app.retail.bch_cde'),
					queryFlag:this.queryType
				}, { noLoadFlag: true });
				if(data.ec == '0') {
					reslove(data.data.result || [])
				} else {
					this.$yuApp.toast(data.em)
				}
			},
			/**
			 * 根据上级请求下级地址
			 * @param {Object} addr
			 * @param {Object} reslove
			 * @param {Object} reject
			 */
			async loadAddrData(addr, reslove, reject) {
				const MAP = {
					province:'city',
					city:'area',
					area:'town',
					town:"country",
					country:"group"
				}
				if(addr.area_type ==='group'){
					reslove([])
					return false
				}
				const { data } = await this.$yuApi.post(this.$appConf.retailHost + '/AREA001_RequestDTO.do', {
					area_parent_code: addr.area_code,
					area_type:MAP[addr.area_type]
				}, { noLoadFlag: true });
				if(data.ec == '0') {
					reslove(data.data.result || [])
				} else {
					this.$yuApp.toast(data.em)
				}
			}
		}
	}
</script>

<style lang="scss">
	/deep/.ray-auto-form-item-wrap{
		overflow: hidden;
		min-height: 100upx;
	}
    /deep/.ray-auto-form-item--is-textarea{
		padding: 0 0 40upx !important;
	}
	 
	 
	/deep/.ray-auto-form-item-field-wrap {
		padding: 0 0 40upx !important;
		
		.ray-checkbox__wrap,.ray-radio__wrap{
			flex-wrap: wrap;
			justify-content: flex-start;
		}
		
		.ray-checkbox__item+.ray-checkbox__item,.ray-radio__item+.ray-radio__item{
			margin-left: 0;
		}
		
		.ray-checkbox__txt,.ray-radio__txt{
			max-width: calc(100% - 35upx) !important;
			vertical-align: text-top;
			white-space: pre-line;
			word-wrap: break-word;
			word-break: break-all;
		}
	}

	/deep/.ray-auto-form-item--is-hide {
		display: none !important;
	}

	/deep/.ray-auto-form-item--is-right {
		display: flex;
		justify-content: flex-end;
	}

	.ray-auto-form--suffix-btn {
		vertical-align: middle;
		border-radius: 40upx;
		background-color: #E5F9E5;
		color: #00A73D;
		margin-left: 10upx;
		
		&.ray-button--is-mini{
			padding: 17upx 22upx;
			font-size: 28upx;
			line-height: 28upx;
			font-weight: 500;
		}
		
		&::after {
			border: none !important;
		}
	}
    .ray-auto-form-blank{
		flex: 1;
	}    
	.ray-auto-form-label {
		font-size: 30upx;
		color: #303030;
		font-weight: 500;
		padding: 30upx 0;

		&.ray-auto-form-label--is-required {
			&::after {
				content: '*';
				color: red;
				padding-left: 10upx;
			}
		}

		&__extra {
			width: 30upx;
			height: 30upx;
			margin-left: 20upx;
		}
	}
	
	.ray-auto-form-btn__icon{
		vertical-align: middle;
		line-height: 1 !important;
		padding: 15upx 15upx;
		background-color:rgba($color: #E5F9E5, $alpha: .78) ;
		font-size: 32upx;
		text-align: center;
		color:  #00A73D;
		border-radius: 28upx;
		box-sizing: border-box;
		margin: 0;
		height: auto !important;
	}
</style>
