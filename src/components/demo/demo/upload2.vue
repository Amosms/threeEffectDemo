<template>
    <a-upload :action="actionTest" directory>
        <a-button>
            <upload-outlined></upload-outlined>
            Upload Directory2
        </a-button>
    </a-upload>
</template>
<script setup>
import {
    ref,
    toRefs,
    reactive,
    onMounted,
    onBeforeUnmount,
    createVNode,
    computed,
    watch
} from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue';

const actionTest = (file) => {
    return `http://192.168.0.7:8081/api/v1/3dresource/upload3DFile?filePath=${file.webkitRelativePath}&fileType=1`
}
</script>