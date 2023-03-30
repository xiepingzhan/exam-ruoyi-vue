<template>
    <!-- 查看排名窗口 start -->
    <el-dialog :title="title" :before-close="closeDialog" append-to-body :close-on-click-modal="false"
        :visible.sync="visible" class="hgExam">
        <h4 style="width: 100%;text-align: center;">共<b>{{ rankingList.length }}</b>人&nbsp;&nbsp;及格<b>
                {{ passnum }}</b>人&nbsp;&nbsp;不及格 <b>{{ rankingList.length - passnum }}</b>人</h4>
        <el-table :data="rankingList" border :row-style="rowStyle">
            <el-table-column type="index" label="NO."></el-table-column>
            <el-table-column show-overflow-tooltip prop="username" label="姓名"></el-table-column>
            <el-table-column prop="score" label="分数"></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import jquery from 'jquery'
import serice from '@/utils/request'

export default {
    data() {
        return {
            username: '',
            passingscore: 0,
            rankingList: [],
            passnum: 0,
            title:'排名',
            visible:false
        }
    },
    methods: {
        rowStyle({row,rowIndex}){
            if(row.username==this.username){
                return {
                    color:'red'
                }
            }
        },
        // 弹框关闭
        closeDialog(){
            this.$emit('closeDialog')
        },
        //查看排名
        ranking(TESTPAPER_ID, USERNAME, PASSINGSCORE) {
            jquery("#viewRanking").click();
            this.username = USERNAME;
            this.passingscore = PASSINGSCORE;

            serice.post('/achievement/ranking',
                {
                    testpaperId: TESTPAPER_ID,
                    tm: new Date().getTime()
                }).then(res => {
                    let { code, data } = res;
                    if (code != 200) return
                    this.rankingList = data;
                    data.forEach(item => {
                        if (item.score > this.passingscore) this.passnum += 1
                    })
                })
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../../plugins/modal-window-effects/css/md-modal.css';
</style>
