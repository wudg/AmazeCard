<template>
    <div style="background: #fff;">
        <QuillEditor
            ref="quillEditor"
            :options="editorOption"
            :content="modelValue"
            :style="{ height: height }"
            class="quillEditor"
            contentType="html"
            @update:content="textChange"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { QuillEditor, Quill } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ImageDrop } from 'quill-image-drop-module';

import 'quill-image-resize-module/image-resize.min.js';
Quill.register('modules/ImageDrop', ImageDrop);

// 工具栏配置项
const toolbarOptions = [
    // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ['bold', 'italic', 'underline', 'strike'],
    // 引用    代码块-----['blockquote', 'code-block']
    ['blockquote', 'code-block'],
    // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ header: 1 }, { header: 2 }],
    // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ list: 'ordered' }, { list: 'bullet' }],
    // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{ script: 'sub' }, { script: 'super' }],
    // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ indent: '-1' }, { indent: '+1' }],
    // 文本方向-----[{'direction': 'rtl'}]
    [{ direction: 'rtl' }],
    // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ size: ['small', false, 'large', 'huge'] }],
    // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ color: [] }, { background: [] }],
    // 字体种类-----[{ font: [] }]
    [{ font: [] }],
    // 对齐方式-----[{ align: [] }]
    [{ align: [] }],
    // 清除文本格式-----['clean']
    ['clean'],
    // 链接、图片、视频-----['link', 'image', 'video']
    ['link', 'image', 'video', 'table'],
    ['table'] // 表格
];

export default defineComponent({
    name: 'QuillRichtext',
    components: {
        QuillEditor,
    },
    props: {
        height: {
            type: String,
            default: '350px',
        },
        modelValue: {
            type: String,
            default: '',
        },
    },
    watch: {},
    data() {
        return {
            myContent: '',
            editorOption: {
                modules: {
                    toolbar: toolbarOptions,
                    history: {
                        delay: 1000,
                        maxStack: 50,
                        userOnly: false,
                    },
                    ImageDrop: true,
                    imageResize: {
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white',
                        },
                        modules: ['Resize', 'DisplaySize', 'Toolbar'],
                    },
                    // table: false,    // disable table module
                    // 'better-table': {
                    //     operationMenu: {
                    //         items: {
                    //             insertColumnRight: { text: '右边插入一列' },
                    //             insertColumnLeft: { text: '左边插入一列' },
                    //             insertRowUp: { text: '上边插入一行' },
                    //             insertRowDown: { text: '下边插入一行' },
                    //             mergeCells: { text: '合并单元格' },
                    //             unmergeCells: { text: '拆分单元格' },
                    //             deleteColumn: { text: '删除列' },
                    //             deleteRow: { text: '删除行' },
                    //             deleteTable: { text: '删除表格' },
                    //         },
                    //         background: {
                    //             color: '#333'
                    //         },
                    //         color: {
                    //             colors: ['green', 'red', 'yellow', 'blue', 'white'],
                    //             text: 'background:'
                    //         }
                    //     }
                    // },
                    // keyboard: {
                    //     bindings: QuillBetterTable.keyboardBindings
                    // }
                },
                theme: 'snow',
                placeholder: '请输入正文',
                // Some Quill optiosn...
            },
        };
    },
    methods: {
        textChange(val) {
            // console.log(val)
            this.$emit('update:modelValue', val);
        },
    },
});
</script>

<style lang='less'></style>
