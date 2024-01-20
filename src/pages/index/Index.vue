<template>
    <div class="layout-wrapper">  
        <div class="left">
            <div class="top">
                <div class="content-box" ref="contentToCapture" :class="config.backgroundColor">
                    <div class="content" :style="[config.theme, config.radius, config.margin, config.padding]">
                        <p :style="config.color">
                            {{ config.content }}
                        </p>
                        <div ref="qrcodeContainer"></div>
                    </div>
                    <p class="watermark">AmazeCard</p>
                </div>
            </div>
            <div class="bottom">
                <div class="input-title">
                    <div class="input-title-left">
                        {{ $t("contnet_text_title") }}
                    </div>
                    <div class="input-icon" @click="config.content = ''">
                        {{ $t("clean") }}
                    </div>
                </div>

                <div class="textarea-content">
                    <textarea class="textarea__inner" v-model="config.content" :placeholder="$t('contnet_placeholder')"></textarea>
                </div>

                <div class="input-title">
                    <div class="input-title-left">
                        {{ $t("contnet_url_title") }}
                    </div>
                    <div class="input-icon" @click="config.http = ''">
                        {{ $t("clean") }}
                    </div>
                </div>
                <div class="input-http">
                    <input class="input__inner" v-model="config.http" @input="updateQRCode" placeholder="http://······"/>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="options">
                <!-- 配色 -->
                <div class="options-title">{{ $t("options_bgc_title") }}</div>
                <div class="select-color">
                    <div class="color-item" v-for="(item, index) in colorOptions" :key="item" :class="{'active': config.backgroundColor === item}" @click="selectColor(item)">
                        <div class="backgroundColor" :class="'backgroundColor-' + (index + 1)"></div>
                    </div>
                </div>
                <!-- 字体 -->
                <div class="options-title">{{ $t("options_font_title") }}</div>
                <!-- 外观 -->
                <div class="options-title">{{ $t("options_theme_title") }}</div>
                <div class="theme-select">
                    <van-radio-group v-model="theme" @change="integrationTheme">
                        <van-radio :name="0">{{ $t("options_opaque_dark") }}</van-radio>
                        <van-radio :name="1">{{ $t("options_opaque_light") }}</van-radio>
                    </van-radio-group>
                </div>
                <!-- 透明度 -->
                <div class="options-title">{{ $t("options_opaque_title") }}</div>
                <van-slider v-model="opacity" :max="101" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ opacity }}</div>
                    </template>
                </van-slider>
                <!-- 卡片边角 -->
                <div class="options-title">{{ $t("options_round_title") }}</div>
                <van-slider v-model="radius" :max="51" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ radius }}</div>
                    </template>
                </van-slider>
                <!-- 背景尺寸 上下 -->
                <div class="options-title">{{ $t("options_bgSzUpDown_title") }}</div>
                <van-slider v-model="marginUpDown" :max="201" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ marginUpDown }}</div>
                    </template>
                </van-slider>
                <!-- 背景尺寸 左右 -->
                <div class="options-title">{{ $t("options_bgSzAbout_title") }}</div>
                <van-slider v-model="marginAbout" :max="201" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ marginAbout }}</div>
                    </template>
                </van-slider>
                <!-- 卡片尺寸 上下 -->
                <div class="options-title">{{ $t("options_cardSzUpDown_title") }}</div>
                <van-slider v-model="paddingUpDown" :max="201" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ paddingUpDown }}</div>
                    </template>
                </van-slider>
                <!-- 卡片尺寸 左右 -->
                <div class="options-title">{{ $t("options_cardSzAbout_title") }}</div>
                <van-slider v-model="paddingAbout" :max="201" @change="integrationTheme">
                    <template #button>
                        <div class="custom-button">{{ paddingAbout }}</div>
                    </template>
                </van-slider>
                <button @click="captureElement">生成图片</button>

            </div>
        </div>
    </div>
</template>

<script setup> 
import { onBeforeMount, onMounted, ref } from 'vue';
import { get, post } from '../../api/http';
import interfaces from '../../api/interfaces';
import { useSetUser, useAuth } from '../../util/composables';
import { showSuccessToast, showFailToast, showLoadingToast, showConfirmDialog, closeToast } from 'vant';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import VueQrcode from 'vue-qrcode';
import util from '../../util/util';
import { useI18n } from 'vue-i18n';

// 获取 i18n 实例
const { t } = useI18n();
// 数据部分
const qrCodeValue = ref('http://192.168.31.208:5177'); // 这是二维码的内容，可以动态绑定
const qrCodeSize = ref(256); // 二维码的尺寸，单位是像素


// 使用VueQrcode组件生成二维码
const QrCodeComponent = VueQrcode.component;

// 在DOM元素上渲染二维码
const qrcodeContainer = ref(null);

// 如果需要动态更新二维码内容
function updateQRCode() {
    qrCodeValue.value = config.value.http;
    console.log(qrCodeValue.value);
    // 部分库可能支持直接更新，否则可能需要重新创建实例
    // 若需重新创建，请确保先销毁旧实例（如果适用）
};

onMounted(() => {
    if (qrcodeContainer.value) {
        const QRCodeInstance = new QrCodeComponent({
            container: qrcodeContainer.value,
            value: qrCodeValue.value,
            size: qrCodeSize.value,
        });
        QRCodeInstance.make();
    }
});

