export default {
  data() {
    return {
      dict: {
        filetype: [
          {label: 'word', value: '01'},
          {label: 'excel', value: '02'}
        ]
      },
      queryForm: {
        name: undefined,
        filetype: undefined
      },
      //数据资源列表数据
      formList: [
        {
          label: '资源名称',
          prop: 'name',
          type: 'input',
          isSearch: true,
          placeholer: '请输入资源名称'
        },
        {
          label: '资源分类',
          prop: 'filetype',
          isSearch: false,
          type: 'select',
          placeholer: '请输入资源分类'
        },
        {
          label: '文件名称',
          type: 'input',
          prop: 'filename',
          isSearch: false
        }
      ],
      datalist: [
        {
          name: '资源一', filetype: 'word', filename: '七千万'
        },

        {
          name: '资源一', filetype: 'word', filename: '七千万'
        },
      ]
    }
  }
}
