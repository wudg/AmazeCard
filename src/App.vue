<template>
    <router-view class="router-view" v-slot="{ Component }"> 
        <!-- 公共头部 -->
        <div class="head"> 
            <div class="logo">
                {{ $t("logo") }}
            </div>
            <div class="right">
                <div class="custom-select">
                    <!-- 下拉选择框标题 -->
                    <div @mouseenter="toggleDropdown" @mouseleave="toggleDropdown2" class="select-lable" :class="{ 'active': isOpen }">
                        {{ selectedOption ? selectedOption.label: '简体中文' }}
                        <!-- 下拉选项列表 -->
                        <ul v-show="isOpen" class="options-list">
                            <li v-for="(option, index) in options" :key="index" @click="selectOption(option)" :class="{ 'selected': option.value === selectedOption }">
                                {{ option.label }}
                            </li>
                        </ul>
                    </div>
                </div>
                <van-switch v-model="checked" size="22px" @change="changeTheme">
                    <template #node>
                        <div class="icon-wrapper">
                            <van-icon :name="checked ? 'closed-eye' : 'eye'" />
                        </div>
                    </template>
                </van-switch> 
            </div>
        </div>
        <component :is="Component" /> 
    </router-view>
</template>

<script setup> 
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { locale } = useI18n();
let isOpen = ref(false);

let checked = ref(localStorage.getItem('theme') === 'dark' ? true : false);

let selectedOption = ref(JSON.parse(localStorage.getItem('laObj')));
let options = ref([
    {
        label: '简体中文',
        value: 'zh'
    },
    {
        label: 'English',
        value: 'en'
    }
]);

// 切换语言
const changeLocale = (lang) => {
    localStorage.setItem('ln', lang);
    locale.value = lang;
};

// 切换主题
const changeTheme = (theme) => {
    let str = '';
    if(theme) {
        str = 'dark';
    }
    localStorage.setItem('theme', str);
    let html = document.querySelector('html'); 
    html.setAttribute('data-theme', str);
};

const toggleDropdown = () => {
    isOpen.value = true; 
};
const toggleDropdown2 = () => {
    isOpen.value = false; 
};

const selectOption = (option) => {
    selectedOption.value = option;
    localStorage.setItem('laObj', JSON.stringify(option));
    changeLocale(option.value);
    toggleDropdown();
};

</script>

<style scoped lang="less">
.head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    height: 52px;
    .logo {
        color: var(--text);
        font-size: 24px;
        padding: 12px 0;
    }

    .right {
        align-items: center;
        display: flex;
    }

    .custom-select {
        position: relative;
    }
    .select-lable {
        color: var(--text);
        font-size: 14px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 12px;
        cursor: pointer;
    }
    .options-list {
        position: absolute;
        top: 100%;
        left: 50%;
        background-color: #fff;
        border: 1px solid #ccc;
        width: 90px;
        list-style-type: none;
        padding: 6px 0;
        margin-left: -45px; 
        z-index: 2;
        background-color: var(--background);
        border-radius: 6px;
        box-shadow: 0px 0px 2px 0px #e9e9e9;
        &.active {
            display: block;
        }

        li {
            cursor: pointer;
            text-align: center;
            line-height: 36px;
            &.selected {
                background-color: #f0f0f0;
            }
        }
    }
    li:hover {
        color: var(--theme-color);
    }
    .icon-wrapper {
        margin-top: -2px;
        margin-left: 2px;
        .van-icon{
            color: var(--theme-color);
            font-size: 16px;
        }
    }
}


@media (max-width: 1000px) {
    .head {
        padding: 0 12px;
    }
}
</style>