let opacity = ref(50);
let radius = ref(12);
let theme = ref(1);

let marginAbout = ref(40);
let marginUpDown = ref(40);

let paddingAbout = ref(40);
let paddingUpDown = ref(40);

// 获取DOM元素引用
const contentToCapture = ref(null);
async function captureElement() {
    if (contentToCapture.value) {
        try {
            // 使用html2canvas将指定元素渲染到canvas上
            const canvas = await html2canvas(contentToCapture.value, {
                useCORS: true, // 如果有跨域资源，设置为true
                backgroundColor: '#fff', // 设置背景颜色，默认为白色
                // 可以根据需要添加更多配置选项
            });
            // 将canvas转为图片URL
            const imgData = canvas.toDataURL('image/png');
            // 创建一个a标签模拟点击下载图片
            const link = document.createElement('a');
            link.download = 'AmazeCard.png';
            link.href = imgData;
            document.body.appendChild(link); // 需要先插入文档流才能触发点击事件
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('生成图片时出错:', error);
        }
    }
}
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
    backgroundColor: 'backgroundColor-1',
    theme: '', // 1.浅色 2.深色
    color: '', // 字体颜色
    opacity: 10, // 透明度
    radius: '', // 圆角
    margin: '', // 背景上下尺寸
    padding: '', // 背景上下尺寸
    content: '', // 内容
    http: '', // 内容
});

// 设置背景色
const selectColor = (item) => {
    config.value.backgroundColor = item;
};

const integrationTheme = () => {
    let rgb = theme.value === 0? '255, 255, 255': '0, 0, 0';
    let color = theme.value === 0? '51, 51, 51': '255, 255, 255';
    config.value.theme = `background: rgba(${rgb}, ${opacity.value / 100})`;
    config.value.color = `color: rgb(${color})`;
    config.value.radius = `border-radius: ${radius.value}px`; 
    config.value.margin = `margin: ${marginUpDown.value}px ${marginAbout.value}px`;
    config.value.padding = `padding: ${paddingUpDown.value}px ${paddingAbout.value}px`;
    config.value.content = t('default_Text');
};


onBeforeMount(async () => {

    integrationTheme();
}); 

</script>

<style lang="less">
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
        min-height: 300px;
        border-radius: 16px;
        box-shadow: 2px 2px 50px -20px #00000080;
        
        transition: all .1s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottom {
        padding: 10px 20px 30px;
        box-shadow: 2px 2px 50px -20px #00000080;
        background: var(--current-block-background-color);
        transition: all .1s;
        border-radius: 16px;
        margin-top: 20px;
        overflow: hidden;
    }

    .options {
        position: relative;
        padding: 20px 20px;
        box-shadow: 2px 2px 50px -20px #00000080;
        background: var(--current-block-background-color);
        transition: all .1s;
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
        grid-template-columns: repeat(6,1fr);
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
    .van-radio-group {
        display: flex;
        margin-bottom: 12px;
    }
    .van-radio {
        margin-right: 24px;
        .van-radio__label {
            color: var(--text) !important;
        }
    }

    .custom-button {
        width: 26px;
        color: #fff;
        font-size: 10px;
        line-height: 18px;
        text-align: center;
        background-color: var(--theme-color);
        border-radius: 100px;
    }

    .watermark {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
        color: #fff;
        transform: scale(.8);
    }
    .input-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .input-title-left {
        flex: 1; 
        font-size: 14px;
        color: var(--text);
        font-weight: 700;
    }
    .input-icon {
        cursor: pointer;
        font-size: 14px;
        color: var(--text);
        font-weight: 700;
    }
    .input-icon:hover{
        color: var(--theme-color);
    }
    .textarea-content {
        position: relative;
        display: inline-block;
        width: 100%;
        vertical-align: bottom;
        margin: 16px 0;
        font-size: 14px;
    }
    .textarea__inner {
        padding: 8px 12px;
        border-radius: 6px;
        resize: none; 
        min-height: 100px; 
        height: 100px;
        transition: all 0.1s;
        border: none;
        background: transparent;
        display: block;
        box-shadow: 0 0 0 1px var(--border-color-input) inset;
        width: 100%;
        color: var(--text);
    }
    .input-http {
        position: relative;
        display: inline-block;
        width: 100%;
        vertical-align: bottom;
        margin-top: 16px;
        font-size: 14px;
    }
    .input__inner {
        padding: 8px 12px;
        border-radius: 6px;
        resize: none; 
        min-height: 30px; 
        height: 30px;
        transition: all 0.1s;
        background: transparent;
        border: none;
        display: block;
        box-shadow: 0 0 0 1px var(--border-color-input) inset;
        width: 100%;
        color: var(--text);
    }

    .textarea__inner:hover, .input__inner:hover {
        box-shadow: 0 0 0 1px var(--border-color) inset;
    }
    /* Chrome、Safari等WebKit内核浏览器 */
    :-webkit-input-placeholder {
        color: var(--color-placeholder); /* 设置为红色 */
    }
    
    /* Firefox浏览器 */
    ::-moz-placeholder {
        color: var(--color-placeholder); /* 设置为蓝色 */
    }
    
    /* IE10及其之后版本 */
    :-ms-input-placeholder {
        color: var(--color-placeholder); /* 设置为绿色 */
    }
    
    /* 标准语法 */
    ::placeholder {
        color: var(--color-placeholder); /* 设置为紫色 */
    }
}
</style>
