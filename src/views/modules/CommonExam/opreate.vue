<template>
<!--操作区-->
  <el-card >
    <div class="myTitle">{{title}}</div>
    <div class="md8">
      <fieldset>
        <legend>{{legend}}</legend>
          <el-form
            size="small"
            :model="dataForm"
            label-width="5.5rem"
            :rules="rules"
            ref="myForm"
          >
            <el-form-item label="分类代号" prop="topicType">
              <el-input
                v-model="dataForm.topicType"
                disabled />
            </el-form-item>

            <el-form-item label="内容名称" prop="topicName">
              <el-input
                v-model="dataForm.topicName"
                disabled />
            </el-form-item>

            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="试题数量" prop="topicNum">
                  <el-input-number
                    :controls="false"
                    :min="0"
                    :max="max"
                    style="width: 100%"
                    v-model="dataForm.topicNum" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button
                  size="small"
                  @click="handleEdit"
                  :disabled="currentObj=='{}'||currentObj=='null'"
                  type="primary">编辑</el-button>
              </el-col>
            </el-row>
          </el-form>
      </fieldset>
    </div>
    <div class="md8" >
      <fieldset>
        <el-table
        :data="datalist"
        max-height="280px"
        >
          <el-table-column label="题型" prop="type" align="center" >
            <template v-slot="{row}">
              <dict-tag
                :options="test_type"
                :value="row.type"
              />
            </template>

          </el-table-column>
          <el-table-column label="试题数量" prop="topicNum" align="center" />
          <el-table-column label="每题分数" prop="score" align="center" >
            <template v-slot="{row}">
              <el-input-number
                :controls="false"
                @change="changeData(row.score,row)"
                :min="1"
                :max="100"
                style="width: 100%"
                v-model="row.score"/>
            </template>

          </el-table-column>
          <el-table-column label="总分" prop="totalScore" v-if="activeIndex==3" align="center" />
        </el-table>
        <el-form
          v-if="activeIndex==3"
          class="md8"
          :model="myForm"
          ref="myForm1"
          size="mini"
          inline>
          <el-form-item
            label="考试时间"
            prop="examDuration"
            :rules="[{required:true,message:'请输入合法的考试时间',trigger:'blur'}]"
          >
            <el-input-number
              :controls="false"
              :min="1"
              style="width: calc(100% - 2rem)"
              v-model="myForm.examDuration"/>
            <span>min</span>
          </el-form-item>
          <el-form-item label="总分">
            <el-input disabled v-model="totalScore" />
          </el-form-item>
        </el-form>
      </fieldset>
    </div>
    <slot></slot>

  </el-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['examObj']),
    datalist() {
      let arr = []
      let arrName = ''
      if (this.activeIndex == 2) {
        arrName = 'questionPool'
      } else {
        arrName = 'testPaperPool'
      }
      let examPool = JSON.parse(this.examPool).questionInfo
      for (let i in examPool) {
        arr = arr.concat({
          type: i,
          topicNum: examPool[i][arrName]?examPool[i][arrName].reduce((prev, cur) => prev + Number(cur.topicNum), 0):0,
          score: examPool[i].score ? examPool[i].score : 1,
          totalScore: ((examPool[i][arrName]?examPool[i][arrName].reduce((prev, cur) => prev + Number(cur.topicNum), 0):0)) * (examPool[i].score ? examPool[i].score : 1)
        })
      }
      this.totalScore =arr.reduce((prev,cur)=>prev+cur.totalScore,0)
      return arr
    }
  },
  name: "opreate",
  props: {
    test_type:{
      type:Array,
      default:()=>[]
    },
    examPool: {
      type: String,
      default: () => undefined
    },
    activeIndex: {
      type: Number,
      default: 2
    },
    currentObj: {
      type: String,
      default: () => undefined
    },
    title: {
      type: String,
      default: () => undefined
    },
    legend: {
      type: String,
      default: () => undefined
    }
  },
  watch: {
    'myForm.examDuration': {
      handler(newV) {
        if (newV) {
          this.$store.state.commonExam.examObj.examInfo.examDuration = newV;
        }
      }
    },
    currentObj: {
      handler(newV) {
        if (newV && newV != "{}" && newV != 'null' && newV != null) {
          this.dataForm = JSON.parse(newV);
          this.max = JSON.parse(newV).topicNum ? Number(JSON.parse(newV).topicNum) ? Number(JSON.parse(newV).topicNum) : 0 : 0
        } else {
          this.dataForm.topicName = undefined
          this.dataForm.topicType = undefined
          this.dataForm.topicNum = undefined
        }
      }, deep: true,
      immediate: true
    }
  },
  data() {
    return {
      totalScore:0,
      examDuration: 60,
      // datalist:[],
      dataForm: {
        topicName: undefined,
        topicType: undefined,
        topicNum: undefined,

      },
      myForm: {
        examDuration: undefined
      },
      max: undefined,
      isShow: false,
      rules: {
        topicName: [{required: false, trigger: 'blur'}],
        topicType: [{required: false, trigger: 'blur'}],
        topicNum: [{required: false, trigger: 'blur'}],
      },
    }
  },
  methods: {
    //编辑
    handleEdit() {
      this.$emit('changeStsl', this.dataForm.topicNum)

    },
    submitFn() {
      return new Promise((resolve, reject) => {
        this.$refs.myForm1.validate(valid => {
          if (valid) {
            let arr = []
            for (let i in this.examObj.questionInfo) {
              if (this.examObj.questionInfo[i].testPaperPool.length > 0) {
                arr.push(true)
              } else {
                arr.push(false)
              }
            }
            if (arr.some(item => item == true)) {
              resolve(true)
            } else {
              resolve(false)
              this.$modal.msgWarning("请抽取相应的试题")
            }
          } else {
            resolve(false)
          }
        })
      })
    },
    changeData(value, data) {
      let type = data.type
      let index = this.datalist.findIndex(item => item.type == data.topicType)

      this.$set(data, 'totalScore', value * data.topicNum)
      this.$set(data, 'score', value)
      this.$emit('changeExamPool', type, value, 'score',index)
      this.totalScore = this.datalist.reduce((prev,cur)=>prev+cur.totalScore,0)
    }
  },
}
</script>

<style scoped>
.md8{
  padding:8px 0;
  box-sizing: border-box;
}
.myTitle{
  text-align: center;
  font-size:26px;
  font-weight: bold;
  color: red;
  padding:30px 0;
  box-sizing: border-box;
}
</style>
