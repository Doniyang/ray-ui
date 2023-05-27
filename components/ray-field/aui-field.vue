<script>
	export default {
		data(){
			return {
				dirty: false
			}
		},
		methods:{
			fireFieldValidate(fn,trigger){
			  if(fn  && this.dirty) fn(trigger)
			},	
			updateFieldDirtyState(isDirty){
				this.dirty = isDirty
			}
		}
	}
</script>