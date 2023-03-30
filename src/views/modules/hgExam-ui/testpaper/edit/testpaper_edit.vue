<template>
  <div class="app-container testpaper_list">

    <el-card>
      <div slot='header'>
        <h5>试卷参数</h5>
      </div>
      <el-form :model="pd" size="mini" ref="pd" :rules="rules" label-width="5rem">
        <el-row>
          <el-col :span="20">
            <el-form-item prop="title" label="试卷名称">
              <el-input v-model="pd.title" maxlength="30" placeholder="这里输入试卷名称" title="试卷名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="papertype" label="试卷类型">
              <el-select v-model="pd.papertype" maxlength="30" style="width:100%" placeholder="这里输入试卷名称"
                         title="试卷名称">
                <el-option v-for="(opt, optIndex) in sjList" :key="optIndex" :label="opt.dictLabel"
                           :value="opt.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--  -->
          <el-col :span="20">
            <el-col :span="8">
              <el-form-item prop="totalscore" label="卷面总分">
                <el-input v-model="pd.totalscore" disabled maxlength="30" placeholder="这里输入卷面总分"
                          title="卷面总分">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="passingscore" label="及格分数">
                <el-input v-model="pd.passingscore" type="number" min="1"
                          oninput="if(value.length>11 || value.length<1)value=value.slice(0,11)"
                          placeholder="输入及格分数" title="及格分数" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="duration" label="考试时长">
                <el-input v-model="pd.duration" type="number" min="1"
                          oninput="if(value.length>3 || value.length<1)value=value.slice(0,3)"
                          placeholder="输入考试时长" title="考试时长">
                  <template #append>分钟</template>
                </el-input>
              </el-form-item>

            </el-col>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="evaluationresults" label="考评成绩">
              <el-select v-model="pd.evaluationresults" style="width:100%">
                <el-option label="考完直接出" value="A"></el-option>
                <el-option label="人工阅卷后" value="B"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--  -->
          <el-col>
            <el-col :span="10">
              <el-form-item prop="frepeat" label="重复考试">
                <template v-if="!pd.frepeat">
                  <el-switch v-model="pd.frepeat" :active-value="true" :inactive-value="false">
                  </el-switch>
                  <span>{{ pd.frepeat ? '可以' : "仅一次" }}&nbsp;(每人)</span>
                </template>
                <template v-else>
                  <el-row>
                    <el-col :span="12">
                      <el-switch v-model="pd.frepeat" :active-value="true"
                                 :inactive-value="false">
                      </el-switch>
                      <span>{{ pd.frepeat ? '可以' : "仅一次" }}&nbsp;(每人)</span>
                    </el-col>
                    <el-col :span="12">
                      <!-- <el-form-item prop="ftwice">
                                            </el-form-item> -->
                      <el-switch v-model="pd.ftwice" :active-value="true"
                                 :inactive-value="false">
                      </el-switch>
                      <span>{{ pd.ftwice ? '补考一次' : "不限次数" }}</span>
                    </el-col>
                  </el-row>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="publishanswer" label="公布答案">
                <el-switch v-model="pd.publishanswer" :active-value="true" :inactive-value="false">
                </el-switch>
                <span>{{ pd.publishanswer ? '公布' : '不公布' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="isalone" label="是否单题">
                <el-switch v-model="pd.isalone" :active-value="true" :inactive-value="false">
                </el-switch>
                <span>{{ pd.isalone ? " 是 (一道道题作答)" : " 否 (试题全部罗列)" }}</span>
              </el-form-item>
            </el-col>
          </el-col>
          <!--  -->
          <el-col :span="12">
            <el-form-item prop="fhorder" label="题目顺序">
              <el-switch v-model="pd.fhorder"></el-switch>
              <span>
								{{ pd.fhorder ? '所有人的题目顺序相同' : '每个人的题目顺序不同' }}
							</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="false">
            <el-form-item prop="otime" label="截止日期">
              <el-date-picker
                v-model="pd.otime"
                type="date"
                style="width:100%!important;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="截止日期"
                :picker-options="pickerOptions"

              />
            </el-form-item>
          </el-col>
          <!--  -->
          <el-col v-if="false">
            <el-form-item label="考试对象" prop="examinee"
                          :rules="[{required:true,message:'请选择考试对象',trigger:'blur'}]">
              <el-select placeholder="考试对象" v-model="pd.examinee" style="width:100%" multiple @change="refreshChange">
                <el-option v-for="(item, index) in ryfzList" :label="item.dictLabel" :value="item.dictValue"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="remarks" label="试卷说明">
              <el-input type="textarea" maxlength="255" show-word-limit resize="none" :rows="4" v-model="pd.remarks"
                        placeholder="请输入试卷说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button @click="save" type="primary">{{ msg == 'add' ? '下一步' : "保存" }}</el-button>
              <el-button size="mini" @click="resetForm01">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;">
      <div slot="header">
        <h5>试卷题型</h5>
      </div>
      <div class="card-block" style="padding-bottom: 2rem">
        <template v-if="msg == 'edit'">
          <score-list :evaluationresults="pd.evaluationresults" :TESTPAPER_ID="TESTPAPER_ID" @viewQue="viewQue"
                      @uploadData="getData"></score-list>
        </template>
        <template v-else>
          <div style="height:40px;"></div>
        </template>
      </div>
    </el-card>

    <dept-yl-dialog ref="deptYl" v-if="ylable" :targetObj="targetObj" @closeDialog="ylable = false">
    </dept-yl-dialog>
  </div>
</template>

<script>
  import '@/plugins/sweetalert/js/sweetalert.min.js'
  import serice from '@/utils/request'
  import {listData} from '@/api/system/dict/data'
  import scoreList from './scoreList.vue'
  import deptYlDialog from './deptYlDialog.vue'

  export default {
    components: {
      scoreList,
      deptYlDialog
    },
    // props: {
    // 	FID: {
    // 		default: null,
    // 		type: String
    // 	}
    // },
    data() {
      return {
        //截止日期 配置项
        pickerOptions: {
          disabledDate : currentTime => {
            let currentS = new Date(this.parseTime(new Date(currentTime).getTime(),'{y}-{m}-{d}')).getTime();
            let now = new Date(this.parseTime(new Date().getTime(),'{y}-{m}-{d}')).getTime();
            return currentS < now ? true : false
          },
        },
        FID: null,//父ID
        ryfzList: [],
        sjList: [],
        targetObj: {t: '', selectedtopics: ''},
        queList: [],
        ylable: false,
        TESTPAPER_ID: '',		//主键ID
        pd: {
          title: "",			//试卷名称
          papertype: '',		//试卷类型
          totalscore: '',		//试卷总分数
          passingscore: '',	//及格分数
          duration: "",		//考试时长
          // examinee: [],//人员分组
          evaluationresults: 'A',	//出成绩方式
          frepeat: true,			//是否可以重复进行考试(每人)
          ftwice: true,			//补考一次
          face: true,				//人脸识别
          isalone: false,			//一个个试题考试还是全部列出试题进行考试
          publishanswer: true,	//是否公布答案
          remarks: '',
          fhorder: true,			//题目顺序，默认都相同
          // otime？
        },					//存放字段参数
        rules: {
          title: [{required: true, message: '请填写试卷名称', trigger: 'blur'}],			//试卷名称
          papertype: [{required: true, message: '请选择试卷类型', trigger: 'blur'}],	//试卷类型
          totalscore: [{required: false, message: '', trigger: 'blur'}],		//试卷总分数
          passingscore: [{required: true, message: '请填写及格分数', trigger: 'blur'}],	//及格分数
          duration: [{required: true, message: '请填写考试时长', trigger: 'blur'}],		//考试时长
          otime: [{required: true, message: '请填写截止日期', trigger: 'blur'}],
          evaluationresults: [{required: true, message: '请填写考试成绩', trigger: 'blur'}],	//出成绩方式
          frepeat: [{required: false, message: '', trigger: 'blur'}],			//是否可以重复进行考试(每人)
          ftwice: [{required: false, message: '', trigger: 'blur'}],			//补考一次
          face: [{required: false, message: '', trigger: 'blur'}],				//人脸识别
          isalone: [{required: false, message: '', trigger: 'blur'}],			//一个个试题考试还是全部列出试题进行考试
          publishanswer: [{required: false, message: '', trigger: 'blur'}],	//是否公布答案
          fhorder: [{required: false, message: '', trigger: 'blur'}],			//题目顺序，默认都相同		},
          remarks: [{required: true, message: '请输入试卷说明', trigger: 'blur'}],			//题目顺序，默认都相同		},
          examinee: [{required: false, message: '请输入人员分组', trigger: 'blur'}],
        },
        STATE: 'edit',			//状态
        serverurl: '',			//后台地址
        msg: 'add',
        add: false,				//增
        cha: false,				//列表
        edit: false,				//修改
      }
    },

    methods: {
      resetForm01() {
        this.resetForm('pd');
        this.msg = 'add'
      },
      refreshChange() {
        this.$forceUpdate()
      },
      initRyfz() {
        serice({
          method: 'get',
          url: '/system/group/info',
          params: {
            tm: new Date().getTime()
          }
        }).then(data => {
          if (data && data.length > 0) {
            this.ryfzList = data.map(item => {
              return {
                dictLabel: item.zb,
                dictValue: item.zb
              }
            })
          }
        })
      },
      //初始执行
      init() {
        let query = this.$route.query;
        if (query && query.id) this.FID = query.id;
        let FID = this.FID;	//当接收过来的FID不为null时,表示此页面是修改进来的
        if (null != FID) {
          // 修改
          this.msg = 'edit';
          this.TESTPAPER_ID = FID;
          this.getData();
        }
        setTimeout(() => {
          this.initRyfz();
          this.getDict();
        }, 200);
      },

      //去保存
      save() {
        this.$refs.pd.validate(valid => {
          if (valid) {
            if (this.pd.totalscore == '' || this.pd.totalscore == undefined || this.pd.totalscore < 1) {
              this.pd.totalscore = 0;
            }
            if(this.msg != 'add'&&(this.pd.totalscore<this.pd.passingscore)){
              return this.$modal.msgWarning("请添加试题,满足总分大于等于及格分")
            }
            //              examinee: this.pd.examinee && this.pd.examinee.length > 0 ? this.pd.examinee.join(',') : '',
            let data =  {
              ...this.pd,
              tm: new Date().getTime()
            }
            if(this.TESTPAPER_ID!=''&&this.TESTPAPER_ID!=undefined&&this.TESTPAPER_ID!=null){
              data.testpaperId = this.TESTPAPER_ID
            }
            serice({
              method: this.msg == 'add' ? 'post' : 'put',
              url: this.msg == 'add' ? '/testpaper/add' : '/testpaper/update',
              data
            }).then(res => {
              let {code, msg, data} = res;
              if (code != 200) return this.$message.error(msg);
              // 逻辑

              if (this.msg == 'add') {
                this.msg = 'edit'
                this.TESTPAPER_ID = data;
              } else {
                swal({
                  title: '保存成功',
                  text: '保存成功即將跳转至试卷列表...',
                  icon: 'success',
                  buttons: false,
                  timer: 1500
                })
                setTimeout(() => {
                  this.$router.push({
                    name:'Testpaper_list',
                    query: {
                      state: 'edit'
                    }
                  })
                }, 800)
              }
            })

          }
        })
      },

      //根据主键ID获取数据
      getData() {
        serice({
          method: 'get',
          url: '/testpaper/' + this.TESTPAPER_ID,
          // params: {
          // 	tm: new Date().getTime(),
          // 	testpaperId: this.TESTPAPER_ID
          // }
        }).then(res => {
          let {code, msg, data} = res;
          if (code != 200) {
            this.$message.error(msg)
            return;
          }
          this.pd = data;
          // this.pd.examinee = data.examinee && data.examinee.length > 0 ? data.examinee.split(',') : [];
          this.pd.frepeat = data.frepeat == 'true' ? true : false;
          this.pd.publishanswer = data.publishanswer == 'true' ? true : false;
          this.pd.fhorder = data.fhorder == 'true' ? true : false;
          this.pd.ftwice = data.ftwice == 'true' ? true : false;	//是否可以补考一次
          this.pd.face = data.face == 'true' ? true : false;//人脸识别
          this.pd.isalone = data.isalone == 'true' ? true : false;//单题考试
        })
      },

      //新增时获取角色列表
      getRoleList() {
        //发送 post 请求
        $.ajax({
          xhrFields: {
            withCredentials: true
          },
          type: "POST",
          url: httpurl + 'role/getRoleList',
          data: {tm: new Date().getTime()},
          dataType: "json",
          success(data) {
            if ("success" == data.result) {
              this.roleList = data.roleList;				//角色列表
            } else if ("exception" == data.result) {
              showException("获取角色", data.exception);	//显示异常
              $("#showform").show();
              $("#jiazai").hide();
            }
          }
        }).done().fail(function () {
          swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
          $("#showform").show();
          $("#jiazai").hide();
        });
      },

      //获取数据字典数据
      getDict() {
        listData({
          tm: new Date().getTime(),
          dictType: 'testpapertype',
          pageSize: 10,
          pageNum: 1
        }).then(res => {
          let {code, rows} = res;
          this.sjList = rows;
        })
      },

      //查看题目
      viewQue(T, SELECTEDTOPICS) {
        this.ylable = true;
        // this.targetObj = { t: T, selectedtopics: SELECTEDTOPICS }

        this.$set(this.targetObj, 't', T)
        this.$set(this.targetObj, 'selectedtopics', SELECTEDTOPICS)
        this.$nextTick(() => {
          this.$refs.deptYl.visible = true;
        })
      },
    },

    mounted() {
      this.init();
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-col {
    .el-form-item {
      width: 100%;

      .el-form-item__content {
        width: calc(100% - 90px);
      }

      .el-input__inner {
        width: 100%
      }
    }
  }

  //
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
