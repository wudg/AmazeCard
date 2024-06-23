<template>
    <div class="layout-wrapper" ref="container"> 
        <div class="left">
            <div class="top" ref="topRef">
                <div class="content-box" ref="contentToCapture" :style="[{width: wS}, hS, config.margin]" :class="config.backgroundColor">
                    <div class="content quillEditor ql-container ql-snow" :style="[config.theme, config.radius, config.padding, config.fontSize]">
                        <div :style="config.color" :class="[config.fontFamily]" class="ql-editor">
                            <div v-html="config.content"></div>
                        </div>
                        <div v-if="qrCode" class="qrCode">
                            <qrcode-vue :value="qrCode" :size="52"></qrcode-vue>
                        </div>
                    </div>
                    <p class="watermark" v-show="config.watermarkType === 0">{{ config.watermark }}</p>
                    <img v-show="config.watermarkType === 1" :src="config.watermarkImageUrl" class="watermarkImage">
                </div>
            </div>
            
            <div class="mobile select flex">
                <van-button type="success" class="dow copy" @click="scrollToTarget">
                    <van-icon name="fire-o" />{{ $t("setUp") }}
                </van-button>
                <van-button class="dow copy" v-if="!isWeChat" @click="copyImg">
                    <van-icon name="certificate" />{{ $t("copy") }}
                </van-button>
                <van-button type="primary" v-if="!isWeChat" class="dow" @click="captureElement">
                    <van-icon name="down" />{{ $t("down") }}
                </van-button>
                <van-button type="primary" v-if="isWeChat" class="dow" @click="generateImg">
                    <van-icon name="photo-o" />{{ $t("generate") }}
                </van-button>
            </div>  

            <div class="bottom">
                <div class="input-title"> 
                    <!-- 标签 -->
                    <div class="icon flex">
                        <!-- <div class="smile" @click="clickShowEmjo()">
                            <van-icon name="smile-o" class=""/>
                        </div> -->
                        <div class="expression" v-show="emjoShow">
                            <span class="emjo" :title="item.name" v-for="(item, index) in emjoList" :key="index" @click="clickEmjo(item.lable)">{{ item.lable }}</span>
                        </div>
                    </div>
                    <!-- <div class="input-icon" @click="config.content = ''">
                        {{ $t("clean") }}
                    </div> -->
                </div>

                <div class="textarea-content"> 

                    <richText v-model="config.content" @input="richTextInput"/>

                    <!-- <textarea class="textarea__inner" ref="textarea" v-model="config.content" :placeholder="$t('contnet_text_title')"></textarea> -->
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
                    <input class="input__inner" v-model="config.http" @input="updateQRCode" placeholder="http://······" />
                </div>
                <div class="flex">
                    <div class="flex-item">
                        <div class="input-title">
                            <div class="input-title-left">
                                {{ $t("contnet_watermark_title") }}
                            </div>
                            <!-- 水印文本或图片 -->
                            <div class="theme-select">
                                <van-radio-group v-model="config.watermarkType">
                                    <van-radio :name="0">{{ $t("options_watermark_text") }}</van-radio>
                                    <van-radio :name="1">{{ $t("options_watermark_img") }}</van-radio>
                                </van-radio-group>
                            </div>
                            <div class="input-icon" @click="config.watermark = '', config.watermarkImageUrl = ''">
                                {{ $t("clean") }}
                            </div>
                        </div>
                        <div class="input-http" v-show="config.watermarkType === 0">
                            <input class="input__inner" v-model="config.watermark" placeholder="AmazeCard" />
                        </div>
                        <!-- 选择图片 -->
                        <div class="input-http" v-show="config.watermarkType === 1">
                            <van-button @click="selectImg">
                                <van-icon name="certificate" />{{ $t("selectImg") }}
                            </van-button>
                            <img :src="config.watermarkImageUrl" class="preview">
                        </div>

                    </div>

                </div>
                


            </div>
        </div>
        <div class="right" >
            <div class="options">
                <!-- 配色 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_bgc_title") }}</div>
                    <div class="select-color">
                        <div class="color-item" v-for="(item, index) in colorOptions" :key="item" :class="{'active': config.backgroundColor === item}" @click="selectColor(item)">
                            <div class="backgroundColor" :class="'backgroundColor-' + (index + 1)"></div>
                        </div>
                    </div>
                </div>
                <!-- 字体 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_font_title") }}</div>
                    <div class="font-select">
                        <div class="font-family" v-for="item in fontOption" :key="item.value" :class="{fontFamilyOn: config.fontFamily === item.value}" @click="selecttFontFamily(item.value)">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <!-- 尺寸 -->

                <div class="module">
                    <div class="options-title">{{ $t("options_size") }}</div>
                    <div class="font-select">
                        <div class="size_box" v-for="(item, index) in sizeList" :key="'size_'+index" @click="onClickSize(index)">
                            <div class="font-family" :class="{fontFamilyOn: sizeValue === index}">
                                {{ item.w }}:{{ item.h }}
                            </div>
                            {{ item.name }}
                        </div> 
                    </div>
                    
                    <div class="custom" @click="onClickSize(-1)">
                        <div class="input">
                            <input type="number" class="item-input" v-model="customW" @input="inputSize"/> 
                            <span>:</span>
                            <input type="number" class="item-input" v-model="customH" @input="inputSize"/>
                        </div>
                        {{ $t("options_custom") }}
                    </div>
                </div>

                <!-- 外观 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_theme_title") }}</div>
                    <div class="theme-select">
                        <van-radio-group v-model="theme" @change="integrationTheme">
                            <van-radio :name="0">{{ $t("options_opaque_light") }}</van-radio>
                            <van-radio :name="1">{{ $t("options_opaque_dark") }}</van-radio>
                        </van-radio-group>
                    </div>
                </div>

                <!-- 字体大小 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_font_size_title") }}</div>
                    <vue3-slider v-model="fontSize" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="50" :min="6"></vue3-slider>
                </div>

                <!-- 透明度 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_opaque_title") }}</div>
                    <vue3-slider v-model="opacity" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff"></vue3-slider>
                </div>

                <!-- 卡片边角 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_round_title") }}</div>
                    <vue3-slider v-model="radius" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff"></vue3-slider>
                </div>
                <!-- 背景尺寸 上下 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_bgSzUpDown_title") }}</div>
                    <vue3-slider v-model="marginUpDown" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200" :min="0"></vue3-slider>
                </div>
                <!-- 背景尺寸 左右 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_bgSzAbout_title") }}</div>
                    <vue3-slider v-model="marginAbout" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200" :min="0"></vue3-slider>
                </div>
                <!-- 卡片尺寸 上下 -->
                <div class="module">
                    <div class="options-title">{{ $t("options_cardSzUpDown_title") }}</div>
                    <vue3-slider v-model="paddingUpDown" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200" :min="0"></vue3-slider>
                </div>
                <div class="module">
                    <!-- 卡片尺寸 左右 -->
                    <div class="options-title">{{ $t("options_cardSzAbout_title") }}</div>
                    <vue3-slider v-model="paddingAbout" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200" :min="0"></vue3-slider>
                </div>
                
                <div class="button-group flex">
                    <van-button class="dow copy" @click="copyImg">
                        <van-icon name="certificate" />{{ $t("copy") }}
                    </van-button>
                    <van-button type="primary" class="dow" @click="captureElement">
                        <van-icon name="down" />{{ $t("down") }}
                    </van-button>
                </div>
            </div>
        </div>


        <van-action-sheet :show="mobileSetShow" title="设置" :closeable="false" @close="mobileSetShow = false">
            <div class="right mobile" >
                <div class="options">
                    <!-- 配色 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_bgc_title") }}</div>
                        <div class="select-color">
                            <div class="color-item" v-for="(item, index) in colorOptions" :key="item" :class="{'active': config.backgroundColor === item}" @click="selectColor(item)">
                                <div class="backgroundColor" :class="'backgroundColor-' + (index + 1)"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 字体 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_font_title") }}</div>
                        <div class="font-select">
                            <div class="font-family" v-for="item in fontOption" :key="item.value" :class="{fontFamilyOn: config.fontFamily === item.value}" @click="selecttFontFamily(item.value)">
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                    <!-- 尺寸 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_size") }}</div>
                        <div class="font-select">
                            <div class="size_box" v-for="(item, index) in sizeList" :key="'size_'+index" @click="onClickSize(index)">
                                <div class="font-family" :class="{fontFamilyOn: sizeValue === index}">
                                    {{ item.w }}:{{ item.h }}
                                </div>
                                {{ item.name }}
                            </div> 
                        </div>
                        
                        <div class="custom" @click="onClickSize(-1)">
                            <div class="input">
                                <input type="number" class="item-input" v-model="customW" @input="inputSize"/> 
                                <span>:</span>
                                <input type="number" class="item-input" v-model="customH" @input="inputSize"/>
                            </div>
                            {{ $t("options_custom") }}
                        </div>
                    </div>
                    <!-- 外观 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_theme_title") }}</div>
                        <div class="theme-select">
                            <van-radio-group v-model="theme" @change="integrationTheme">
                                <van-radio :name="0">{{ $t("options_opaque_light") }}</van-radio>
                                <van-radio :name="1">{{ $t("options_opaque_dark") }}</van-radio>
                            </van-radio-group>
                        </div>
                    </div>
                    <!-- 字体大小 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_font_size_title") }}</div>
                        <vue3-slider v-model="fontSize" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="50" :min="6"></vue3-slider>
                    </div>

                    <!-- 透明度 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_opaque_title") }}</div>
                        <vue3-slider v-model="opacity" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff"></vue3-slider>
                    </div>
                    <!-- 卡片边角 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_round_title") }}</div>
                        <vue3-slider v-model="radius" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff"></vue3-slider>
                    </div>
                    <!-- 背景尺寸 上下 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_bgSzUpDown_title") }}</div>
                        <vue3-slider v-model="marginUpDown" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200"></vue3-slider>
                    </div>
                    <!-- 背景尺寸 左右 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_bgSzAbout_title") }}</div>
                        <vue3-slider v-model="marginAbout" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200"></vue3-slider>
                    </div>
                    <!-- 卡片尺寸 上下 -->
                    <div class="module">
                        <div class="options-title">{{ $t("options_cardSzUpDown_title") }}</div>
                        <vue3-slider v-model="paddingUpDown" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200"></vue3-slider>
                    </div>
                    <div class="module">
                        <!-- 卡片尺寸 左右 -->
                        <div class="options-title">{{ $t("options_cardSzAbout_title") }}</div>
                        <vue3-slider v-model="paddingAbout" :tooltip="true" @change="integrationTheme" :handleScale="4" trackColor="#eeeeee" color="#6c56f6" tooltipColor="#6c56f6" tooltipTextColor="#ffffff" :max="200"></vue3-slider>
                    </div> 
                </div>
            </div>
        </van-action-sheet>
        <!-- 遮罩 -->
        <div class="mask" v-show="emjoShow" @click="emjoShow = false"></div>
        
        <van-dialog :show="imageShow" title="图片以生成，请长按保存" width="500px" @confirm="imageShow = false">
            <img :src="imgSrc" style="width: 100%; margin-top: 12px;"/>
        </van-dialog>

    </div>
