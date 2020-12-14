# React 通用管理后台

## 为什么做这个

作为一个 web 开发者，后台管理系统是最最常用的东西，甚至某些系统没有前端也得需要后台管理  

但是如果每次都重新构建一个全新的后台管理系统，却是不太友好的，也不太经济的，所以本项目试图构建一个通用化的后台管理系统便于敏捷开发。

## 依赖模块

项目是利用 create-react-app 构建

- [react](https://reactjs.org/) 
- [react-router](https://reactrouter.com/web/guides/quick-start)  
- [redux](https://redux.js.org/)  
- [antd](https://ant.design/)
- [axios](https://github.com/axios/axios)  
- [animate.css](https://animate.style/)  
- [lodash](https://lodash.com/)
- [js-yaml](https://github.com/nodeca/js-yaml)
- [webpack](https://webpack.js.org/)
- [loadable-components](https://github.com/gregberge/loadable-components)

## 代码目录

```js
+-- build/                                  ---打包的文件目录
+-- config/                                 ---npm run eject 后的配置文件目录
+-- public/
|   --- index.html                          ---项目入口html文件
+-- scripts/
|   --- build.js
|   --- buildI18n.js                        ---通过 yaml 构建 i18n.json 的脚本
|   --- start.js
|   --- test.js
+-- src/                                    ---核心代码目录
|   +-- assets                              ---静态文件存放目录
|   +-- components                          ---公共组件存放目录
|   +-- config                              ---项目配置文件目录
|   +-- layouts                             ---项目布局文件目录
|   +-- locals                              ---i18n 文件目录
|   +-- models                              ---model 层目录，用于与后端交换数据
|   +-- pages                               ---页面目录
|   +-- session                             ---存放会话相关信息
|   +-- store                               ---公共状态目录
|   +-- styles                              ---项目的公共样式存放目录，主要使用 scss
|   +-- utils                               ---工具文件存放目录
|   --- index.js                            ---项目的整体js入口文件
--- package.json
--- yarn.lock
```

## 安装运行

1. 克隆项目源码  
    `git clone https://github.com/jiz4oh/react-admin.git`
2. yarn 安装依赖(国内建议增加淘宝镜像源)  
    `yarn install`
3. 启动项目  
    `yarn start`
4. 打包项目  
    `yarn build`

## License

MIT
