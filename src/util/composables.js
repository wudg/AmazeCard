import { ref, reactive } from 'vue';
import util from './util'; 

/**
 * 写入用户信息
 * @returns 
 */
export function useSetUser() {
    let user = reactive({
        token: null,
        ver: null, 
    });

    // 将token存入缓存
    user.token = util.analysisUrl('token');
    if (user.token) {
        localStorage.setItem('token', user.token);
    }
    // 版本号
    user.ver = util.analysisUrl('ver');
    if (user.ver && user.ver !== 'null') {
        localStorage.setItem('ver', user.ver);
    }

    user.token = localStorage.getItem('token');
    user.ver = localStorage.getItem('ver') ? Number(localStorage.getItem('ver')) : '';

    return user;
}

/**
 * 获取用户信息
 */
export function useGetUser() {
    let user = reactive({
        token: null,
        ver: null
    });

    user.token = localStorage.getItem('token');
    user.ver = localStorage.getItem('ver') ? Number(localStorage.getItem('ver')) : '';

    return user;
}

/**
 * 限制用户必须登录才能访问页面
 */
export async function useAuth() {
    // 定义全局登录回调函数，用于接收APP登录之后的参数
    if(!window.appLoginCallback) {
        window.appLoginCallback = function(app_token) {
            if(app_token) {
                let token = app_token;
                localStorage.setItem('token', token);
                let ver = util.analysisUrl('ver');
                if(ver) {
                    localStorage.setItem('ver', ver);
                }
    
                function locationReplace(url) {
                    if(history.replaceState) {
                        history.replaceState(null, document.title, url);
                        history.go(0);
                    } else {
                        location.replace(url);
                    }
                }
    
                let href = location.href.substring(0, location.href.indexOf('?') !== -1 ? location.href.indexOf('?') : location.href.length);
                locationReplace(`${href}?time=${new Date().getTime()}`);
            }
        };
    }

    return util.userAuth();
}