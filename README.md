# 数据可视化大作业

对于规定数据，画出所有数据点散列图，并且做到如下几点：

* 散点图显示（横轴、纵轴、数据点以及图例）
* 对于不同分类的数据点采用不同颜色进行区分
* 通过一个选择框，可以选择不同的x轴以及y轴的维度进行区分
* 可根据不同维度重绘散点图
* 支持缩放
* 支持鼠标悬浮查看数据点详细信息

## 快速开始

项目采用yarn作为包管理工具，并需要一个httpserver运行项目，请确定电脑环境已有node及yarn环境以及一个http server

```shell
cd homework
yarn install
yarn start
```

在搭建完成如上两步操作后，控制台应出现字样如下：

```shell
Entrypoint main = bundle.js bundle.js.map
[./src/main.ts] 1.14 KiB {main} [built]
[./src/util.ts] 6.49 KiB {main} [built]
```

若成功，则检查homework/public目录下是否存在bundle.js文件。若存在，则根据不同的httpserver服务，在项目根目录启动，此处以python举例（*unix系统自带python）

```shell
python -m SimpleHTTPServer 8000
```

完成后，浏览器进入http://localhost:8000/public/index.html即可查看项目（请根据不同httpserver进入相对应的url）

## 工具链介绍

* typescript，赋予javascript强类型，通过@types使自动提示友好
* webpack，集成式一键打包，通过bundle.js可一键引入
* webpack-ts-loader，webpack针对于typescript的兼容，可编译ts代码并打包，并合并两步sourcemap，方便调试

## 项目结构

* assets 静态资源文件夹，此处包含着数据文件（flowers.csv）
* node_module 引入的第三方库，包括d3.js框架以及各种开发依赖代码（typescript、webpack等）
* public 项目输出目录
* src 源代码目录
* package.json node项目声明文件，包括项目名、依赖、脚本声明等
* tsconfig.json typescript编译选项文件
* webpack.config.js webpack配置文件
* yarn.lock lock文件，标示安装依赖的版本

## 直接访问

若无node环境或server，可直接访问xxxxxxx进行访问（境外服务器，慢，请谅解）

