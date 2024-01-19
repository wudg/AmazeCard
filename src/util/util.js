/**通用工具集 */
import { get } from '@api/http';
import interfaces from '@api/interfaces';

export default {
    /**
     * 页面跳转
     * @param url 地址
     * @param query 参数
     * @param type 跳转方式，默认href，replace以替换的形式跳转
     */
    redirect({
        url,
        query,
        type = 'href'
    }) {
        // 数组式的参数
        let query_ary = [];
        for (let param in query) {
            query_ary.push(`${param}=${query[param]}`);
        }

        /**拼接参数并执行跳转 */
        function go(queryAry) {
            let query_str = queryAry.join('&');

            let addr = url;
            // 如果有参数则带上参数跳转
            if (url.indexOf('?') !== -1) {
                addr = `${url}&${query_str}`;
            } else {
                addr = `${url}?${query_str}`;
            }

            if (type === 'replace') {
                location.replace(addr);
            } else {
                location.href = addr;
            }
        }

        query_ary.push(`_t=${new Date().getTime()}`);
        go(query_ary);
    },

    /**
     * 根据参数名称获取url中的参数值
     * @param name 参数名
     */
    analysisUrl(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    },
    /**限制用户必须登录才能访问 */
    userAuth() {
        let token = localStorage.getItem('token');
 
        if (!token) {
            return false;
        } else {
            // 如果用户Id和token都有则请求一个获取用户信息的接口，以此来判断用户的token是否是有效的
            return get({
                url: interfaces.check,
            }).then(res => {
                if(res.code === 401) {
                    return false;
                }
                return true;
            });
        }
    },
    /**
     * 保存用户访问数据，包括token
     */
    saveUser(token) {
        localStorage.setItem('token', token);
    },
    /**
     * 浮点型数据相加
     * @param num1 {number} 第一个数字
     * @param num2 {number} 第二个数字
     * @return {number} 相加的结果
     */
    accAdd(num1, num2) {
        /* eslint-disable */
        let r1, r2, m;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));

        return Math.round(num1 * m + num2 * m) / m;
        /* eslint-enable */
    },
    /**
     * 浮点型数据相减
     * @param num1 {number} 第一个数字
     * @param num2 {number} 第二个数字
     * @returns {number} 相减的结果
     */
    accSub(num1, num2) {
        /* eslint-disable */
        let r1, r2, m, n;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
        /* eslint-enable */
    },
    /**
     * 浮点型数据相乘
     * @param num1 {number} 第一个数字
     * @param num2 {number} 第二个数字
     * @returns {number} 相乘的结果
     */
    accMul(num1, num2) {
        /* eslint-disable */
        num1 = num1 || 0;
        num2 = num2 || 0;
        let m = 0,
            s1 = num1.toString(),
            s2 = num2.toString();

        try {
            m += s1.split('.')[1].length
        } catch (e) {

        }
        try {
            m += s2.split('.')[1].length
        } catch (e) {

        }
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        /* eslint-enable */
    },
    /**
     * 浮点型数据相除
     * @param num1 第一个数字
     * @param num2 第二个数字
     * @returns {number} 想除的结果
     */
    accDiv(num1, num2) {
        /* eslint-disable */
        let t1 = 0,
            t2 = 0,
            r1,
            r2;
        try {
            t1 = num1.toString().split('.')[1].length
        } catch (e) { }
        try {
            t2 = num2.toString().split('.')[1].length
        } catch (e) { }

        r1 = Number(num1.toString().replace('.', ''));
        r2 = Number(num2.toString().replace('.', ''));
        return (r1 / r2) * Math.pow(10, t2 - t1);
        /* eslint-enable */
    },
    /**
     * 保留小数点后两位，向下取
     * @param num
     */
    floor(num) {
        if (isNaN(num)) {
            return num;
        }
        return Math.floor(this.accMul(num, 100)) / 100;
    },
    /**
     * 保留小数点后两位
     * @param number
     * @param decimal
     * @returns {string}
     */
    toFixed(number, decimal) {
        decimal = decimal || 0;
        let s = String(number);
        let decimalIndex = s.indexOf('.');
        if (decimalIndex < 0) {
            let fraction = '';
            for (let i = 0; i < decimal; i++) {
                fraction += '0';
            }
            return s + '.' + fraction;
        }
        let numDigits = s.length - 1 - decimalIndex;
        if (numDigits <= decimal) {
            let fraction = '';
            for (let i = 0; i < decimal - numDigits; i++) {
                fraction += '0';
            }
            return s + fraction;
        }
        let digits = s.split('');
        let pos = decimalIndex + decimal;
        let roundDigit = digits[pos + 1];
        if (roundDigit > 4) {
            //跳过小数点
            if (pos === decimalIndex) {
                --pos;
            }
            digits[pos] = Number(digits[pos] || 0) + 1;
            //循环进位
            while (digits[pos] === 10) {
                digits[pos] = 0;
                --pos;
                if (pos === decimalIndex) {
                    --pos;
                }
                digits[pos] = Number(digits[pos] || 0) + 1;
            }
        }
        //避免包含末尾的.符号
        if (decimal === 0) {
            decimal--;
        }

        return digits.slice(0, decimalIndex + decimal + 1).join('');
    },
    /**
     * 图片压缩
     * @param options 自定义配置，包括file图片文件，format指定压缩的格式, width压缩后的宽度，height压缩后的高度，success压缩成功回调，error压缩失败回调
     */
    compressImage(options) {
        let default_options = {
            file: null,
            format: 'image/jpeg',
            width: 400,
            height: 400,
            success: null,
            error: null
        };

        options = this.extend(default_options, options);

        // 如果浏览器不兼容则直接上传图片
        if (typeof FileReader !== 'undefined') {
            // 压缩图片，避免因为行驶证图片过大导致行驶证识别时间长或失败
            let reader = new FileReader(),
                img = new Image();

            // 压缩图片大小，避免图片过大造成识别时间过长
            // 缩放图片需要的canvas
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            // 读文件成功的回调
            reader.onload = function (e) {
                // e.target.result就是图片的base64地址信息
                img.src = e.target.result;
            };
            // 图片加载成功回调
            img.onload = function () {
                // 图片原始尺寸
                let originWidth = this.width;
                let originHeight = this.height;
                // 最大尺寸限制
                let maxWidth = options.width, maxHeight = options.height;
                // 目标尺寸
                let targetWidth = originWidth, targetHeight = originHeight;
                // 图片尺寸超过400x400的限制
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }

                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                // canvas转为blob并上传
                canvas.toBlob(function (blob) {
                    if (options.success !== null) {
                        options.success(blob);
                    }
                }, options.format);
            };

            reader.readAsDataURL(options.file);
        } else {
            if (options.error !== null) {
                options.error();
            }
        }
    },
    /**
     * 站点统计
     */
    umeng() {
        var cnzz_protocol = (('https:' == document.location.protocol) ? 'https://' : 'http://');
        document.write(unescape(`%3Cspan class='hidden' id='cnzz_stat_icon_${UMENG_ID}'%3E%3C/span%3E%3Cscript src='${cnzz_protocol}v1.cnzz.com/z_stat.php%3Fid%3D${UMENG_ID}' type='text/javascript'%3E%3C/script%3E`));
    },
    /**
     *
     * 将秒数换成时分秒格式
     * @param value {number} 秒数
     * @param type {boolean} true表示使用汉字间隔，false表示使用:间隔
    */
    formatSeconds(value, type){
        let theTime = parseInt(value);  // 秒
        let theTime1 = 0;   // 分
        let theTime2 = 0;   // 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        let result = parseInt(theTime);
        if (result < 10) {
            result = '0' + result;
        }
        if (theTime1 > 0) {
            if (theTime1 < 10) {
                theTime1 = '0' + parseInt(theTime1);
            } else {
                theTime1 = parseInt(theTime1);
            }
        } else {
            theTime1 = '00';
        }
        result = theTime1 + (type ? '分' : ':') + result;
        if (theTime2 > 0) {
            if (theTime2 < 10) {
                theTime2 = '0' + parseInt(theTime2);
            } else {
                theTime2 = parseInt(theTime2);
            }
        } else {
            theTime2 = '00';
        }
        result = theTime2 + (type ? '小时' : ':') + result + (type ? '秒' : '');
        return result;
    },
    /**
     * 将date对象转换成yyyy-MM-dd的形式
     * @param date
     */
    formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
        date = date || new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
    
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
    
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        let str = format.replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    
        return str;
    },
    /**
     * 格式化日期，返回yyyy-MM-dd hh:mm:ss格式的日期
     * @param date 当前需要格式化的日期对象
     * @param format 格式，默认是yyyy-MM-dd HH:mm:ss
     * @return
     */
    formatDateCustom(date, format = 'yyyy-MM-dd HH:mm:ss') {
        date = date || new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        let str = format.replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
        return str;
    },
    /**
     * 扩展
     * @returns {Object|{}|any}
     */
    extend() {
        /* eslint-disable */
        let class2type = {};
        let toString = class2type.toString;
        let hasOwn = class2type.hasOwnProperty;

        function isPlainObject(obj) {
            let proto, Ctor;
            if (!obj || toString.call(obj) !== '[object Object]') {
                return false;
            }
            proto = Object.getPrototypeOf(obj);
            if (!proto) {
                return true;
            }
            Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
            return typeof Ctor === 'function' && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
        }

        // 默认不进行深拷贝
        let deep = false;
        let name, options, src, copy, clone, copyIsArray;
        let length = arguments.length;
        // 记录要复制的对象的下标
        let i = 1;
        // 第一个参数不传布尔值的情况下，target 默认是第一个参数
        let target = arguments[0] || {};
        // 如果第一个参数是布尔值，第二个参数是 target
        if (typeof target == 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 如果target不是对象，我们是无法进行复制的，所以设为 {}
        if (typeof target !== 'object' && !isFunction(target)) {
            target = {};
        }

        // 循环遍历要复制的对象们
        for (; i < length; i++) {
            // 获取当前对象
            options = arguments[i];
            // 要求不能为空 避免 extend(a,,b) 这种情况
            if (options != null) {
                for (name in options) {
                    // 目标属性值
                    src = target[name];
                    // 要复制的对象的属性值
                    copy = options[name];

                    // 解决循环引用
                    if (target === copy) {
                        continue;
                    }

                    // 要递归的对象必须是 plainObject 或者数组
                    if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                        // 要复制的对象属性值类型需要与目标属性值相同
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        target[name] = this.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
        /* eslint-enable */
    },
    /*
     * 将**：** 转换为分钟
     * @param {*} time 
     */
    countDown(time) {
        let hour = time.split(':')[0];
        let min = time.split(':')[1];
        return Number(hour * 60) + Number(min);
    },
    /**
     * 将分钟转换成HH:mm的形式，例如60分众转换成01:00
     * @param minute
     */
    reverseFormMinute(minute) {
        let hours = parseInt(minute / 60);
        let m = parseInt(minute % 60);
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return hours + ':' + m;
    },
    /**
     * 格式化时间
     * @param date {Date}
     * @return 格式化后的时间，例1970-01-01 12:00:00
     */
    formatDateByAcross(date) {
        let d = date || new Date();
        let year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();
        month = month > 9 ? month : ('0' + month);
        day = day > 9 ? day : ('0' + day);
        hours = hours > 9 ? hours : ('0' + hours);
        minutes = minutes > 9 ? minutes : ('0' + minutes);
        seconds = seconds > 9 ? seconds : ('0' + seconds);
        
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    /**
     * 将时间戳转换为年月日时分秒
     * 
     */
    format(time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
        let day = d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`;
        let hours = d.getHours() >= 10 ? d.getHours() : `0${d.getHours()}`;
        let min = d.getMinutes() >= 10 ? d.getMinutes() : `0${d.getMinutes()}`;
        let s = d.getSeconds() >= 10 ? d.getSeconds() : `0${d.getSeconds()}`;
        return `${year}-${month}-${day} ${hours}:${min}:${s}`;
    },
    /**
     * 将时间戳转换为1970年1月2日
     * 毫秒
     */
    formatBeCurrent(time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = d.getMonth() + 1 ;
        let day = d.getDate();
        return `${year}年${month}月${day}日`;
    },
    /**
     * 计算百度地图两点间的距离
     * @param {*} latlng1 
     * @param {*} latlng2 
     * @returns 
     */
    getDistance(latlng1, latlng2) {
        let lat1 = latlng1.latitude;
        let lng1 = latlng1.longitude;
        let lat2 = latlng2.latitude;
        let lng2 = latlng2.longitude;
        var radLat1 = (lat1 * Math.PI) / 180.0;
        var radLat2 = (lat2 * Math.PI) / 180.0;
        var a = radLat1 - radLat2;
        var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s * 1000;
    },

    /**
     * 保留小数（当数字没有超过保留小数位数则直接返回原值）
     * @param {*} number 数字 
     * @param {*} decimal  保留小数个数
     */
    toFixedOverDigit(number, decimal) {
        let string = String(number);
        if (string && string.split('.')[1] && string.split('.')[1].length > decimal) {
            return this.toFixed(number, decimal);
        } else {
            return number;
        }
    },

    /**
     * 腾讯坐标转百度坐标
     */
    tMapTransBMap(lat, lng) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng;
        let y = lat;
        let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta) + 0.0065;
        let lats = z * Math.sin(theta) + 0.006;
        
        return {
            lng: lngs,
            lat: lats 
        };
    }
};
