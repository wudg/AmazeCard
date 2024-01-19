<template>
    <van-row class="layout-header">
        <van-col span="5" class="layout-header__back" @click.prevent.stop="onClickBack">
            <img class="layout-header__back-img" src="../assets/back@2x.png" v-if="props.back !== 'none'" />
        </van-col>
        <van-col span="14" class="layout-header__title">{{ title }}</van-col>
        <van-col span="5" class="layout-header__handle">
            <slot name="handle"></slot>
        </van-col>
    </van-row>
</template>

<script setup> 
import util from '@util/util';
import { ref } from 'vue';
import router from '../router';

const props = defineProps(['back', 'title']);

const onClickBack = () => {
    if(props.back === 'none') {
        return;
    }

    // 如果没有指定需要返回的页面则默认返回上一页
    if (!props.back) {
        router.go(-1);
        return;
    }
    
    // 如果back是函数则执行函数
    if (Object.prototype.toString.call(props.back) === '[object Function]') {
        props.back();
        return;
    }

    // 跳转至指定页面
    util.redirect(back);
};
</script>