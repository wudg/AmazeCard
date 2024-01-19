<template>
    <div class="layout-wrapper">  
        <div class="left">
            <div class="top">
                <div class="content-box" :class="config.backgroundColor">
                    <div class="content">
                        <p>🎨 MemoCard 可以帮你生成精美的卡片，可应用于你日常书摘、笔记、备忘等内容的分享。💡 你可以在这里输入文字尝试一下，实时生效。</p>
                    </div>
                </div>
            </div>
            <div class="bottom">
                
            </div>
        </div>
        <div class="right">
            <div class="options">
                <div class="options-title">{{ $t("options_bgc_title") }}</div>
                <div class="select-color">
                    <div class="color-item" v-for="(item, index) in colorOptions" :key="item" :class="{'active': config.backgroundColor === item}" @click="selectColor(item)">
                        <div class="backgroundColor" :class="'backgroundColor-' + (index + 1)"></div>
                    </div>
                </div>
                
                <div class="options-title">{{ $t("options_font_title") }}</div>
                
            </div>
        </div>
    </div>
</template>

<script setup> 
import { onBeforeMount, ref } from 'vue';
import { get, post } from '../../api/http';
import interfaces from '../../api/interfaces';
import { useSetUser, useAuth } from '../../util/composables';
import { showSuccessToast, showFailToast, showLoadingToast, showConfirmDialog, closeToast } from 'vant';
import { useRouter } from 'vue-router';
import util from '../../util/util';

let colorOptions = ref([
    'backgroundColor-1',
    'backgroundColor-2',
    'backgroundColor-3',
    'backgroundColor-4',
    'backgroundColor-5',
    'backgroundColor-6',
    'backgroundColor-7',
    'backgroundColor-8',
]);

// 配置参数
let config = ref({
    backgroundColor: 'backgroundColor-1'
});

// 设置背景色
const selectColor = (item) => {
    config.value.backgroundColor = item;
};

onBeforeMount(async () => { 
}); 

</script>

<style scoped lang="less">
.layout-wrapper {
    display: flex;
    width: 100%;  
    max-width: 1200px;
    margin: 0 auto;

    .left {
        flex: 2; 
        margin-right: 24px;
    }
    .right {
        flex: 1; 
    }

    .top {
        position: relative;
        background: var(--current-block-background-color);
        padding: 20px;
        // min-height: 300px;
        border-radius: 16px;
        box-shadow: 2px 2px 50px -20px #00000080;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottom {
        padding: 10px 20px 30px;
        box-shadow: 2px 2px 50px -20px #00000080;
        background: var(--current-block-background-color);
        border-radius: 16px;
        margin-top: 20px;
        overflow: hidden;
    }

    .options {
        position: relative;
        padding: 20px 20px;
        box-shadow: 2px 2px 50px -20px #00000080;
        background: var(--current-block-background-color);
        border-radius: 16px;
        overflow: hidden;
        z-index: 0;
    }

    .content-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .content {
        font-size: 14px; 
        line-height: 26px;
        letter-spacing: .4px;
        white-space: pre-wrap;
        word-break: break-word;
        border: 1px solid hsla(0,0%,100%,.1);
    }
    .options-title { 
        margin-bottom: 5px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        font-weight: 700;
        color: var(--text);
    }

    .select-color {
        display: grid;
        grid-template-columns: repeat(4,1fr);
        grid-gap: 4px;
        margin-top: 4px; 
    }

    .color-item {
        width: 48px;
        border: 2px solid var(--current-block-background-color);
        padding: 2px;
        transition: all .1s;
        border-radius: 8px;
        margin-bottom: 12px;
    }
    
    .color-item.active {
        border: 2px solid var(--theme-color);
    }
    .backgroundColor {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        box-shadow: inset 0 0 #fff, inset 0 0 0 2px #0000000d, 0 4px 6px -1px #0000001a, 0 2px 4px -1px #0000000f, 0 0 #0000;
        cursor: pointer;
    }
}
</style>
