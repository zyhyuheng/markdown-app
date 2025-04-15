# markdown-app
## 依赖
1. 基于[Cherry Markdown](https://github.com/Tencent/cherry-markdown)创建的桌面应用程序
2. 桌面应用依赖于[electron](https://github.com/electron/electron)
3. 打包依赖于[Electron Forge](https://www.electronforge.io/)，[简单教程](https://www.electronjs.org/zh/docs/latest/tutorial/%E6%89%93%E5%8C%85%E6%95%99%E7%A8%8B)
## 开始
:::warning
安装最新版本node.js
:::

1. 安装依赖
``` 
npm install
```
2. 启动
``` 
npm run start
```
3. 打包成windows程序
``` 
npm run make
```
打包后程序路径
	- markdown-app\out\zyh-markdown-editor-win32-x64为可直接运行程序
	- markdown-app\out\make\squirrel.windows\x64下的exe为安装程序


