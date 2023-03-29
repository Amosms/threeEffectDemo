<template>
    <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick">
        <template #default="{ node, data }">
            <span class="custom-tree-node">
                <el-input v-if="node.id == name" v-model="newName" :autofocus="true" />
                <span v-else>{{ node.label }}#</span>
            </span>
        </template>
    </el-tree>
</template>
<script setup>
import {
    ref,
    toRefs,
    reactive,
    onMounted,
    onBeforeUnmount,
    computed,
    watch
} from 'vue';
const handleNodeClick = (node, attr, obj) => {
    name.value = attr.id
    newName.value = attr.label
    console.log(node, attr, obj)
}

const name = ref(null)
let newName = ref(null)
const data = [
    {
        label: 'Level one 1',
        children: [
            {
                label: 'Level two 1-1',
                children: [
                    {
                        label: 'Level three 1-1-1',
                    },
                ],
            },
        ],
    },
    {
        label: 'Level one 2',
        children: [
            {
                label: 'Level two 2-1',
                children: [
                    {
                        label: 'Level three 2-1-1',
                    },
                ],
            },
            {
                label: 'Level two 2-2',
                children: [
                    {
                        label: 'Level three 2-2-1',
                    },
                ],
            },
        ],
    },
    {
        label: 'Level one 3',
        children: [
            {
                label: 'Level two 3-1',
                children: [
                    {
                        label: 'Level three 3-1-1',
                    },
                ],
            },
            {
                label: 'Level two 3-2',
                children: [
                    {
                        label: 'Level three 3-2-1',
                    },
                ],
            },
        ],
    },
]

const defaultProps = {
    children: 'children',
    label: 'label'
}
</script>