</template>

<script setup> 
import { onBeforeMount, onMounted, ref, computed, watch } from 'vue';
import { get, post } from '../../api/http';
import interfaces from '../../api/interfaces';
import { useSetUser, useAuth } from '../../util/composables';
import { showToast, closeToast } from 'vant';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas'; 
import util from '../../util/util';
import { useI18n } from 'vue-i18n'; 
import vue3Slider from 'vue3-slider';
import QrcodeVue from 'qrcode.vue';
import emjo from '../../assets/expression.json'; 
import size from '../../assets/size.json'; 
import richText from '../../components/richText.vue';
 


// 获取 i18n 实例
const { t } = useI18n(); 
const qrCode = ref(null);
const topRef = ref(null);
const emjoList = ref(emjo);
const sizeList = ref(size);
const emjoShow = ref(false);
const mobileSetShow = ref(false);
const imageShow = ref(false);
const imgSrc = ref('');
const textarea = ref(); 
const isWeChat = ref(false); // 默认不是微信环境

const hS = ref(null);
const wS = ref(null);

let opacity = ref(50);
let radius = ref(12);
let theme = ref(1);
let fontSize = ref(12);

let marginAbout = ref(40);
let marginUpDown = ref(40);

let paddingAbout = ref(40);
let paddingUpDown = ref(40);

