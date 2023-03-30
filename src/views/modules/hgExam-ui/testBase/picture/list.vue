<template>
  <div class="picture_list" style="height:100%;">
    <el-form
      v-show="!isShow"
      inline
      size="mini">
      <el-form-item
        label="图片名">
        <el-input
          v-model="keywords"
          placeholder="请输入查询内容"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getList()">查询
        </el-button>
        <el-button
          @click="refreshData">重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row
      v-show="(PICTURE_ID != undefined && !isShow)"
      style="margin-bottom:.625rem">
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          @click="goUpload">批量上传
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          size="mini"
          type="danger"
          @click="makeAll('确定删除选中的图片吗?')">批量删除
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-show="!isShow"
      :data="varList"
      @selection-change="handleSelection">
      <el-table-column
        type="selection"
        width="30"/>
      <el-table-column
        label="NO."
        type="index"
        width="40"/>
      <el-table-column
        label="图片名">
        <template slot-scope="{row:data,$index:index}">
          <image-preview
            :src="data.url"
            width="1.125rem"
            height="1.125rem"
            :alt="data.originalFileName"
          />

          {{ data.originalFileName }}&nbsp;
          <span class="green" style="cursor: pointer;">
                        <i class="el-icon-edit-outline" title="修改图片名"
                           v-on:click="openEdit('titlew' + (index + 1), 'title' + (index + 1))"></i>
                  </span>

          <div v-bind:id="'titlew' + (index + 1)" style="z-index: 9999999999999999;position:absolute;display: none;    margin-top: -0.4375rem;
    margin-left: -0.625rem;">
            <el-input
              v-bind:id="'title' + (index + 1)"
              style="position: absolute;    width: 12.5rem;    top: -1.5625rem;"
              v-model="data.originalFileName" maxlength="30" show-word-limit placeholder="这里输入图片名"
              title="图片名" size="mini"/>
            <a
              title="保存"
              v-on:click="toEdit(data, (index + 1))"
              style="cursor:pointer;    position: absolute;
    right: -13.4375rem;
    top: -1.4375rem;">
              <i class="el-icon-check"></i></a>
            <a
              title="取消"
              v-on:click="closeEdit('titlew' + (index + 1))"
              style="cursor:pointer;    position: absolute;
    right: -14.6875rem;
    top: -1.4375rem;"><i class="el-icon-close"></i></a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图片大小" prop="fileSize">
        <template slot-scope="{row:data}">
          {{
            data.fileSize > 1024 ?
              ((((data.fileSize) / 1024) + '').substring(0, (((data.fileSize) / 1024) + '').lastIndexOf('.') + 3))
              + ' MB' :
              data.fileSize + ' KB'
          }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="上传时间" prop="createTime"></el-table-column>
      <el-table-column label="上传者" prop="createBy"></el-table-column>
      <el-table-column label="备注说明" prop="remark">
        <template slot-scope="{row:data,$index:index}">
          {{ data.remark }}
          <span class="green" style="cursor: pointer;">
                        <i class="el-icon-edit-outline" title="修改备注"
                           v-on:click="openEdit('remarksw' + (index + 1), 'remarks' + (index + 1))"></i>
                    </span>
          <div v-bind:id="'remarksw' + (index + 1)" style="z-index: 9999999999999999;position:absolute;display: none;    margin-top: -0.4375rem;
                        margin-left: -0.625rem;">
            <div class="input-group input-group-sm mb-3">
              <el-input v-bind:id="'remarks' + (index + 1)" v-model="data.remark" maxlength="30"
                        show-word-limit placeholder="这里输入备注" title="备注"
                        style="position: absolute;    width: 12.5rem;    top: -1.5625rem;"/>
              <a title="保存" v-on:click="toEdit(data, (index + 1))" style="cursor:pointer;    position: absolute;
                        right: -13.4375rem;
                        top: -1.4375rem;"><i class="el-icon-check"></i></a>
              <a title="取消" v-on:click="closeEdit('remarksw' + (index + 1))" style="cursor:pointer;    position: absolute;
                        right: -14.6875rem;
                        top: -1.4375rem;"><i class="el-icon-close"></i></a>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row:data}">
          <el-button size="mini" type="primary" title="下载" v-on:click="downloadFile(data.url
                    )" style="cursor:pointer;">下载
          </el-button>
          <el-button size="mini" type="danger" title="删除" v-on:click="goDel(data.id
                    , data.filepath)" style="cursor:pointer;">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 预览视图 -->
    <div v-show="!isShow" class="yulantu" id="yulantu"></div>

    <pagination :total="total" v-show="(total > 0 && !isShow)" :limit.sync="queryParams.pageSize"
                :page.sync="queryParams.pageNum" @pagination="getList()"></pagination>

    <!-- 列表展示内容 -->
    <el-card style="margin-top:1.5rem;" v-show="!isShow">
      <template slot="header">
        图片
      </template>
      <el-row>
        <el-col
          v-for="(data, index) in varList"
          :key="index"
          :span="6"
          style="padding: .9375rem 1.25rem;">
          <image-preview
            :src="data.url"
            height="11.25rem"
            width="100%"
            :alt="data.originalFileName"
          />
          <div
            style="text-align: center"
          >{{ data.originalFileName }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 右侧内容 -->
    <el-card v-show="isShow">
      <el-row>
        <el-row
          class="grid"
          :gutter="10">
          <el-col
            v-for="(data, index) in varList"
            :key="index"
            :span="6">
            <figure
              class="effect-jazz"
              v-on:click="fix(data.url)"
              style="margin: 1.9375rem 1.25rem;">
              <img
                v-bind:src="serverurl + data.url"
                v-bind:alt="data.originalFileName"
                style="width:100%;height:11.25rem;"/>
              <figcaption>
                <p
                  style="margin-top:1.875rem;">
                  {{ data.originalFileName }}</p>
              </figcaption>
            </figure>
          </el-col>
        </el-row>
        <el-col>
          <pagination
            :total="total"
            v-show="(total > 0 && isShow)"
            :limit.sync="queryParams.pageSize"
            :page.sync="queryParams.pageNum"
            @pagination="getList()"/>
        </el-col>
        <el-col>
          <el-button
            v-show="isFirst"
            type="primary"
            size="mini"
            @click="goUpload">上传图片
          </el-button>
          <p
            v-show="!isFirst">请先点击左侧的目录 (没有的话先去图片库中创建)</p>
        </el-col>
      </el-row>
    </el-card>

    <!-- 图片上传 -->
    <uploadDialogVue
      ref="uploadDialog"
      v-if="uploadable"
      @closeDialog="(uploadable = false)"
      :baseUrl="serverurl"
      :PARENT_ID="PICTURE_ID"
      @uploadThem="uploadThem"/>
  </div>

</template>

<script>
import list from './mixins/list'
import uploadDialogVue from './uploadDialog.vue';
import imagePreview from "@/components/ImagePreview";

export default {
  mixins: [list],
  components: {
    uploadDialogVue,
    imagePreview
  },
  data() {
    return {
      // serverurl: '/hg-api',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../../assets/styles/gallery.scss';

.yulantu {
  z-index: 9999999999999999;
  position: absolute;
  border: 3px solid #438EB9;
  display: none;
}

.grid figure {
  position: relative;
  float: left;
  overflow: hidden;
  margin: 10px 1%;
  min-width: 100px;
  // max-width: 200px;
  // max-height: 120px;
  width: 100%;
  height: auto;
  background: #3085a3;
  text-align: center;
  cursor: pointer;
}
</style>
