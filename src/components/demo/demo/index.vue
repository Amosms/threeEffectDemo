<template>
    <div v-for="(item, index) in mock" :key="index">
        <div class="employee-item">
            <div class="item-name">
                {{ item.name }}
            </div>
            <div class="item-content" v-for="(itemDay, dayIndex) in dayNums"
                @click="clickItem(index, dayIndex, $event)">
                {{ dayIndex }}
            </div>
        </div>
    </div>

    <div class="dialog" :style="dialogPos">
        这是弹窗
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
const mock = ref([
    {
        name: '张三',
        data: []
    },
    {
        name: '李四',
        data: []
    }
])
const dialogPos = ref({
    left: '12px', top: 0,
})
const dayNums = ref(10);

const clickItem = (index, dayIndex, event) => {
    console.log(event)
    const { clientX, clientY } = event;
    dialogPos.value.left = clientX + 'px'
    dialogPos.value.top = clientY + 'px'
    alert(`当前点击的是${mock.value[index].name}的 第${dayIndex}个格子`)
}
</script>
<style >
.employee-item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.item-content {
    padding: 5px 7px;
    cursor: pointer;
}

.dialog {
    position: absolute;
    border: 1px solid #000000;
    padding: 10px;
}
</style>