let sizeValue = ref(0);

let customW = ref(null);
let customH = ref(null);

const isMobile = ref(false);

const isWeixinBrowser = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('micromessenger');
};


// 动态计算div的宽高来按照一定的比例自适应
const computeWH = function(w, h, box_width, box_height) {
    const scale = w / h; // 比例
    if (scale <= box_width / box_height) { 
        if((box_height * scale) > box_width) {
            return;
        }
        wS.value = `${box_height * scale}px`; // 计算宽
        hS.value = `min-height: ${box_height}px`; // 计算高
    } else { 
        wS.value = `${box_width}px`;
        hS.value = `height: ${box_width / scale}px`;

    }
};

const onClickSize = function(index) {
    if (index === -1) { 
        if(sizeValue.value === -1) {
            return;
        }
        customW.value = sizeList.value[sizeValue.value].w;
        customH.value = sizeList.value[sizeValue.value].h; 
        sizeValue.value = index;
        computeWH(customW.value, customH.value, topRef.value.clientWidth, topRef.value.clientHeight );
        return;
    }
    customW.value = null;
    customH.value = null;
    sizeValue.value = index;

    if(!isMobile.value){
        paddingAbout.value = sizeList.value[sizeValue.value].pcPaddingAbout;
        paddingUpDown.value = sizeList.value[sizeValue.value].pcPaddingUpDown;
        fontSize.value = sizeList.value[sizeValue.value].pcFontSize;
        marginAbout.value = sizeList.value[sizeValue.value].pcMarginAbout;
        marginUpDown.value = sizeList.value[sizeValue.value].pcMarginUpDown;
    } else {
        paddingAbout.value = sizeList.value[sizeValue.value].mbPaddingAbout;
        paddingUpDown.value = sizeList.value[sizeValue.value].mbPaddingUpDown;
        fontSize.value = sizeList.value[sizeValue.value].mbFontSize;
        marginAbout.value = sizeList.value[sizeValue.value].mbMarginAbout;
        marginUpDown.value = sizeList.value[sizeValue.value].mbMarginUpDown;
    }
    
    integrationTheme();  
    computeWH(sizeList.value[sizeValue.value].w, sizeList.value[sizeValue.value].h, topRef.value.clientWidth, topRef.value.clientHeight );
};

