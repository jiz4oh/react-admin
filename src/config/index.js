/**
 * 定义整个项目的全局配置
 */
module.exports = {
    // 是否开启debug模式, 不会请求后端接口, 使用 mock 的数据
    debug: true,
    userInfoCookieKey: '_react_admin_user_info',
    loginCookieKey: '_react_admin_session',
    permissionKey: '_react_admin_permissions',
    api: {  // 对后端请求的相关配置
        host: 'http://localhost:30000',  // 调用 ajax 接口的地址, 默认值空, 如果是跨域的, 服务端要支持 CORS
        path: '/react_admin',  // ajax 请求的根路径
        timeout: 15000,  // 请求的超时时间, 单位毫秒
    },
    get imageUploadUrl() {
        // 因为返回值使用了 this，需要使用 getter 来定义属性
        return (
            this.debug
                ? "https://www.mocky.io/v2/5cc8019d300000980a055e76"
                : `${this.api.host}${this.api.path}/images`
        )
    },
    get fileUploadUrl() {
        return (
            this.debug
                ? "https://www.mocky.io/v2/5cc8019d300000980a055e76"
                : `${this.api.host}${this.api.path}/files`
        )
    },
    log: {
        // 默认日志级别
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
        // 除了 root logger 以外, 也可以为每个 logger 单独设置级别
        debug: [],
        info: [],
        warn: [],
        // 示例, 对于 loggerA 和 loggerB 使用 error 级别, 其他 logger 使用默认的 info 级别
        error: ['loggerA', 'loggerB']
    },
    locate: 'zh-CN',
    // 使用 rails 已有的 i18n 文件
    i18nLocalesDir: '/Users/jiz4oh/Documents/RbProjects/benefit_travel_cq_backend/config/locales',
    DBTable: {
        pageSize: 10,
        CRUD: ['new', 'edit', 'delete'],
        expandable: {
            // 通过点击行来展开子行
            expandRowByClick: true,
            indentSize: 20
        },
        remote: true,
    },
}
