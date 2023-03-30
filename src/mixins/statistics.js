export default {
  data() {
    return {
      //  柱状图
      barOptions: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {},
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value'
        },
        grid:{
          left:'5%',
          right:'1%'
        },
        series: [
          {
            type: 'bar',
          },
          {
            type: 'bar',
          },
          {
            type: 'bar',
          },
        ],
        dataset: {
          // dimensions:['product','2017','2018','2019'],
          source: [
            ['黎明着凉黑暗', '2017', '2018', '2019'],
            ['周一', 20, 130, 40],
            ['周二', 120, 30, 40],
            ['周三', 20, 130, 140],
            ['周四', 30, 20, 50],
          ]

        }
      },
      //  折线图
      lineOptions: {
        tooltip: {
          trigger: 'axis',
        },

        grid:{
          left:'5%',
          right:'1%'
        },
        legend: {},
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
          },
          {
            type: 'line',
          },
          {
            type: 'line',
          },
        ],
        dataset: {
          // dimensions:['product','2017','2018','2019'],
          source: [
            ['黎明着凉黑暗', '2017', '2018', '2019'],
            ['周一', 20, 130, 40],
            ['周二', 120, 30, 40],
            ['周三', 20, 130, 140],
            ['周四', 30, 20, 50],
          ]
        }
      },
      //  饼图
      pieOptions: {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        dataset:{
          source:[
            ['product','次序'],
            ['product1',2],
            ['product4',21],
            ['product3',11],
            ['product2',12],
          ]
        },
        series:[
          {
            type:'pie',
            radius:'50%',
          }
        ]
      },
      //  雷达图
      radarOptions: {
        legend:{},
        tooltip:{
          trigger:'item'
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      }
    }
  }
}