const inputSize = function(e) { 
    let value = e.target.value;
    if(!value || value < 0) {
        return;
    }
    computeWH(customW.value, customH.value, topRef.value.clientWidth, topRef.value.clientHeight );
};
 
// 获取DOM元素引用
const contentToCapture = ref(null);
async function captureElement() {
    if (contentToCapture.value) {
        try {
            // 使用html2canvas将指定元素渲染到canvas上
            const canvas = await html2canvas(contentToCapture.value, {
                useCORS: true, // 如果有跨域资源，设置为true
                backgroundColor: '#fff', // 设置背景颜色，默认为白色
                scale: 10
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
};

// 微信环境生成图片
const generateImg = async () => {
    if (contentToCapture.value) {
        try {
            // 使用html2canvas将指定元素渲染到canvas上
            const canvas = await html2canvas(contentToCapture.value, {
                useCORS: true, // 如果有跨域资源，设置为true
                backgroundColor: '#fff', // 设置背景颜色，默认为白色
                scale: 10
                // 可以根据需要添加更多配置选项
            });
            // 将canvas转为图片URL
            const imgData = canvas.toDataURL('image/png');
            imgSrc.value = imgData;
            imageShow.value = true;
        } catch (error) {
            console.error('生成图片时出错:', error);
        }
    }
};

const scrollToTarget = () => {
    mobileSetShow.value = true;
};

// 复制图片
async function copyImg() {
    if (contentToCapture.value) {
        try {
            // 使用html2canvas将指定元素渲染到canvas上
            const canvas = await html2canvas(contentToCapture.value, {
                useCORS: true, // 如果有跨域资源，设置为true
                backgroundColor: '#fff', // 设置背景颜色，默认为白色
                scale: 10
                // 可以根据需要添加更多配置选项
            });
            // 将canvas转为图片URL
            const imgData = canvas.toDataURL('image/png');
            copyBase64Img(imgData);
        } catch (error) {
            console.error('生成图片时出错:', error);
        }
    }
};
/*复制Base64图片*/
const copyBase64Img = (base64Data) => {
    location.origin.includes('https://') || showToast('图片复制功能需要在https://协议下使用');
    //将base64转为Blob类型
    base64Data = base64Data.split(';base64,'); let type = base64Data[0].split('data:')[1]; base64Data = base64Data[1];
    let bytes = atob(base64Data), ab = new ArrayBuffer(bytes.length), ua = new Uint8Array(ab);
    [...Array(bytes.length)].forEach((v, i) => ua[i] = bytes.charCodeAt(i));
    let blob = new Blob([ab], { type });
    // “navigator.clipboard.write”该方法的确只能在本地localhost 、127.0.0.1 或者 https 协议下使用，否则navigator没有clipboard方法。
    navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    showToast('已复制到你的剪贴板');
};
    
let fontOption = ref([
    {
        name: '霞鹜新晰黑',
        value: 'xinxihei'
    },
    {
        name: '玄冬楷书',
        value: 'xuandongkaishu'
    },
    {
        name: 'Borel',
        value: 'borel'
    }
]);

let colorOptions = ref([
    'backgroundColor-1',
    'backgroundColor-2',
    'backgroundColor-3',
    'backgroundColor-4',
    'backgroundColor-5',
    'backgroundColor-6',
    'backgroundColor-7',
    'backgroundColor-8',
    'backgroundColor-9',
    'backgroundColor-10',
    'backgroundColor-11',
    'backgroundColor-12',

]);

const clickShowEmjo = () => {
    emjoShow.value = true;
};
// 点击图标
const clickEmjo = (item) => {
    emjoShow.value = false; 
    const endoPs = textarea.value.selectionEnd; // 获取光标结束位置 
    config.value.content = (config.value.content).slice(0, endoPs) + item + (config.value.content).slice(endoPs);
    // 重新设置光标位置
    textarea.value.selectionStart = endoPs + item.length;
    textarea.value.selectionEnd = endoPs + item.length;
    textarea.value.focus(); // 使 textarea 获得焦点
};

const selectImg = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', function() {
                const imageUrl = reader.result;
                config.value.watermarkImageUrl = imageUrl;
            });
            reader.readAsDataURL(file);
        }
    });
    fileInput.click();
};

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
    fontSize: '', // 内容
    http: '', // 内容
    watermarkType: 0, // 水印类型
    watermarkImageUrl: '', // 水印图片
    fontFamily: 'xinxihei',
    watermark: 'AmazeCard',
});


