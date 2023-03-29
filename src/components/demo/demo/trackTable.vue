
<template>
    <div class="app-container comtable">
        <el-table class="list-table" :data="table_data" :height="800" :border="true" header-align="center">
            <el-table-column label="序号" type="index" sortable fixed="left" :align="'center'" />
            <el-table-column :align="'center'" v-for="(item, index) in columnObject.column.fixed" :key="item.prop"
                :prop="item.prop" :label="item.label" :fixed="item.fixed">
                <template #default="scope">
                    <div>
                        <span :style="[{ 'color': scope.row.unduty > 0 ? 'red' : '#555' }]"
                            v-if="item.prop === 'unduty'">{{ scope.row[item.prop] }}</span>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :align="'center'" v-for="(item, index) in columnObject.column.day" :key="item.prop"
                :prop="item.prop" :label="item.label" width="50px" :class-name="item.prop == today ? 'todayStyle' : ''">
                <template #default="scope">

                    <div @click.stop="edit ? cellClick(scope, $event, item.prop, index) : ''" class="date show" :class="[
                        (scope.row[item.prop] === 0) ? 'zero-color' : '',
                        (scope.row[item.prop] === 4) ? 'four-color' : '',
                        (scope.row[item.prop] === 8) ? 'eight-color' : '',
                        scope.row[item.prop + '_attendance'] === 1 ? '' : 'warn',
                    
                    ]">
                        <span slot="reference" class="show">
                            {{ scope.row[item.prop + '_attendance'] === 1 ? '✔' : '' }}
                            {{ scope.row[item.prop + '_attendance'] === 0 ? '缺勤' : '' }}
                        </span>
                        <!-- <span></span> -->
                    </div>

                </template>
            </el-table-column>
        </el-table>
        <!-- <div @click.stop="showDialog($event)"> -->
        <div class="dialog show trackTableDialog" v-if="popoverShow" :style="postionStyle">
            <div id="triangle-up"></div>
            <el-tabs v-model="activeName" class="trackTab show" @tab-click="handleClick" v-if="Item.prop <= today">
                <el-tab-pane label="出勤状况" name="0">
                    <ul>
                        <li @click="handleLiClick(Item, val, Item.prop + '_attendance')" class="show"
                            :class="Item.row[Item.prop + '_attendance'] === val.value ? 'active-li' : ''"
                            v-for="(val, index) in [{ 'label': '出勤', value: 1 }, { 'label': '缺勤', value: 0 }]">
                            {{ val.label }}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="班次" name="1">
                    <ul>
                        <li @click="handleLiClick(Item, val, Item.prop)" class="show"
                            :class="Item.row[Item.prop] === val.value ? 'active-li' : ''"
                            v-for="(val, index) in [{ 'label': '0点班', value: 0 }, { 'label': '4点班', value: 4 }, { 'label': '8点班', value: 8 }, { 'label': '休假', value: '' }]">
                            {{ val.label }}</li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
            <el-tabs v-model="activeName" class="trackTab show" v-else>
                <el-tab-pane label="班次" name="0">
                    <ul>
                        <li @click="handleLiClick(Item, val, Item.prop)" class="show"
                            :class="Item.row[Item.prop] === val.value ? 'active-li' : ''"
                            v-for="(val, index) in [{ 'label': '0点班', value: 0 }, { 'label': '4点班', value: 4 }, { 'label': '8点班', value: 8 }, { 'label': '休假', value: '' }]">
                            {{ val.label }}</li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            today: 5,
            edit: true,
            columnObject: {
                column: {
                    fixed: [{ label: "姓名", prop: "name", fixed: "left" },
                    { label: "值班合计", prop: "duty_times", fixed: "left" },
                    { label: "缺勤", prop: "unduty", fixed: "left" },
                    { label: "零点班", prop: "0work", fixed: "left" },
                    { label: "四点班", prop: "4work", fixed: "left" },
                    { label: "八点班", prop: "8work", fixed: "left" }],
                    day: [{ prop: '1', label: "1" }, { prop: '2', label: "2" }, { prop: '3', label: "3" }, { prop: '4', label: "4" }, { prop: '5', label: "5" }, { prop: '6', label: "6" }, { prop: '7', label: "7" }, { prop: '8', label: "8" }, { prop: '9', label: "9" }]
                },
            },
            popoverShow: false,
            activeName: '0',
            Item: {
                row: [],
                prop: ''
            },
            postionStyle: {
                left: '',
                top: '',

            },
            clickIndex: 0,
            data: [
                {
                    name: "小韩",
                    duty_times: 1,
                    unduty: 2,
                    '0work': 1,
                    '4work': 2,
                    '8work': 5,
                    "1": 0,
                    '2': 0,
                    '3': 0,
                    '4': 4,
                    '5': 0,
                    '6': 8,
                    '7': 0,
                    '1_attendance': 0,
                    '2_attendance': 0,
                    '3_attendance': 1,
                    '4_attendance': 0,
                    '5_attendance': 0,
                    '6_attendance': '',
                    '7_attendance': '',
                }, {
                    name: "小韩",
                    duty_times: 1,
                    unduty: 2,
                    '0work': 1,
                    '4work': 2,
                    '8work': 5,
                    "1": 0,
                    '2': 0,
                    '3': 0,
                    '4': 4,
                    '5': 0,
                    '6': 8,
                    '7': 0,
                    '1_attendance': 0,
                    '2_attendance': 0,
                    '3_attendance': 1,
                    '4_attendance': 0,
                    '5_attendance': 0,
                    '6_attendance': '',
                    '7_attendance': '',
                }],
            table_data: [],
            display: true
        }
    },
    mounted() {
        this.table_data = JSON.parse(JSON.stringify(this.data))
        this.hideDialog()
    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name
        },
        handleLiClick(rows, val, prop) {
            this.popoverShow = false;
            this.activeName = '0'
            rows.row[prop] = val.value
            const unduty_list = []
            for (let item in rows.row) {
                if (item.includes('attendance') && rows.row[item] === 0) {
                    unduty_list.push(rows.row[item])
                }
            }
            rows.row.unduty = unduty_list.length
            Object.assign(this.data[this.clickIndex], rows.row)
            this.table_data = JSON.parse(JSON.stringify(this.data))
            this.$emit('change', { data: this.table_data, rows: rows.row })
        },
        cellClick(rows, ev, prop, index) {
            // if (this.Item.prop && this.Item.prop === prop) {
            //     this.popoverShow = !this.popoverShow;
            // } else {
            //     this.popoverShow = true
            // }
            this.popoverShow = true
            const { clientX, clientY } = ev
            const { column, row, $index } = rows
            this.Item.row = row
            this.Item.prop = prop
            this.clickIndex = $index
            // const offsetLeft = $(ev.target.offsetParent).position().left
            // const offsetTop = $(ev.target.offsetParent).position().top
            // /*console.log('============',$(ev.target.offsetParent).position().top,$(ev.target.offsetParent).offset().top,ev,$(ev.target.offsetParent).parent())*/
            this.postionStyle.left = clientX + 'px'
            this.postionStyle.top = clientY + 'px'
        },
        hideDialog() {
            const rootDom = document.getElementById('app');
            rootDom.addEventListener('click', (e) => {
                console.log(e)
                const flag = this.checkoutDom(e.path, 'trackTableDialog')
                if (!flag) {
                    this.popoverShow = false
                }
            })
        },

        checkoutDom(path, className) {
            for (let i = 0; i < path.length; i++) {
                if (path[i].className && path[i].className.includes(className)) {
                    return true
                }
            }
            return false
        }
    }
}
</script>
<style scoped lang="less">
.comtable {
    position: relative;
    padding: 0;

    .dialog {
        position: absolute;
        left: 0;
        top: 0;
        background-color: #fff;
        padding: 10px;
        border-radius: 4px;
        z-index: 99999;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5000);
        // filter: drop-shadow(4px 4px 4px 4px rgba(0,0,0,1));
    }

    #triangle-up {
        margin-top: -15px;
        margin-left: 50px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #fff;
        // box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5000);
        filter: drop-shadow(4px 4px 4px 4px rgba(0, 0, 0, 1));
    }

    .trackTab {
        ul {
            padding: 0;
            margin: 0;

            li {
                height: 36px;
                line-height: 36px;
                padding-left: 10px;

                &:hover {
                    background-color: rgba(242, 243, 245, 1);
                }
            }

            .active-li {
                color: #0f1ef0
            }
        }
    }

    .list-table {
        position: relative;
    }

    ::v-deep tbody tr:hover>td {
        background-color: rgba(0, 0, 0, 0) !important;
    }

    ::v-deep tbody .hover-row>td {
        background-color: rgba(0, 0, 0, 0) !important;
    }

    ::v-deep tbody tr>td {
        padding: 0 !important;
    }

    ::v-deep tbody tr>td>.cell {
        padding: 2px 4px;
        height: 45px;
        line-height: 45px;
    }

    .date {
        height: 100%;
        border-radius: 4px;
    }

    ::v-deep .zero-color {
        background-color: var(--zeroColor) !important;
    }

    ::v-deep .eight-color {
        background-color: var(--eightColor) !important;
    }

    ::v-deep .four-color {
        background-color: var(--fourColor) !important;
    }

    .warn {
        color: rgba(250, 50, 50, 1),
    }

    ::v-deep thead {
        .todayStyle {
            .cell {
                width: 40px;
                border-radius: 50px !important;
                border: 1px solid #E2E3E9 !important;
                background-color: rgba(20, 91, 255, 1) !important;
                color: #fff !important;
            }
        }
    }
}
</style>