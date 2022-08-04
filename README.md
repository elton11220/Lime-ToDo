## 介绍
青柠清单是一个使用React、Electron、TypeScript编写的跨平台的待办事项清单程序，包含了待办事项清单、日历视图、云同步等功能。

[README.en.md](https://github.com/elton11220/Lime-ToDo/blob/master/README.en.md)

[GitHub仓库](https://github.com/elton11220/Lime-ToDo)
|
[Gitee仓库（国内访问更快）](https://gitee.com/elton11220/Lime-ToDo)

> 本项目供个人练习和技术交流，`使用`、`修改`、`发行`、`商业用途`等行为需遵守[GPL v3](https://gitee.com/elton11220/Lime-ToDo/blob/master/LICENSE)协议。
<br/><br/>
此外，未经 [绿胡子大叔](https://gitee.com/elton11220) <u>授权</u>，禁止将`本项目源代码或发行版程序`、`以本项目为基础二次开发的代码及由其生成的可执行文件`在中国境内用于`参加任何形式的竞赛或活动`、`任何形式高等教育的毕业设计`、`申请计算机软件著作权`。本条款不受仓库内指定的[GPL v3协议](https://gitee.com/elton11220/Lime-ToDo/blob/master/LICENSE)约束， [绿胡子大叔](https://gitee.com/elton11220) 对上述列举的行为保留追究其法律责任及相关责任的权利。
<br/><br/>
上文下划线处“授权”指：在[绿胡子大叔](https://gitee.com/elton11220)的[Gitee主页](https://gitee.com/elton11220)或[项目仓库中的README.md文件](https://gitee.com/elton11220/Lime-ToDo/blob/master/README.md)中由 [绿胡子大叔](https://gitee.com/elton11220) 本人公开声明被授权人可以以何种方式使用此项目
<br/><br/>
如果本附加条款的中文版本和英文版本之间存在争议，应以中文版本为主要参考

## 开发计划

- [ ] Windows平台客户端开发
- [ ] 暗黑模式
- [ ] 使用react-dnd或其他库实现菜单项拖动排序
- [ ] 打卡功能
- [ ] 自动更新功能
- [ ] 全局搜索功能
- [ ] 不同尺寸窗口的响应性样式
- [ ] 用户界面国际化
- [ ] macOS平台客户端适配
- [ ] 云同步
- [ ] 私有化云同步
- [ ] App开发（React Native）
- [ ] 考虑使用其他数据结构重构ToDoMenu组件内部数据结构
- [ ] 待更新...

## 安装

克隆这个仓库并安装依赖：

```shell
git clone https://gitee.com/elton11220/Lime-ToDo.git your-project-name
cd your-project-name
yarn
```

## 开始开发

在开发环境启动程序：

```shell
yarn start
```

## 打包发行

为本地平台打包程序：

```shell
yarn package
```

