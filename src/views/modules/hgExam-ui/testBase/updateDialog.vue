<template>
  <el-dialog :title="title" :visible.sync="visible" class="hgExam" :before-close="closeDialog" :modal="false"
             :close-on-click-modal="false">
    <el-card>
      <el-form :model="form" ref="myForm" :rules="rules" label-width="60px">
        <el-form-item label="题目" prop="title">
          <el-input v-model="form.title" placeholder="这里输入题目" v-if="type=='singleSelection'||
                    type=='multipleSelection'||type=='completion'||type=='judgeMentquestion'
                    ">
          </el-input>
          <el-input
            v-model="form.title"
            placeholder="这里输入题目"
            v-if="type=='largequestion'"
            type="textarea"
            :rows="4"
            resize="none"
          />
          <!-- 复合体 -->
          <test-paper_picture-vue
            v-if="type=='compoundquestion'"
            v-model="form.title"
            :minHeight="100"
          />
        </el-form-item>
        <el-form-item prop="filepath" label="图片" v-if="type!='compoundquestion'">
          <el-row>
            <el-col :span="21">
              <template v-if="form.filepath!=''&&form.filepath!=undefined&&form.filepath!=null">
                <el-popover trigger="hover">
                  <el-input slot="reference" v-model="form.filepath" placeholder="请点击右侧按钮,选择图片（非必填）"/>
                  <img v-bind:src="serverurl + form.filepath" style="width:400px;height:300px;">
                </el-popover>
              </template>
              <template v-else>
                <el-input
                  v-model="form.filepath"
                  placeholder="请点击右侧按钮,选择图片（非必填）"/>
              </template>
            </el-col>
            <el-col :span="3" style="text-align:center">
              <el-button type="text" icon="el-icon-picture" title="选择图片"
                         @click="selectPictures"></el-button>
              <el-button type="text" icon="el-icon-minus" title="清除"
                         @click="form.filepath = ''"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="fhfoption" label="选项"
                      v-show="(baseUrl != '/judgementquestion')&&(type=='singleSelection'||type=='multipleSelection')">
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.fhfoption" ref="FHFOPTION" id="FHFOPTION"
                        placeholder="这里输入选项（输完按回车键）" maxlength="2000"/>
            </el-col>
            <el-col :span="3" style="text-align:center">
              <el-button type="text" icon="el-icon-plus" title="添加" @click="addField"></el-button>
              <el-button type="text" icon="el-icon-minus" title="清除" @click="removeField"></el-button>
            </el-col>
            <table class="table-bordered" style="width: 100%" border="1">
              <tbody id="fields"></tbody>
            </table>
          </el-row>
        </el-form-item>
        <el-form-item prop="answer" label="答案"
                      v-if="baseUrl != '/judgementquestion'&&(type=='singleSelection'||type=='multipleSelection')">
          <el-input v-model="form.answer" placeholder="请从上方选项中,选择答案" disabled>
            <!--<el-input v-model="form.answer" placeholder="这里输入大写字母，不要加标点符号" disabled>-->
          </el-input>
        </el-form-item>
        <el-form-item prop="answer" label="答案"
                      v-if="(type=='largequestion'||type=='compoundquestion'||type=='completion')">
          <el-input
            v-model="form.answer"
            placeholder="这里输入答案"
            :type="type=='completion'?'text':'textarea'"
            :rows="4"
            resize="none"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="type" label="类型">
              <el-select v-model="form.type" style="width:100%" clearable filterable placeholder="请选择类型">
                <el-option v-for="(opt, optIndex) in typeList" :key="optIndex" :label="opt.dictLabel"
                           :value="opt.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="level" label="级别">
              <el-select v-model="form.level" style="width:100%" clearable filterable placeholder="请选择级别">
                <el-option v-for="(opt, optIndex) in levelList" :key="optIndex" :label="opt.dictLabel"
                           :value="opt.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="baseUrl == '/judgementquestion'">
          <el-col :span="12">
            <el-form-item label="答案">
              <el-switch v-model="form.answer" active-color="#13ce66" inactive-color="#ff4949"
                         active-value="true" inactive-value="false">
              </el-switch>
              <span style="margin-left:5px;">{{ form.answer == 'true' ? '正确' : '错误' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949"
                         :active-value="true" :inactive-value="false">
              </el-switch>
              <span style="margin-left:5px;">{{ form.state == true ? '启用' : '停用' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="state" v-if="baseUrl != '/judgementquestion'">
          <el-switch v-model="form.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="true"
                     :inactive-value="false">
          </el-switch>
          <span style="margin-left:5px;">{{ form.state == true ? '启用' : '停用' }}</span>
        </el-form-item>
        <el-form-item prop="remarks" label="解析">
          <el-input v-model="form.remarks" placeholder="这里输入答案解析">
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" v-if="id" @click="updateFn">确定</el-button>
        <el-button type="primary" v-else @click="save">确定</el-button>
        <el-button @click="closeDia">取消</el-button>
      </div>
    </el-card>
    <picture-dialog v-if="pictureVisible" append-to-body ref="pictureDialog" @changeFilePath="changeFilePath"
                    @closeDialog="pictureVisible = false"></picture-dialog>
  </el-dialog>
</template>

<script>
  import serice from "@/utils/request";
  import testPaper_pictureVue from "@/components/Editor/testPaper_picture.vue";
  import pictureDialog from './pictureDialog.vue';

  var arLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var arField = [];
  var index = 0;
  var str = '';
  var arrANSWER = "";

  export default {
    components: {pictureDialog, testPaper_pictureVue},
    props: ['id', 'title', 'baseUrl', 'levelList', 'typeList', 'type'],
    watch: {
      id: {
        handler(newV) {
          if (newV) {
            this.$nextTick(() => {
              this.initForm(newV);
            })
          }
        },
        immediate: true
      },

    },
    data() {
      return {
        serverurl: process.env.VUE_APP_BASE_API,
        pictureVisible: false,
        win: false,
        form: {
          state: 'false',
          level: '',
          type: '',
          answer: '',
          title: '',
          filepath: '',
          fhfoption: "",
          remarks: ''

        },
        visible: false,
        rules: {
          state: [{required: false, trigger: 'blur'}],
          level: [{required: true, message: '请选择级别', trigger: 'blur'}],
          type: [{required: true, message: '请选择类型', trigger: 'blur'}],
          answer: [{required: true, message: '请输入正确答案', trigger: 'blur'}],
          title: [{required: true, message: '请输入题目信息', trigger: 'blur'}],
          filepath: [{required: false, trigger: 'blur'}],
          // fhfoption: [{ required: false, trigger: 'blur' }],
          remarks: [{required: false, trigger: 'blur'}]
        },

      }
    },
    mounted() {
      this.$nextTick(() => {
        let that = this;

        function selection(event) {
          let target = event.target;
          let findInput = target.querySelector('input')
          if (!findInput) {
            if (target.nodeName.toLocaleLowerCase() == 'input') {
              let id = target.id;
              if (target.type.toLocaleLowerCase() == 'checkbox') {
                // 多选
                if (target.checked) {
                  str = str + arLetter[id.substring(1)] + ',fh,';
                } else {
                  str = str.replace(arLetter[id.substring(1)] + ',fh,', '');
                }

                arrANSWER = str.split(',fh,');
                var stra = (arrANSWER.sort());
                that.form.answer = stra.join('');
              } else {
                // 单选
                that.form.answer = arLetter[id.substring(1)];
                target.checked = true;
              }

            }
          } else {
            let id = findInput.getAttribute('id');

            if (findInput.type.toLocaleLowerCase() == 'checkbox') {
              findInput.checked = !findInput.checked

              if (findInput.checked) {
                str = str + arLetter[id.substring(1)] + ',fh,';
              } else {
                str = str.replace(arLetter[id.substring(1)] + ',fh,', '');
              }
              arrANSWER = str.split(',fh,');
              var stra = (arrANSWER.sort());
              that.form.answer = stra.join('');
            } else {
              that.form.answer = arLetter[id.substring(1)];
              findInput.checked = true;

            }

          }
        }

        setTimeout(() => {
          document.querySelector('#fields').addEventListener('click', selection)

        }, 600)
        let vm = this;
        //回车事件
        document.onkeydown = function (e) {
          // e.preventDefault();
          // var key = window.event.keyCode;
          var key = e.keyCode;
          if (key == 13 && e.target.id == 'FHFOPTION') {
            vm.addField();
            e.preventDefault()
          }
        }
      })
    },
    beforeDestroy() {
      index = 0;
      arField = []
      str = ''
      arrANSWER = ''
    },
    methods: {
      // 图片开关
      selectPictures() {
        this.pictureVisible = true;
        this.win = 'yes';
        this.$nextTick(() => {
          this.$refs.pictureDialog.visible = true;
        })
      },
      closeDia() {
        this.$emit('closeDialog')
      },
      closeDialog() {
        this.closeDia()
      },
      save() {
        this.$refs.myForm.validate(valid => {
          if (valid) {
            this.form.foption = arField.join(",fh,")
            this.$emit('savefn', this.form, 'add')
          }
        })
      },
      updateFn() {
        this.$refs.myForm.validate(valid => {
          if (valid) {
            this.form.foption = arField.join(",fh,")
            this.$emit('savefn', this.form, 'edit')
          }
        })
      },

      //添加选项
      addField() {
        if (index > 25) {
          this.$message.warning("不能再添加了!", "最多只能添加26个选项!", "error");
          this.form.fhfoption = '';
          return false;
        }
        if ('' != this.form.fhfoption.trim()) {
          arField[index] = arLetter[index] + ' . ' + this.form.fhfoption;
          this.appendC(arField[index]);
          this.form.fhfoption = '';
        } else {
          this.$alert("请输入选项", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(_ => {
            this.form.fhfoption = '';
            this.$refs.FHFOPTION.focus();
          })
        }
      },

      //删除数组添加元素并重组列表
      removeField() {
        this.$$("#fields").html('');
        this.$set(this.form, 'answer', '');
        //多选项 答案指控
        str=''
        arField.pop();
        index = 0;
        for (var i = 0; i < arField.length; i++) {
          this.appendC(arField[i]);
        }
      },
      //追加选项列表(新增进入)
      appendC: function (value) {
        if (this.baseUrl == '/singleelection') {
          this.$$("#fields").append('<tr><td><div class="radio radio-primary d-inline">' +
            '<input  type="radio" name="radio-p-1" id="f' + index + '">' +
            '<label for="f' + index + '" class="cr">' + value + '</label>' +
            '</div></td></tr>');
          index++;
        } else if (this.baseUrl == '/multipleselection') {
          this.$$("#fields").append('<tr><td><div class="checkbox checkbox-primary checkbox-fill d-inline">' +
            '<input  type="checkbox" name="radio-p-1" id="f' + index + '">' +
            '<label for="f' + index + '" class="cr">' + value + '</label>' +
            '</div></td></tr>');
          index++;
        }
      },
      //追加选项列表(修改进入)
      appendCFromEdit: function (value, ANSWER) {
        if (this.baseUrl == '/singleelection') {
          if (arLetter[index] == ANSWER) {
            this.$$("#fields").append('<tr><td><div class="radio radio-primary d-inline"><input  type="radio" name="radio-p-1" id="f' + index + '" checked><label for="f' + index + '" class="cr">' + value + '</label></div></td></tr>');
          } else {
            this.$$("#fields").append('<tr><td><div class="radio radio-primary d-inline"><input  type="radio" name="radio-p-1" id="f' + index + '"><label for="f' + index + '" class="cr">' + value + '</label></div></td></tr>');
          }
          index++;
        } else if (this.baseUrl == '/multipleselection') {
          if (ANSWER.indexOf(arLetter[index]) != -1) {
            str = str + arLetter[index] + ',fh,';
            this.$$("#fields").append('<tr><td><div class="checkbox checkbox-primary checkbox-fill d-inline"><input  type="checkbox" name="radio-p-1" id="f' + index + '" checked><label for="f' + index + '" class="cr">' + value + '</label></div></td></tr>');
          } else {
            this.$$("#fields").append('<tr><td><div class="checkbox checkbox-primary checkbox-fill d-inline"><input  type="checkbox" name="radio-p-1" id="f' + index + '"><label for="f' + index + '" class="cr">' + value + '</label></div></td></tr>');
          }
          index++;
        }

      },
      // form.filePath赋值
      changeFilePath(value) {
        this.form.filepath = value;
      },
      initForm() {
        serice({
          method: 'get',
          url: `${this.baseUrl}/${this.id}`,
        }).then(res => {
          let {code, ...obj} = res;
          //参数map
          this.form.state = obj.data.state == 'true' ? true : false;
          this.form.filepath = obj.data.filepath;
          this.form.type = obj.data.type;
          this.form.level = obj.data.level;
          this.form.answer = obj.data.answer;
          this.form.title = obj.data.title;
          this.form.filepath = obj.data.filepath;
          this.form.remarks = obj.data.remarks;
          if (obj.data.singleelectionId) this.form.singleelectionId = obj.data.singleelectionId;
          if (obj.data.judgementquestionId) this.form.judgementquestionId = obj.data.judgementquestionId;
          if (obj.data.multipleselectionId) this.form.multipleselectionId = obj.data.multipleselectionId;
          // 填空 问答题  复合题
          if (obj.data.completionId) this.form.completionId = obj.data.completionId;
          if (obj.data.largequestionId) this.form.largequestionId = obj.data.largequestionId;
          if (obj.data.compoundquestionId) this.form.compoundquestionId = obj.data.compoundquestionId;

          if (obj.data.singleelectionId || obj.data.multipleselectionId) {
            arField = obj.data.foption.split(',fh,');
            for (var i = 0; i < arField.length; i++) {
              this.appendCFromEdit(arField[i], obj.data.answer);
            }
          }

        })

      }
    }
  }

</script>

<style lang="scss" scoped>
  .table-bordered {
    border: 1px solid #eaeaea;
  }

  .table-bordered td,
  .table-bordered th {
    border: 1px solid #eaeaea;
  }

  ::v-deep .radio input[type=radio] + .cr:before {
    margin-top: 0 !important;
    margin-left: 7px !important;
    vertical-align: middle !important;
  }

  ::v-deep .radio input[type=radio] + .cr:after {
    margin-top: 10.3px !important;
    margin-left: 5px !important;
  }

</style>
