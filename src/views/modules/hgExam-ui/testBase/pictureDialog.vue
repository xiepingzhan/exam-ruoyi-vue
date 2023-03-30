<template>
    <el-dialog title="选择照片" V-dialogDrag :modal='false'
    width="80%"
    :visible.sync="visible" :close-on-click-modal="false"
        :before-close="closeDialog">
    <picture_index ref="picture" @changeFilePath="changeFilePath" win="yes"></picture_index>
    </el-dialog>
</template>

<script>

import picture_index from './picture/index.vue'
export default {
    data() {
        return {
            // win: 'no'
            visible: false,
           
        }
    },
    components:{
        picture_index
    },

    methods: {
        changeFilePath(value){
            this.$emit('changeFilePath',value)
            this.closeDialog()
        },
        closeDialog(){
            this.$emit('closeDialog')
        },


    },

}
</script>

<style lang="scss" scoped>
@import '~@/plugins/zTree/2.6/zTreeStyle.css';
::v-deep .el-dialog__body{
    padding:0!important;
}
</style>