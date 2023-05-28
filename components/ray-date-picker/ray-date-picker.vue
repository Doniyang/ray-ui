<template>
	<view class="component ray-date-picker" @click.once="onTapClick">
		<picker class="ray-date-picker__picker" mode="multiSelector" range-key="label" :disabled="disabled" :range="rayPickerRangeList" :value="raySelectionList" @change="onPickerChange" @columnchange="onPickerColumnChange">
			<input disabled placeholder-class="ray-date-picker-placeholder" class="ray-date-picker__selection" :placeholder="placeholder" :value="ray_select_text" :class="{'ray-date-picker__selection--is-disabled':disabled}" />
		</picker>
		<image v-if="!disabled" class="ray-date-picker-icon" src="./icon/right.svg" mode="aspectFit"></image>
	</view>
</template>
<script>
	import RayField from "../ray-field/ray-field.vue"
	export default {
		name: "ray-date-picker",
		extends: RayField,
		model: { event: 'change' },
		props: {
			//YYYY-MM-DD mm:ss
			start: {
				type: String,
				default: '1925-1-1 00:00'
			},
			end: {
				type: String,
				default: '2099-12-31 00:00'
			},
			formator: {
				type: String,
				default: 'YYYY-MM-DD hh:mm'
			},
			field: {
				type: String,
				default: 'day',
				validator(v) {
					return ['year', 'month', 'day', 'hour', 'minute'].includes(v)
				}
			},
			value: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		inject: {
			validate: {
				default: null
			}
		},
		data() {
			return {
				startDate: null,
				endDate: null,
				rayPickerRangeList: [],
				raySelectionList: [],
				ray_select_text: ''
			}
		},
		created() {
			this.updateStartDateAndEndDate()
		},
		beforeMount() {
			this.initDatePicker()
		},
		watch: {
			value(nv, ov) {
				if(nv !== ov) {
					this.initDatePicker()
					this.fireFieldValidate(this.validate,'change')
				}
			}
		},
		methods: {
			/**
			 * 初始化时间
			 */
			initDatePicker() {
				let date = this.parse(this.value)
				if(this.value) this.updateSelection(date)
				if(date <= this.startDate) {
					date = this.startDate
				}
				if(date >= this.endDate) {
					date = this.endDate
				}
				switch (this.field) {
					case 'year':
						this.initYearPicker(date);
						break
					case 'month':
						this.initMonthPicker(date);
						break
					case 'hour':
						this.initHourPicker(date);
						break
					case 'minute':
						this.initMinutePicker(date);
						break
					default:
						this.initDayPicker(date);
						break
				}
			},
			/**
			 * 是否touch过
			 * @param {Object} e
			 */
			onTapClick(e){
				this.updateFieldDirtyState(true)
			},
			/**
			 * 设置起止时间
			 */
			updateStartDateAndEndDate() {
				const isString = str => typeof str === 'string'
				let start = this.start
				let end = this.end
				if(!isString(start)) {
					start = '1952-1-1 00:00'
				}
				if(!isString(end)) {
					end = '2099-12-31 00:00'
				}
				let startDate = this.parse(start);
				let endDate = this.parse(end);
				if(endDate <= startDate) {
					endDate = this.parse(start)
					endDate.setFullYear(startDate.getFullYear() + 300);
					endDate.setDate(endDate.getDate() - 1);
				}
				this.startDate = startDate
				this.endDate = endDate
			},
			/**
			 * 初始化年
			 * @param {Date} date
			 */
			initYearPicker(date) {
				this.resetPicker()
				let rayYearPickerList = Array.from({
					length: this.endDate.getFullYear() - this.startDate.getFullYear() + 1
				}, (v, i) => ({
					label: (this.startDate.getFullYear() + i) + '年',
					value: this.startDate.getFullYear() + i
				}))
				let raySelectionIndex = Math.max(rayYearPickerList.findIndex(year => this.equals(date.getFullYear(), year.value)), 0)
				this.rayPickerRangeList.splice(0, 1, rayYearPickerList)
				this.raySelectionList.splice(0, 1, raySelectionIndex)
			},
			/**
			 * 初始化月
			 * @param {Date} date
			 */
			initMonthPicker(date) {
				this.initYearPicker(date)
				this.rayPickerRangeList.push(this.rayYearPickerList)
				this.raySelectionList.push(this.raySelectionIndex)
				this.updateMonthPicker(date)
			},
			/**
			 * 初始化日
			 * @param {Date} date
			 */
			initDayPicker(date) {
				this.initMonthPicker(date)
				this.updateDayPicker(date)
			},
			/**
			 * 初始化日
			 * @param {Date} date
			 */
			initHourPicker(start, end, date) {
				this.initDayPicker(start, end)
				this.updateHourPicker(start)
			},
			/**
			 * 初始化秒
			 * @param {Date} date
			 */
			initMinutePicker(start, end, date) {
				this.initHourPicker(start, end)
				this.updateMinutePicker(start)
			},
			/**
			 * 更新月份选择列表
			 * @param {Datet} date
			 */
			updateMonthPicker(date) {
				let startIndex = this.equals(date.getFullYear(), this.startDate.getFullYear()) ? (this.startDate.getMonth() + 1) : 1;
				let endIndex = this.equals(date.getFullYear(), this.endDate.getFullYear()) ? (this.endDate.getMonth() + 1) : 12;
				let rayMonthPickerList = Array.from({
					length: endIndex - startIndex + 1
				}, (v, i) => ({
					label: (startIndex + i) + '月',
					value: startIndex + i
				}))
				let rayMonthIndex = Math.max(rayMonthPickerList.findIndex(month => this.equals(date.getMonth(), month.value - 1)), 0)
				this.rayPickerRangeList.splice(1, 1, rayMonthPickerList)
				this.raySelectionList.splice(1, 1, rayMonthIndex)
			},
			/**
			 * 更新日期选择列表
			 * @param {Datet} date
			 */
			updateDayPicker(date) {
				let startIndex = this.equals(date.getFullYear(), this.startDate.getFullYear()) && this.equals(date.getMonth(), this.startDate.getMonth()) ? this.startDate.getDate() : 1;
				let endIndex = this.equals(date.getFullYear(), this.endDate.getFullYear()) && this.equals(date.getMonth(), this.endDate.getMonth()) ? this.endDate.getDate() : this.getMaxDate(date)
				let rayDayPickerList = Array.from({
					length: endIndex - startIndex + 1
				}, (v, i) => ({
					label: (startIndex + i) + '日',
					value: startIndex + i
				}))
				let rayDayIndex = Math.max(rayDayPickerList.findIndex(day => this.equals(date.getDate(), day.value)), 0)
				this.rayPickerRangeList.splice(2, 1, rayDayPickerList)
				this.raySelectionList.splice(2, 1, rayDayIndex)
			},
			/**
			 * 更新时选择列表
			 * @param {Datet} date
			 */
			updateHourPicker(date) {
				let startIndex = this.equals(date.getFullYear(), this.startDate.getFullYear()) && this.equals(date.getMonth(), this.startDate.getMonth()) && this.equals(date.getDate(), this.startDate.getDate()) ? this.startDate.getHours() : 0;
				let endIndex = this.equals(date.getFullYear(), this.endDate.getFullYear()) && this.equals(date.getMonth(), this.endDate.getMonth()) && this.equals(date.getDate(), this.endDate.getDate()) ? this.endDate.getHours() : 23
				let rayHourPickerList = Array.from({
					length: endIndex - startIndex + 1
				}, (v, i) => ({
					label: (startIndex + i) + '时',
					value: startIndex + i
				}))
				let rayHourIndex = Math.max(rayHourPickerList.findIndex(hour => this.equals(date.getHours(), hour.value)), 0)
				this.rayPickerRangeList.splice(3, 1, rayHourPickerList)
				this.raySelectionList.splice(3, 1, rayHourIndex)
			},
			/**
			 * 更新秒选择列表
			 * @param {Datet} date
			 */
			updateMinutePicker(date) {
				let startIndex = this.equals(date.getFullYear(), this.startDate.getFullYear()) && this.equals(date.getMonth(), this.startDate.getMonth()) && this.equals(date.getDate(), this.startDate.getDate()) && this.equals(date.getHours(), this.startDate.getHours()) ? this.startDate.getMinutes() : 0;
				let endIndex = this.equals(date.getFullYear(), this.endDate.getFullYear()) && this.equals(date.getMonth(), this.endDate.getMonth()) && this.equals(date.getDate(), this.endDate.getDate()) && this.equals(date.getHours(), this.endDate.getHours()) ? this.endDate.getMinutes() : 59
				let rayMinutePickerList = Array.from({
					length: endIndex - startIndex + 1
				}, (v, i) => ({
					label: (startIndex + i) + '秒',
					value: startIndex + i
				}))
				let rayMinuteIndex = Math.max(rayMinutePickerList.findIndex(minute => this.equals(date.getMinutes(), minute.value)), 0)
				this.rayPickerRangeList.splice(3, 1, rayMinutePickerList)
				this.raySelectionList.splice(3, 1, rayMinuteIndex)
			},
			/**
			 * 显示时间
			 * @param {Date} date
			 */
			updateSelection(date) {
				const MAP = {
					'year': 'YYYY年',
					'month': 'YYYY年MM月',
					'day': 'YYYY年MM月DD日',
					'hour': 'YYYY年MM月DD日 hh时',
					'minute': 'YYYY年MM月DD日 hh时mm秒'
				}
				console.log(date)
				this.ray_select_text = this.formater(date, MAP[this.field])
			},
			/**
			 * 确定按钮事件
			 * @param {Event} e
			 */
			onPickerChange(e) {
				let datestr = e.detail.value.map((v, i) => this.rayPickerRangeList[i][v]['value']).join('-')
				let date = this.parse(datestr)
				this.updateSelection(date)
				this.$emit('change', this.formater(date, this.formator))
			},
			/**
			 * 列变化事件
			 * @param {Event} e
			 */
			onPickerColumnChange(e) {
				let column = e.detail.column; // 改变的列的下标
				let value = e.detail.value; // 变更值的下标
				this.raySelectionList.splice(column, 1, value)
				this.updatePickerRangeList(column)
			},
			/**
			 * 更新选择项
			 * @param {Number} cols
			 */
			updatePickerRangeList(cols) {
				const MAP = {
					year: [],
					month: [this.updateMonthPicker],
					day: [this.updateMonthPicker, this.updateDayPicker],
					hour: [this.updateMonthPicker, this.updateDayPicker, this.updateHourPicker],
					minute: [this.updateMonthPicker, this.updateDayPicker, this.updateHourPicker, this.updateMinutePicker]
				}
				let datestr = this.raySelectionList.map((v, i) => i <= cols ? this.rayPickerRangeList[i][v]['value'] : 1).join('-')
				let date = this.parse(datestr)
				if(date <= this.startDate) {
					date = this.startDate
				}
				if(date >= this.endDate) {
					date = this.endDate
				}
				MAP[this.field].slice(cols).forEach(fn => {
					fn.call(this, date)
				})
			},
			/**
			 * 重置
			 */
			resetPicker() {
				this.rayPickerRangeList = []
				this.raySelectionList = []
			},
			/**
			 * 月份的最大天数
			 * @param {Date} date
			 */
			getMaxDate(date) {
				let maxdate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				return maxdate.getDate()
			},
			/**
			 * @param {Number} start
			 * @param {Number} end
			 */
			equals(start, end) {
				return start === end
			},
			/**
			 * 时间格式化
			 * @param {Date} date
			 * @param {String} fmt
			 */
			formater(date, fmt) {
				if(date instanceof Date === false) {
					return date
				}
				const o = {
					"M+": date.getMonth() + 1, //月份 
					"D+": date.getDate(), //日 
					"H+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时 
					"h+": date.getHours(), //小时 
					"m+": date.getMinutes(), //分 
					"s+": date.getSeconds(), //秒 
					"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
					"S": date.getMilliseconds() //毫秒 
				};
				if(/([yY]+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for(var k in o) {
					if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
				return fmt;
			},
			/**
			 * 时间字符串转Date
			 * @param {String} datestr
			 */
			parse(datestr) {
				let nums = datestr.split(/[/\-:/\s]/).filter(key => /\d+/g.test(key)).map((item, index) => {
					if(index === 1) {
						return parseInt(item) - 1
					} //月份需要-1
					return parseInt(item)
				})
				if(nums.length === 1) {
					let date = new Date()
					date.setFullYear(nums[0])
					return date;
				}
				return new Date(...nums)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ray-date-picker {
		display: flex;
		align-items: center;

		&__picker {
			flex: 1;
			width: 100%;
		}

		&-placeholder {
			color: rgba(153, 153, 153, 1);
			font-size: 30upx
		}

		&-icon {
			height: 30upx;
			width: 30upx;
		}

		&__selection {
			text-align: right;
			font-size: 30upx;
			color: #000F21;

			&--is-disabled {
				color: #999999;
			}
		}
	}
</style>
