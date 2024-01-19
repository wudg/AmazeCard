module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': ['plugin:vue/strongly-recommended'],
    'parserOptions': {
        'ecmaVersion': 13,
        'sourceType': 'module',
        'ecmaFeatures': {
            'modules': true,
            'jsx': true
        },
        'requireConfigFile': false,
        'parser': '@babel/eslint-parser'
    },
    // eslint-plugin-vue 
    'plugins': [
        'vue'      // 引入vue的插件 vue <==> eslint-plugin-vue 
    ],
    'globals': {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
    },
    'rules': {
        // allow paren-less arrow functions 要求箭头函数的参数使用圆括号
        'arrow-parens': 0,
        // allow async-await 强制 generator 函数中 * 号周围使用一致的空格
        'generator-star-spacing': 0,
        'indent': [
            'error',
            4
        ],
        'linebreak-style': 'off',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-debugger': 'off',
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/html-self-closing': 'off',
        'vue/require-prop-types': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/no-template-shadow ': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 0
    }
};