const updateQRCode = () => {
    qrCode.value = config.value.http;
};
 
// 设置背景色
const selectColor = (item) => {
    config.value.backgroundColor = item;
};

// 选择字体
const selecttFontFamily = (item) => {
    config.value.fontFamily = item;
};

const integrationTheme = () => {
    let rgb = theme.value === 0? '255, 255, 255': '0, 0, 0';
    let color = theme.value === 0? '51, 51, 51': '255, 255, 255';
    config.value.theme = `background: rgba(${rgb}, ${opacity.value / 100})`;
    config.value.color = `color: rgb(${color})`;
    config.value.radius = `border-radius: ${radius.value}px`; 
    config.value.margin = `padding: ${marginUpDown.value}px ${marginAbout.value}px`;
    config.value.padding = `padding: ${paddingUpDown.value}px ${paddingAbout.value}px`;
    config.value.fontSize = `font-size: ${fontSize.value}px`;
};
// 检查屏幕尺寸
const checkMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 767px)').matches;
};

onBeforeMount(async () => {
  

    config.value.content = t('default_Text');

}); 

onMounted(async () => {
    checkMobile();
    isWeChat.value = isWeixinBrowser(); // 判断是否在微信环境中

    if(!isMobile.value){
        paddingAbout.value = sizeList.value[sizeValue.value].pcPaddingAbout;
        paddingUpDown.value = sizeList.value[sizeValue.value].pcPaddingUpDown;
        fontSize.value = sizeList.value[sizeValue.value].pcFontSize;
        marginAbout.value = sizeList.value[sizeValue.value].pcMarginAbout;
        marginUpDown.value = sizeList.value[sizeValue.value].pcMarginUpDown;
    } else {
        paddingAbout.value = sizeList.value[sizeValue.value].mbPaddingAbout;
        paddingUpDown.value = sizeList.value[sizeValue.value].mbPaddingUpDown;
        fontSize.value = sizeList.value[sizeValue.value].mbFontSize;
        marginAbout.value = sizeList.value[sizeValue.value].mbMarginAbout;
        marginUpDown.value = sizeList.value[sizeValue.value].mbMarginUpDown;
    }

    integrationTheme();  
    computeWH(sizeList.value[sizeValue.value].w, sizeList.value[sizeValue.value].h, topRef.value.clientWidth, topRef.value.clientHeight );
 
});
const richTextInput = () => {
    if (topRef.value) {
        console.log(topRef.value.clientWidth);
        // 根据元素的尺寸变化更新状态或执行其他逻辑 
        setTimeout(() => {
            if(sizeValue.value < 0){
                computeWH(customW.value, customH.value, topRef.value.clientWidth, topRef.value.clientHeight );
                return;
            }
            computeWH(sizeList.value[sizeValue.value].w, sizeList.value[sizeValue.value].h, topRef.value.clientWidth, topRef.value.clientHeight );
        }, 300);
    }
};

 
</script>

<style lang="less">
@import './index.less';
@import './mobile.less'; 
</style>
