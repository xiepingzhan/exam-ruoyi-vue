<template>
    <el-dialog :title="title" :before-close="closeDialog" width="30%" :visible.sync="visible" class="hgExam"
        :close-on-click-modal="false" append-to-body>
        <el-card>
            <ul style="list-style:none;">
                <!-- <el-tag v-for="(item, index) in 10" :key="index">{{ item.role_NAME }}</el-tag> -->
                <li v-for="(item, index) in 3" :key="index">{{ item }}分组
                    <ul style="list-style:none">
                        <li v-for="(it,iIndex) in 2" :key="iIndex">{{it}}对象</li>
                    </ul>
                </li>
            </ul>
        </el-card>
    </el-dialog>
</template>

<script>
import serice from '@/utils/request'
export default {
    data() {
        return {
            title: '考试对象',
            visible: false
        }
    },
    props: {
        roleList: {
            type: Array,
            default: []
        }
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog')
        },
        //查看考试对象
        viewDx(TESTPAPER_ID) {
            let formData = new FormData();
            formData.append('testpaperId', TESTPAPER_ID)
            formData.append('tm', new Date().getTime())
            serice.post('/testpaper/goEdit', formData).then(data => {
                if ("success" == data.result) {
                    this.roleList = data.roleList;				//角色
                } else if ("exception" == data.result) {
                    showException("查看考试对象", data.exception);	//显示异常
                }
            })
        },
    }
}
</script>
<style scoped lang="scss">
.flexClass {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: flex-start;
}
</style>