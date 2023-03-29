<template>
    <div id="webGL">
        <iframe id="iframe" src="http://127.0.0.1:5173/"></iframe>
    </div>
</template>
<script setup>
import { onMounted } from "vue";
onMounted(()=>{
    postMessage()
    onMessage()
})

const postMessage = ()=>{
    const dom = document.getElementById('iframe')
    dom.onload = function(){
        dom.contentWindow.postMessage({msg: '111'},'*');
    }
}

const onMessage = ()=>{
    window.addEventListener('message',e =>{
        if(e.data.key && e.data.key==='show3D'){
            console.log('父接收',e)
        }
    })
}


</script>
<style>
iframe{
    width: 100%;
    height: 100%;
}
</style>