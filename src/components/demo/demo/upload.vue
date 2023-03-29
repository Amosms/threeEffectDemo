<template>
    <a-upload action="http://192.168.0.7:8081/api/v1/3dresource/upload3DFile" :data="test" directory>
        <a-button>
            <upload-outlined></upload-outlined>
            Upload Directory
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

const test = (file) => {
    const params = {
        aabbcc: file.webkitRelativePath.replaceAll('/', '_')
    }
    console.log(params)
    return params
}
</script>