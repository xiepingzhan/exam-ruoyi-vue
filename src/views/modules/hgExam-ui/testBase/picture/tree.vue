<template>
    <div class="tree">
        <el-row style="margin-bottom:.625rem;" :gutter="5" v-show="win=='no'">
        <el-col :span="1.5" v-for="(item,index) in rightList" :key="index">
            <el-button :type="item.btnType" :icon="item.icon" size="mini" plain :disabled="currentDataId==undefined&&item.type!='addTree'" @click="menuClick(item.type)" >{{item.label}}</el-button>
        </el-col>
        </el-row>
        <el-tree :props="treeProp" :data="treeData" @node-click="nodeClick" @node-contextmenu="rightClick"></el-tree>
        <!-- <div v-show="menuVisible">
            <ul id="menu" class="menu">
                <li class="menu-item" v-for="(item, index) in rightList" :key="index" @click="menuClick(item.type)">
                    {{ item.label }}</li>
            </ul>
        </div> -->
    </div>
</template>

<script>
export default {
    props: {
        treeProp: {
            type: Object,
            default: () => {
                return { label: 'name', children: 'nodes' }
            }
        },
        treeData: {
            type: Array,
            default: () => []
        },
        rightList: {
            type: Array,
            default: () => [{ label: "新增", type: 'add' }]
        },
        win:{ //是否从弹框进入 
            type:String,
            default:'yes'
        }
    },
    data() {
        return {
            menuVisible: false,
            clickNode: null,
            currentDataId:undefined
        }
    },
    methods: {
        nodeClick(data, node) {
            if(node.level==1){
                this.currentDataId = data.id;
            }else{
                this.currentDataId = undefined;
            }
            this.$emit('nodeClick', data, node)
            // 关闭菜单
            // this.foo()
        },
        // 右键菜单
        rightClick(event, data, node, element) {
            this.menuVisible = false;
            // 允許第一層課可以右鍵
            if(node.level>1||this.win=='yes')return;
            if (this.rightList.length > 0) this.menuVisible = true;
            let menu = document.querySelector("#menu");
            menu.style.left = event.clientX - 180 + 'px';
            menu.style.top = event.clientY - 80 + 'px';
            document.addEventListener('click', this.foo)
            this.clickNode = node;
        },
        foo() {
            this.menuVisible = false;
            document.removeEventListener('click', this.foo)
        },
        // type 操作类型
        menuClick(type) {
            this.$emit('menuClick', type, this.clickNode);
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-item {
    display: block;
    line-height: 20px;
    text-align: center;
    margin-top: 2px;
}

.menu {
    // height: 35px;
    width: 70px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid #999;
    background-color: #f4f4f4;
    padding: 5px 0;
}

li:hover {
    background: #1790ff;
    color: white;
}
</style>