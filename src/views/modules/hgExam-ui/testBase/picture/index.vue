<template>
    <div class="picture" style="height:100%">
        <el-container style="height:100%;">
            <el-aside style="height:100%;width:22rem;background:inherit;padding-top:1.25rem;">
                <tree :treeProp="treeProp" :rightList="rightList" :treeData="treeData" @menuClick="menuClick"
                    @nodeClick="nodeClick" :win="win"></tree>
            </el-aside>
            <el-main style="height:100%;">
                <list :PICTURE_ID="PICTURE_ID"  @changeFilePath="changeFilePath" :win="win" @uploadTree="initTree"
                    style="height:auto"></list>
            </el-main>
        </el-container>
        <!-- 新增 修改 树节点信息 -->
        <uploadTree ref="uploadTree1" :PICTURE_ID="PICTURE_ID" v-if="uploadable"
            @closeDialog="(uploadable = false, clickData = null)" @uploadTree="initTree" />
    </div>
</template>

<script>
import treeMixin from './mixins/tree'
import uploadTree from './uploadTree.vue';
import list from './list.vue'

import { saveFile, delTree } from '@/api/hgExam-ui/testpaper_picture.js'
export default {
    props: {
        win: {//是否从弹框进入
            type: String,
            default: 'no'
        }
    },
    mixins: [treeMixin],
    components: {
        tree: resolve => require(['./tree.vue'], resolve),
        uploadTree, list
    },
    data() {
        return {
            treeProp: { label: 'originalFileName', children: 'childrens' },
            rightList: [
                { label: '新增', type: 'addTree', btnType: 'primary', icon: 'el-icon-plus' },
                { label: '修改', type: 'editTree', btnType: 'success', icon: 'el-icon-edit' },
                { label: '删除', type: 'delTree', btnType: 'danger', icon: 'el-icon-delete' },
            ],//右键菜单
            uploadable: false,    // 更新树节点弹框
            // PARENT_ID: undefined,      //上级ID
            clickData: null,     //当前节点
            PARENT_ID: '0',//当前节点ID
            parentObj: null
        }
    },
    methods: {
        changeFilePath(filepath) {
            this.$emit('changeFilePath', filepath)
        },
        // 新增目录
        addTree() {
            this.uploadable = true;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.uploadTree1.visible = true;
                }, 800)
            })
        },
        // 编辑当前目录
        editTree() {
            this.uploadable = true;
            let { originalFileName, remark, ...other } = this.clickData;
            this.parentObj = {
                ...other,
                name: this.clickData.originalFileName,
                remarks: this.clickData.remark,
            }
            this.$nextTick(() => {
                this.$refs.uploadTree1.title = "修改目录";
                this.$refs.uploadTree1.visible = true;
            })
        },
        // 删除当前目录
        delTree() {
            swal({
                title: '',
                text: "确定要删除吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    this.loading = true;
                    // return
                    delTree(this.PICTURE_ID).then(res => {
                        let { code, msg } = res;
                        if (code != 200) return this.$modal.msgError(msg)
                        this.$modal.msgSuccess("删除成功")
                        this.initTree()
                    })
                }
            });
        },
        // 右键点击事件处理
        menuClick(type, clickNode) {
            this[type](clickNode)
        },
        // 点击事件
        nodeClick(data, node) {
            console.log(data, node, "当前点击内容")
            if (node.level == 1) {
                this.PICTURE_ID = data.id;
                this.PARENT_ID = data.parentId;
                this.clickData = data;

            }
        }
    }
}
</script>

<style>

</style>
