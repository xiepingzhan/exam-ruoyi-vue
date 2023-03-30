/**
 * 题库管理
 * */

import serice from '@/utils/request'
import {
  listData
} from "@/api/system/dict/data";
export default {
  data() {
    return {
      type: '',
      queryParams: {
        pageSize: 10,
        pageNum: 1
      },
      title: '',
      visible: false,
      targetId: null,
      selection: [],
      tableList: [],
      total: 0,
      requestOptions: {
        baseUrl: '',
      },
      queryForm: { //查询表单
        title: '',
        level: '',
        type: '',
        state: ''
      },
      rules: {
        title: [{
          required: false,
          trigger: 'blur'
        }],
        level: [{
          required: false,
          trigger: 'blur'
        }],
        type: [{
          required: false,
          trigger: 'blur'
        }],
        state: [{
          required: false,
          trigger: 'blur'
        }]
      },
      // 字典数据
      dict: {
        testquestionsstate: [{
            dictLabel: "启用",
            dictValue: "true"
          },
          {
            dictLabel: "停用",
            dictValue: "false"
          },
        ]
      },
      FormList: [{
          label: '题目',
          prop: 'title',
          type: 'input'
        },
        {
          label: '试题类型',
          prop: 'type',
          type: 'select'
        },
        {
          label: '试题等级',
          prop: 'level',
          type: 'select'
        },
        {
          label: '状态',
          prop: 'state',
          type: 'select'
        }
      ]

    }
  },
  created() {
    this.getDict('testquestionstype').then(res => {
      // this.dict['testquestionstype'] = res
      this.$set(this.dict, 'testquestionstype', res)
    })

    this.getDict('testquestionslevel').then(res => this.$set(this.dict, 'testquestionslevel', res))
    this.initList()
    // console.log(this.type, "-----------")

  },
  methods: {
    handleSelect(rows) {
      this.selection = rows;
    },
    initList() {
      // 获取form表单查询信息
      let formData = new FormData();
      for (let i in this.queryForm) {
        formData.append(i, this.queryForm[i])
      }
      serice({
        method: "get",
        url: `${this.requestOptions.baseUrl}/list`,
        params: {
          ...this.queryForm,
          // showCount: this.queryParams.pageSize,
          // currentPage: this.queryParams.pageNum

          pageSize: this.queryParams.pageSize,
          pageNum: this.queryParams.pageNum
        }
      }).then(res => {
        let {
          code,
          msg,
          rows,
          total
        } = res;
        if (code != 200) {
          this.$message.error(msg)
          return
        }
        this.total = total;
        this.tableList = rows;
      })
    },
    refreshList() {
      this.resetForm('myForm')
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
      this.initList();
    },
    // 新增
    handleAdd(id, title) {
      this.targetId = id;
      this.visible = true;
      this.title = title
      this.$nextTick(() => {
        this.$refs.updateDialog.visible = true;
      })
    },
    closeDialog() {
      this.visible = false
      this.targetId = null
    },
    // type add新增  edit修改
    savefn(form, type) {
      let data = new Object();
      for (let i in form) {
        data[i] = form[i];
      }
      serice({
        method: type == 'edit' ? 'put' : 'post',
        url: type == 'edit' ? `${this.requestOptions.baseUrl}` : this.type == 'judgeMentquestion' || this.type == 'multipleSelection' || this.type == 'singleSelection' ? `${this.requestOptions.baseUrl}/${type}` : `${this.requestOptions.baseUrl}`,
        data
      }).then(res => {
        if (200 == res.code) {
          if (type == 'add') {
            this.$message.success("新增成功");

          } else {
            this.$message.success("修改成功");

          }
          setTimeout(() => {
            this.initList()
            this.closeDialog()
          }, 800);
        }
      })

    },

    async getDict(params) {
      let res = await listData({
        tm: new Date().getTime(),
        dictType: params,
        pageSize: 10,
        pageNum: 1
      })
      let {
        code,
        rows
      } = res;
      return rows;
    },
    deleteThis(ids) {
      let newIds = ''
      if (!ids) {
        if (this.selection.length == 0) return this.$message.warning("请选择要删除的数据")
        newIds = this.selection.map(item => {
          let id = '';
          if (item.singleelectionId) id = item.singleelectionId;
          if (item.multipleselectionId) id = item.multipleselectionId;
          if (item.judgementquestionId) id = item.judgementquestionId;
          if (item.completionId) id = item.completionId;
          if (item.largequestionId) id = item.largequestionId;
          if (item.compoundquestionId) id = item.compoundquestionId;
          return id;
        }).join(',')

      } else {
        newIds = ids;
      }
      this.$confirm("是否执行删除操作？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        serice({
          method: 'delete',
          url: `${this.requestOptions.baseUrl}/${newIds}`,
        }).then(res => {
          this.initList()
        })
        return
      })

    }
  }
}
