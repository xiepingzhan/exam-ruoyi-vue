<template>
    <div class="multipleSelection app-container">
        <el-row :gutter="20">
            <el-col>
                <!-- 检索 -->
                <el-form :model="queryForm" ref="myForm" inline :rules="rules" v-hasPermi="['multipleSelection:list']"
                    size="mini">
                    <el-form-item v-for="(item, index) in FormList" :key="index" :label="item.label" :prop="item.prop">
                        <template v-if="item.type == 'input'">
                            <el-input clearable v-model="queryForm[item.prop]" :placeholder="'请输入' + item.label">
                            </el-input>
                        </template>
                        <template v-else-if="item.type == 'select'">
                            <el-select filterable clearable v-model="queryForm[item.prop]"
                                :placeholder="'请选择' + item.label">
                                <el-option v-for="(opt, opIndex) in dict['testquestions' + item.prop]" :key="opIndex"
                                    :label="opt.dictLabel" :value="opt.dictValue"></el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain icon="el-icon-search" size="mini" @click="initList">搜索
                        </el-button>
                        <el-button plain icon="el-icon-refresh" size="mini" @click="refreshList">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd(null, '新增多选题')"
                    v-hasPermi="['multipleSelection:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-minus" size="mini" @click="deleteThis()"
                    v-hasPermi="['multipleSelection:delete']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-col>
        </el-row>
        <div class="table" style="margin-top:10px">
            <el-table :data="tableList" @selection-change="handleSelect">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="NO." type="index"></el-table-column>
                <el-table-column show-overflow-tooltip label="題目" prop="title"></el-table-column>
                <el-table-column show-overflow-tooltip label="答案" width="100" prop="answer"></el-table-column>
                <el-table-column show-overflow-tooltip label="类型" width="150" prop="type">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="级别" width="80" prop="level">
                </el-table-column>
                <el-table-column show-overflow-tooltip label="状态" width="100" prop="state">
                    <template slot-scope="{row}">
                      <template v-if="row.state == 'true'">
                          <el-tag type="primary" plain>启用</el-tag>
                      </template>
                      <template v-else>
                          <el-tag type="danger" plain>停用</el-tag>
                      </template>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="150">
                    <template slot-scope="scoped">
                        <el-button size="mini" type="warning" @click="handleAdd(scoped.row.multipleselectionId, '修改单选题')">
                            修改
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteThis(scoped.row.multipleselectionId)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="initList" />
        </div>
        <updateDialog v-if="visible" ref="updateDialog" :baseUrl="requestOptions.baseUrl" :id="targetId" :title="title"
            :type="type"
            :levelList="dict.testquestionslevel" :typeList="dict.testquestionstype" @savefn="savefn"
            @closeDialog='closeDialog'></updateDialog>
            <FileImport v-if="uploadAble" ref="myImport" :baseUrl="requestParams.baseUrl" :fileName="requestParams.fileName"
            @uploadList="initList" @closeDialog="uploadAble = false" />
    </div>
</template>

<script>
import updateDialog from '../updateDialog.vue'
import fileImport from "../../mixins/fileImport";

import viewMixin from '@/mixins/view-modules'
export default {
    components: { updateDialog },
    mixins: [viewMixin,fileImport],
    data() {
        return {
            requestOptions: {
                baseUrl: '/multipleselection'
            },
            requestParams: {
                baseUrl: '/multipleselection',
                fileName: '多选题'
            },
            type:'multipleSelection'
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.red {
    background: rgba(255, 0, 0, 0.587);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    border: 1px solid;
}

.green {
    background: rgba(0, 128, 0, 0.667);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    border: 1px solid;


}
</style>
