<template>
    <el-dialog :title="title" :show-close="false" class="hgExam" :append-to-body="true" :close-on-click-modal="false"
        :before-close="closeDialog" :visible.sync="visible">
        <el-card style="text-align:center;">
            <h3><b>{{ passonot == 'yes' ? '成绩合格' : '成绩不合格' }}</b></h3>
            <br>
            <h3><b>
                    <font color="red">{{ score }}分</font>
                </b></h3>
            <br />
            <br />
            <br />
            <h5>{{ passonot == 'yes' ? '通过此次考试!' : '未通过此次考试!' }}</h5>
            <div>
                <el-button v-on:click="lookingBack" type="primary" size="mini">试卷回看</el-button>
                <template v-if="zs!=1||passonot == 'yes'">
                    <el-button v-on:click="closeDrawer" type="danger" size="mini">结束考试</el-button>
	    				<!-- <el-button @click="onceAgain" type="danger" size="mini">补考一次</el-button> -->

                </template>
                <template v-if="zs == 1 && passonot == 'no' && frepeat && ftwice">
	    				<el-button @click="onceAgain" type="danger" size="mini">补考一次</el-button>
	    				</template>
            </div>
        </el-card>

    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            title: '考试结果',
            visible: false,
        }
    },
    props: {
        zs:{
            default:1,

        },
        ftwice:{
            type:Boolean,
            default:false,
        },
        frepeat:{
            type:Boolean,
            default:false,
        },
        passonot: {
            default: 'no',
            type: String
        },
        score: {
            default: 0
        }

    },
    mounted(){
        this.visible = true;
    },
    methods:{
        lookingBack(){
            this.$emit('lookingBack')
        },
        closeDialog(){
            this.$emit('closeDialog')
        },
        closeDrawer(){
            this.$emit('closeDrawer')
        },
        onceAgain(){
            this.$emit('onceAgain')
        }

    }
}
</script>

<style>

</style>