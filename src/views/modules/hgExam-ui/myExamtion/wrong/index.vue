<template>
    <div class="app-container wrong">
        <!-- 小题 -->
        <el-card>
            <div slot="header">
                <h5>错题列表(小题)</h5>
            </div>
            <smallQuestionInfo />
        </el-card>
        <!-- 大题 -->
        <el-card style="margin-top:10px">
            <div slot="header">
                <h5>错题列表(大题)</h5>
            </div>
            <bigQuestionInfo/>

        </el-card>
    </div>
</template>

<script>
export default {
    components: {
        smallQuestionInfo: resolve => require(['./smallQuestionInfo.vue'], resolve),
        bigQuestionInfo:resolve=>require(['./bigQuestionInfo.vue'],resolve)
    }
}
</script>

<style scoped lang="scss">
::v-deep .el-card {
    .el-card__header {
        h5 {
            margin: 0 !important;
            position: relative;

            &::after {
                content: "";
                background-color: #04a9f5;
                position: absolute;
                left: -15px;
                top: -4px;
                width: 4px;
                height: 20px;
            }
        }
    }

    .el-card__body {
        padding-bottom: 0 !important;
    }
}
</style>