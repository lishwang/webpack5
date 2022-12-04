学习文档

webpack5的基础配置
webpack是一个打包工具，打包js、css、图片、html等，它可以分析整个项目的文件结构，确认文件之间的依赖，将文件合成、压缩、加入hash等，生成最终项目文件。webpack把所有文件当成模块，但是webpack内置默认的加载器是处理js的，如果要处理其他类型的文件则需要引入不同的loader加载器，用来转化其他文件进行编译打包。webpack通过使用babel-loader使用Babel ；
webpack和babel通常配合起来使用，babel是js编译工具,能将es6或者一些特殊语法做一些转换，只做文件转义，不做文件整合。webpack是一个打包工具，内置只能处理js，但是它可以加载很多的loader处理css,img,ts,vue等其他文件,最终输出js文件。webpack通过使用babel-loader使用Babel 。
起步（通过控制台输入命令做webpack简单的打包，只能打包 js 和 json 文件）
新建一个空文件夹；
根目录创建 src 文件夹，src 内部创建 main.js 入口文件；
src 文件内创建 js 文件夹，内部创建两个 js 文件，并通过 import 与 export default 默认引入和导出到 main.js 入口文件；
npm init -y 初始化包管理工具；
npm install -D webpack webpack-cli 安装开发依赖 webpack；
执行 npx webpack ./src/main.js --mode=development 使用 webpack 打包项目，打包后的文件路径为 ./dist/main.js ；
根目录创建 static 文件夹，内部创建 index.html 文件，并通过 script 引入打包后的文件路径即可执行；
webpack的配置文件
在项目根目录下创建 webpack.config.js 文件；

所有的配置文件都是在 nodejs 平台运行的，因此配置文件内部采用的模块化采用的都是 commonJs 的模块化（module.export={ xxx }）;
配置文件中的主要内容；

入口

打包的入口文件路径，一般是相对路径；
module.export = {
	entry: './src/main.js';
}
输出

输出文件路径一般是绝对路径；
输出属性值一般是一个对象；
输出配置文件中设置 clean 为 true ，即可实现自动清空上次打包的内容；但是在 webpack4 中需要在插件中实现；
const path = require('path'); // nodejs模块，专门用来处理路径问题

module.export = {
    output: {
        // 文件的输出路径（输出文件夹）
        path: path.resolve(__dirname, 'dist'), // path.resolve() 返回一个绝对路径；__dirname 当前文件的文件夹的目录；'dist' 输出的文件夹名称为 dist；
        // 输出文件名
        filename: 'main.js',
        // 自动清空上次打包的内容
    	clean: true,
    }
}
加载器

处理样式资源

下载loader

css-loader 负责将 Css 文件编译成 Webpack 能识别的模块（commonjs）到 js 中；
style-loader 会动态创建一个 Style 标签，里面放置 Webpack 中 Css 模块内容，并添加到 html 文件中使样式生效；
npm i css-loader style-loader -D
注意：loader 的执行顺序：从右到左（从下到上）

use的属性值是一个数组，可以使用多个 loader ；loader属性 的属性值是一个字符串，只能使用一个 loader ；

module.export = {
	module: {
		rules: [
			{
                test: /\.css$/, // 检测css文件
                // loader 的执行顺序：从右到左（从下到上）
                use: [
                  'style-loader', // 将 js 中的css代码通过创建style标签添加到html文件中使样式生效；
                  'css-loader', // 将 css 资源编译成 commonjs 的模块到js 中；
                ]
            }
		]
	}
}
处理图片资源

过去在 Webpack4 时，我们处理图片资源通过 file-loader 和 url-loader 进行处理，现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源，不需要安装loader；
另外，对于较小的图片可以将其转换成base64格式的字符串，减少浏览器请求，优化性能；
可以设置生成的图片名字以及打包输出的图片所在的目录，做到打包输出的文件归类放置；
module.export = {
	module: {
		rules: [
			{
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
                parser: {
                  // 如果图片不大于100kb，将会被转化成base64格式的图片字符串
                  dataUrlCondition: {
                    maxSize: 100 * 1024 // 100kb
                  }
                },
                generator: {
                  // 设置生成的图片名字以及打包输出的图片所在的目录，做到打包输出的文件归类放置；
                  // hash 图片打包后会有一个唯一的id（图片默认情况下打包后的名字），这个id在webpack中被称为hash值；
                  // [hash:6] 表示取hash值的前六位最为图片的名字；
                  // ext 文件扩展名，之前是 .png 打包后 ext 还是 .png；
                  // query 查询参数，如果在url地址中写了其他参数，这里会携带上；
                  filename: 'static/images/[hash:6][ext][query]'
                },
            },
		]
	}
}
处理字体图标 以及 其他资源（不做资源内容的处理，原封不动的打包输出，例如音频、视频资源等）

字体图标不需要转base64，因此配置属性 type: "asset/resource" 将文件原封不动的打包输出；
module.export = {
	module: {
		rules: [
			{
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                type: "asset/resource", // 将文件原封不动的打包输出
                generator: {
                  // 设置打包输出的文件名字以及打包输出的文件所在的目录
                  filename: 'static/media/[hash:6][ext][query]'
                },
             },
		]
	}
}
插件

配置 HTML 模板

之前我们是手动引入的打包后的 js 资源，但如果 webpack 配置中修改了 打包输出路径，还要手动修改 html 文件中引入的 js 路径；因此可以借助插件来实现打包后 js 文件的自动引入；

使用方式：

安装插件 npm install --save-dev html-webpack-plugin ;
webpack 配置文件中配置插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
// 插件
  plugins: [
    // 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
    new HtmlWebpackPlugin({
    	// 模板：以 public/index.html 为模板，创建新的html文件，并打包到 dist 文件下；
      	// 这个新的html文件有两个特点：1、DOM结构与模板中的一致；2、会自动引入打包后的资源；
      	template: './static/index.html',
    }),
  ],
}
module.export = {
    plugins: [
    	// 插件
    ]
}
模式

模式有两种：development 和 production
module.export = {
	mode: 'development'
}
由于写了配置文件，因此可以直接执行 npx webpack 即可完成简单的打包；

Eslint
官网
Eslint的配置文件
配置文件由很多种写法：
1、新建文件，位于项目根目录

.eslintrc
.eslintrc.js
.eslintrc.json
区别在于配置格式不一样
2、package.json 中 eslintConfig：不需要创建文件，在原有文件基础上写；

ESLint 会查找和自动读取它们，所以以上配置文件只需要存在一个即可；

以 .eslintrc.js 语法为例，书写 Eslint 配置文件
module.exports = {
  // 解析选项
  parserOptions: {},
  // 具体检查规则
  rules: {},
  // 继承其他规则
  extends: [],
  // ...
  // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
};
parserOptions 解析选项
parserOptions: {
  ecmaVersion: 6, // ES 语法版本，表示ES6
  sourceType: "module", // ES 模块化
  ecmaFeatures: { // ES 其他特性
    jsx: true // 如果是 React 项目，就需要开启 jsx 语法
  }
}
rules 具体规则
"off" 或 0 - 关闭规则
"warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
"error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
更多规则详见：规则文档
rules: {
  semi: "error", // 禁止使用分号
  'array-callback-return': 'warn', // 强制数组方法的回调函数中有 return 语句，否则警告
  'default-case': [
    'warn', // 要求 switch 语句中有 default 分支，否则警告
    { commentPattern: '^no default$' } // 允许在最后注释 no default, 就不会有警告了
  ],
  eqeqeq: [
    'warn', // 强制使用 === 和 !==，否则警告
    'smart' // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少数情况下不会有警告
  ],
}
extends 继承

开发中一点点写 rules 规则太费劲了，所以有更好的办法，继承现有的规则。现有以下较为有名的规则：

[Eslint 官方的规则：eslint:recommended
Vue Cli 官方的规则：plugin:vue/essential
React Cli 官方的规则：react-app
// 例如在React项目中，我们可以这样写配置
module.exports = {
  extends: ["react-app"], // 继承 react cli 官方的 Eslint规则
  rules: {
    // 我们的规则会覆盖掉react-app的规则
    // 所以想要修改规则直接改就是了
    eqeqeq: ["warn", "smart"], // 新增规则 或者 覆盖掉继承的规则
  },
};
webpack 处理 Eslint 代码
Eslint 在 webpack4 中是用 loader 来处理的；但在 webpack5 中用 插件 处理的；
webpack5 用 插件 处理 Eslint
安装 npm i eslint-webpack-plugin eslint -D ；

webpack.config.js 配置

# webpack.config.js 文件内
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "src"),
    }),
],
在文件根目录创建 Eslint 的配置文件（以 .eslintrc.js 为例）

// 以下eslint配置举例
module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"], // 继承 Eslint 官方的规则
  // 环境变量
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量，比如：window、console等
  },
  parserOptions: {
    ecmaVersion: 6, // 语法环境：ES6
    sourceType: "module", // ES module
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量，否则报错误级别的错误，2 等同于 error
  },
};
如果代码中使用 var 来声明变量，如果 vscode 没有安装 Eslint 插件，则会在编译代码时报错；如果 vscode 安装了 eslint 插件，则会在书写代码时就会报错，因此建议在 vscode 中安装 eslint 插件；

.eslintignore 文件，用于配置 Eslint 忽略检查的文件；比如：通过webpack打包后的dist文件内不需要被eslint检查，因此可忽略；

// .eslintignore 文件内
# 忽略dist目录下所有文件
dist
可以在 settings.json 文件内配置是否在保存时修复 eslint 发现的语法错误；

// settings.json 文件内
{
	"liveServer.settings.donotShowInfoMsg": true,
	"explorer.confirmDelete": false,
	"emmet.excludeLanguages": ["markdown"],
	"liveServer.settings.host": "192.168.37.60",
	"explorer.confirmDragAndDrop": false,
	"workbench.editor.enablePreview": false,
	"cssrem.rootFontSize": 80,
	"window.zoomLevel": 2,
	"editor.minimap.enabled": false,
	"[vue]": {
		"editor.defaultFormatter": "octref.vetur"
	},
	"[javascript]": {
		"editor.defaultFormatter": "vscode.typescript-language-features"
	},
	"eslint.validate": ["javascript", "javascriptreact"],
	"vetur.ignoreProjectWarning": true,
	"vetur.format.defaultFormatter.js": "vscode-typescript",
	"vetur.format.defaultFormatter.html": "js-beautify-html",
	"vetur.format.defaultFormatterOptions": {

		"js-beautify-html": {
			"wrap_line_length": 80, // Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline] ["auto"]
			// "wrap_attributes": "force-expand-multiline" // DOM 标签超过两个换行
		}
	},
	"editor.tabSize": 2,
	"git.ignoreLimitWarning": true,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true, // 保存时是否自动修复eslint检测报错的代码
	},
	"git.confirmSync": false,
	"eslint.quiet": true,
	"javascript.format.insertSpaceBeforeFunctionParenthesis": true,
	"typescript.format.insertSpaceAfterConstructor": true,
	"typescript.format.insertSpaceBeforeFunctionParenthesis": true,
	"javascript.preferences.quoteStyle": "single",
	"javascript.format.insertSpaceAfterConstructor": true,
	"typescript.preferences.quoteStyle": "single",
	// "html.format.wrapAttributes": "force-expand-multiline", // DOM 标签超过两个换行
	"editor.formatOnSave": true,
	"prettier.vueIndentScriptAndStyle": true,
	"prettier.singleQuote": true,
	"prettier.useTabs": true,
	"prettier.printWidth": 100,
	"eslint.workingDirectories": [
		".eslintrc.js",
		{
			"mode": "auto"
		}
	],
	"[json]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"editor.fontSize": 12,
	"[html]": {
		"editor.defaultFormatter": "vscode.html-language-features"
	},
	"javascript.updateImportsOnFileMove.enabled": "always",
	"vetur.validation.template": false,
	"eslint.codeActionsOnSave.rules": null
}

Babel
官网
JavaScript 编译器。主要用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中；
babel是一个JS编译器，用来将ES6/ES7等语法转换为ES5语法（浏览器不认识的语法编译成浏览器认识的语法），从而能够使代码在大部分浏览器中运行。但是babel转换语法时有一些新的api是不转化的，比如promise、Object.assign等，所以babel还提供了很多插件，如babel-polyfill。
webpack和babel通常配合起来使用，babel是js编译工具,能将es6或者一些特殊语法做一些转换，只做文件转义，不做文件整合。webpack是一个打包工具，内置只能处理js，但是它可以加载很多的loader处理css,img,ts,vue等其他文件,最终输出js文件。webpack通过使用babel-loader使用Babel 。
Babel 的配置文件
Babel 的配置文件由很多种写法：Babel 会查找和自动读取它们，所以以下配置文件只需要存在一个即可
新建文件，位于项目根目录
babel.config.js
babel.config.json
.babelrc
.babelrc.js
.babelrc.json
不需要创建文件，在原有文件基础上写
package.json 中 babel ；
以 babel.config.js 配置文件为例
module.exports = {
	// 预设
  	presets: ["@babel/preset-env"],
};
presets 预设，简单理解：就是一组 Babel 插件, 扩展 Babel 功能；
@babel/preset-env: 一个智能预设，允许您使用最新的 JavaScript ；
@babel/preset-react：一个用来编译 React jsx 语法的预设 ；
@babel/preset-typescript：一个用来编译 TypeScript 语法的预设 ；
webpack 处理 Babel 代码
webpack5 用 loader 处理 Babel 代码
下载包

npm i babel-loader @babel/core @babel/preset-env -D
定义 Babel 配置文件，以 babel.config.js 配置文件为例

module.exports = {
	// 预设
  	presets: ["@babel/preset-env"],
};
在 webpack 的配置文件中配置 loader 处理 Babel 代码

module: {
    rules: [
    	{
            test: /\.js$/,
            exclude: /node_modules/, // 排除 node_modules 代码不编译
            loader: "babel-loader",
            // options: {
            // 		presets: ["@babel/preset-env"],  // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
            // },
        },
    ]
}
webpack 重新编译，执行 npx webpack ；查看效果：例如：函数形参中 扩展运算符 改为 arguments 接收参数；

开发服务器&自动化
每次写完代码都需要手动输入指令 npx webpack 才能编译代码，太麻烦了，我们希望一切自动化；
使用：
安装： npm i webpack-dev-server -D ;

在webpack中配置

module.exports = {
	// 开发服务器，需要运行 npx webpack serve 才能启动开发服务器，不会生成打包后的文件，而是在内存中编译打包的，而且修改完代码后自动打包且更新浏览器展示
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
    },
}
运行指令 npx webpack serve ，运行旧指令是不会启动开发服务器的，注意：新指令不会生成打包后的文件，而是在内存中编译打包的，而且修改完代码后自动打包且更新浏览器展示；

生产模式下webpack配置
生产模式下的webpack配置文件调整
代码中调整步骤：
根目录新建 config 文件夹，将webpack的配置文件（生产模式下仿照开发模式下的配置文件进行配置）移入到 config 文件内；

调整 两种模式下的 webpack 配置文件内的路径；

相对路径不用调整，因为webpack的配置文件运行时还是在根目录；
绝对路径需要加上 ../ ；
对于开发模式下的webpack配置文件的调整：

绝对路径需要加上 ../ ；
输出路径改为path: undefined，也可以不改；（ 配置了开发服务器后，不会真正的有文件输出，而是在内存中打包的，因此可以不写输出路径，也不需要配置clean来清空上次打包内容，但是输出文件名要写）
执行指令 npx webpack serve --config ./config/webpack.dev.js 打包并自动运行到浏览器；
对于生产模式下的webpack配置文件的调整：

绝对路径需要加上 ../ ；
生产模式不需要devServer（配置的开发服务器），要删掉；
mode: production ;
执行指令 npx webpack --config ./config/webpack.prod.js 打包；
在 package.json 文件内配置运行脚本指令快捷键；

"scripts": {
    "start": "npm run dev", // 直接执行 npm start 即可运行开发模式的项目打包；
    "dev": "webpack serve --config ./config/webpack.dev.js", // 开发模式的项目打包；
    "build": "webpack --config ./config/webpack.prod.js" // 生产模式的项目打包；
},
提取 css 成单独的文件
Css 文件目前被打包到 js 文件中，当 js 文件加载时，会创建一个 style 标签来生成样式，这样对于网站来说，会出现闪屏现象，用户体验不好；我们应该是单独的 Css 文件，通过 link 标签加载性能才好；

MiniCssExtractPlugin 插件的使用：

安装包

npm i mini-css-extract-plugin -D
webpack.prod.js 文件内使用该插件：

# 1、引入
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

# 2、删掉module中的 style-loader 改成 MiniCssExtractPlugin.loader；例如：
module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        use: [
        	"style-loader", // 这个loader会动态创建style标签，将 js 中的css代码通过创建的style标签添加到html文件中使样式生效；
            MiniCssExtractPlugin.loader, // 把css文件提取成单独的文件，所以不需要引入style-loader来创建style标签了；
            "css-loader"
        ],
      },
    ],
}

# 3、配置plugins
plugins: [
	// 提取css成单独文件，并结合 HtmlWebpackPlugin 插件，可以实现打包后 css 自动通过 link 标签引入到 html 文件中；
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/main.css",
    }),
]
css 兼容性处理
js 的兼容性问题（ES6+ => ES5）由 babel 处理，而样式也有兼容性问题，比如浏览器的兼容；

postcss-loader 的使用步骤：

安装包

npm i postcss-loader postcss postcss-preset-env -D
webpack.prod.js 文件内使用该loader：

module: {
    rules: [
    	{
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              // postcss-loader 必须使用在  "css-loader"  之前，且在  "less-loader"  等loader之后；
              // 如果loader需要额外的配置，需要将该loader写成对象的形式；
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                  },
                },
              },
              "less-loader",
            ],
        },
    ]
}
注意：postcss-loader 必须使用在 "css-loader" 之前，且在 "less-loader" 等loader之后；

可以用 user-select 进行测试；

// 打包后生成的兼容性样式
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
配置浏览器兼容程度：

可以在 package.json 文件中添加 browserslist 来控制样式的兼容性做到什么程度；更多的 browserslist 配置，查看browserslist 文档 ；
// 比较常见的浏览器兼容程度的配置
{
  // 满足以下条件的交集的浏览器才做兼容
  "browserslist": [
      "last 2 version",  // 所有浏览器最近的两个版本
      "> 1%",  // 市场占有率大于1%的浏览器
      "not dead" // 还在维护的浏览器
  ]
}
css 压缩
CssMinimizerWebpackPlugin 插件的使用步骤：

安装包

npm install css-minimizer-webpack-plugin --save-dev
webpack.prod.js 中使用

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 插件
plugins: [
	// css压缩
    new CssMinimizerPlugin(),
]
html 、js 压缩
只要设置 mode 为 production 生产模式，默认开启 html 压缩 和 js 压缩，不需要额外配置；
webpack高级
提升开发体验
SourceMap（源代码映射）
查看Webpack DevTool 文档
SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案。
它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。
使用：
开发模式：cheap-module-source-map

优点：打包编译速度快，只包含行映射；
缺点：没有列映射；
module.exports = {
  // 其他省略
  mode: "development",
  devtool: "cheap-module-source-map",
};
生产模式：source-map

优点：包含行/列映射，因为生产模式下打包后的文件是被压缩的，只有一行，因此要定位错误代码位置，需要精确到列；
缺点：打包编译速度更慢；
module.exports = {
  // 其他省略
  mode: "production",
  devtool: "source-map",
};
提升打包构建速度
HotModuleReplacement 热替换（只针对开发模式）
开发时我们修改了其中一个模块代码，Webpack 默认会将所有模块全部重新打包编译，速度很慢。所以我们需要做到修改某个模块代码，就只有这个模块代码需要重新打包编译，其他模块不变，这样打包速度就能很快。
HotModuleReplacement（HMR/热模块替换）：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面。
使用
对于 css 样式
由于 css 样式经过 style-loader 的处理，已经具备 HMR 功能了，因此，只需要在webpack配置文件中开启即可；
module.exports = {
  // 其他省略
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
  },
};
对于 js
如果我们自己写的 js 项目，需要在 main.js 文件内监听模块的变化；

各个文件模块的监听的回调不会相互影响；哪一个模块发生变化，就执行哪一个回调；

# main.js 文件内

// 判断是否支持HMR功能
if (module.hot) {
  // 回调函数可以不写，也会只更新这个count.js文件模块
  module.hot.accept("./js/count.js", function (count) {
  	// count.js 文件修改后，要执行的回调函数
    const result1 = count(2, 1);
    console.log(result1);
  });
  // 回调函数可以不写，也会只更新这个sum.js文件模块
  module.hot.accept("./js/sum.js", function (sum) {
    const result2 = sum(1, 2, 3, 4);
    console.log(result2);
  });
}
但是在我们实际开发中，通常借助 vue 或 react 框架，它们有自带的 vue-loader 和 react-hot-loader ；因此跟css一样只需要在 webpack 配置文件中开启 HMR 功能即可自动实现模块的热替换；

OneOf
打包时每个文件都会经过所有 loader 处理，虽然因为 test 正则原因实际没有处理上，但是都要过一遍。比较慢。
OneOf 只能匹配上一个 loader, 剩下的就不匹配了。
使用（生产和开发模式都要配置）
在所有的 loader 对象外面包一层 oneOf 数组即可；
# webpack 的配置文件内

module.exports = {
	module: {
        rules: [
              {
                 oneOf: [
                      {
                          // 用来匹配 .css 结尾的文件
                          test: /\.css$/,
                          // use 数组里面 Loader 执行顺序是从右到左
                          use: ["style-loader", "css-loader"],
                      },
                      {
                          test: /\.less$/,
                          use: ["style-loader", "css-loader", "less-loader"],
                      },
                      // 其他loader省略
                 ]
             }
        ],
    }
}
Include/Exclude
开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要编译可以直接使用的。
所以我们在对 js 文件处理时，要排除 node_modules 下面的文件，例如 eslint 、babel 处理时要排除。
注意：include 和 exclude 不可以同时使用，只写一个即可；
用法
eslint 、babel 处理 js 文件时排除 node_modules 下面的文件；（生产模式和开发模式都要配置）
# webpack 的配置文件内

module.exports = {
	module: {
		// webpack5 用 loader 处理 Babel 代码
        {
          test: /\.js$/,
          // exclude: /node_modules/, // 排除 node_modules 代码不编译；include、exclude不能同时使用；
          include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
          loader: "babel-loader",
          // options: {
          //   presets: ["@babel/preset-env"], // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
          // }
        }
	},
	// 插件
    plugins: [
        // 用于处理 Eslint 的插件
        new ESLintWebpackPlugin({
            // Eslint的配置选项，指定检查文件的根目录
            context: path.resolve(__dirname, "../src"), // 哪些文件要做Eslint检查，检查src文件下的所有文件
            exclude: "node_modules", // （默认值）排除 node_modules 代码不编译；include、exclude不能同时使用；
            // include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
        }),
    ]
}
Cache 缓存
每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时只需要检查和编译被修改的文件即可，速度就会更快了。
用法
打包后，会把 Eslint 检查 和 Babel 编译结果的缓存文件 添加到 node_modules/.cache 文件夹下；
# webpack 的配置文件内

module.exports = {
	module: {
		// webpack5 用 loader 处理 Babel 代码
        {
          test: /\.js$/,
          // exclude: /node_modules/, // 排除 node_modules 代码不编译；include、exclude不能同时使用；
          include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
          loader: "babel-loader",
          options: {
          	// presets: ["@babel/preset-env"], // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
          	cacheDirectory: true, // 开启babel编译缓存
            cacheCompression: false, // 缓存文件不要压缩
          }
        }
	},
	// 插件
    plugins: [
        // 用于处理 Eslint 的插件
        new ESLintWebpackPlugin({
            // Eslint的配置选项，指定检查文件的根目录
            context: path.resolve(__dirname, "../src"), // 哪些文件要做Eslint检查，检查src文件下的所有文件
            exclude: "node_modules", // （默认值）排除 node_modules 代码不编译；include、exclude不能同时使用；
            // include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"), // 缓存目录
        }),
    ]
}
Thead 多进程打包
对 js 文件处理主要就是 eslint 、babel、Terser 三个工具，Terser 就是在生产模式下，webpack会自动使用这个插件来压缩 js 代码；
之前打包的过程都是使用一个进程，速度比较慢，因此可以开启 多进程打包：开启电脑的多个进程同时干一件事，速度更快。
注意：请仅在特别耗时的操作（项目比较大）中使用，因为每个进程启动就有大约为 600ms 左右开销。
使用（生产和开发都配置）
先获取 CPU 的核数，因为启动进程的最大数量就是我们 CPU 的核数。

// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;
安装包

npm i thread-loader -D
webpack 的配置文件中使用，由于是 js 文件打包比较耗时，因此在 处理 js 文件的 babel 和 eslint 上配置多进程；

// 压缩 js 代码的插件，不需要安装，内置模块
const TerserPlugin = require("terser-webpack-plugin");
// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;

module.exports = {
	// 加载器
    module: {
        rules: [
        	{
                oneOf: [
					  // webpack5 用 loader 处理 Babel 代码
                      {
                        test: /\.js$/,
                        // exclude: /node_modules/, // 排除 node_modules 代码不编译；include、exclude不能同时使用；
                        include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
                        use: [
                          {
                            loader: "thread-loader", // 开启多进程
                            options: {
                              workers: threads, // 开启多线程的数量，就是 CPU 的核数；
                            },
                          },
                          {
                            loader: "babel-loader",
                            options: {
                              // presets: ["@babel/preset-env"], // 如果在 webpack 的配置文件中添加了babel预设的配置，就不需要在 外面的 babel 配置文件中再配置了；
                              cacheDirectory: true, // 开启babel编译缓存
                              cacheCompression: false, // 缓存文件不要压缩
                            }
                          }
                        ],
                      }
                ]
             }
        ]
    }
	// 插件
  	plugins: [
        // 用于处理 Eslint 的插件
        new ESLintWebpackPlugin({
          // Eslint的配置选项，指定检查文件的根目录
          context: path.resolve(__dirname, "../src"), // 哪些文件要做Eslint检查，检查src文件下的所有文件
          exclude: "node_modules", // （默认值）排除 node_modules 代码不编译；include、exclude不能同时使用；
          // include: path.resolve(__dirname, '../src'), // 只处理 src 下的文件；include、exclude不能同时使用；
          cache: true, // 开启缓存
          // 缓存目录
          cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
          threads, // 开启多进程
        }),

        // 配置 HTML 模板，可以借助插件来实现打包后 js 文件的自动引入到 html 文件中
        new HtmlWebpackPlugin({
          // 模板：以 public/index.html 为模板，创建新的html文件，并打包到 dist 文件下；
          // 这个新的html文件有两个特点：1、DOM结构与模板中的一致；2、会自动引入打包后的资源；
          template: path.resolve(__dirname, '../public/index.html'), // html模板路径可以为相对路径或者绝对路径；
        }),
        // 提取css成单独文件，并结合 HtmlWebpackPlugin 插件，可以实现 css 自动通过 link 标签引入到 html 文件中；
        new MiniCssExtractPlugin({
          // 定义输出文件名和目录
          filename: "static/css/main.css",
        }),

        // css压缩 （可以写到optimization.minimizer里面，效果一样的）
        // new CssMinimizerPlugin(),

		// js压缩
        // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
        // （可以写到optimization.minimizer里面，效果一样的）
        // new TerserPlugin({
        //   parallel: threads // 开启多进程
        // })
    ],
    
    // 一般压缩的内容放在这里
	optimization: {
        minimize: true,
        minimizer: [
          // css压缩 （可以写在插件plugins里面，效果一样的）
          new CssMinimizerPlugin(),
          // js压缩
          // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
          // （可以写在插件plugins里面，效果一样的）
          new TerserPlugin({
            parallel: threads // 开启多进程
          })
        ],
    },
}
减少打包后代码体积
Tree Shaking
开发时我们定义了一些工具函数库，或者引用第三方工具函数库或组件库。如果没有特殊处理的话我们打包时会引入整个库，但是实际上可能我们可能只用上极小部分的功能。这样将整个库都打包进来，体积就太大了。
Tree Shaking 是一个术语，通常用于描述移除 JavaScript 中的没有使用上的代码；打包时会自动移除没有使用的代码，比如某个 js 文件中没有使用的函数等。
注意：它依赖 ES Module。
生产模式下 Webpack 已经默认开启了这个功能，无需其他配置。
Babel 插件配置
Babel 为编译的每个文件都插入了辅助代码，使代码体积过大！

Babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。默认情况下会被添加到每一个需要它的文件中。

你可以将这些辅助代码作为一个独立模块，来避免重复引入。

@babel/plugin-transform-runtime 的作用 : 禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 @babel/plugin-transform-runtime ，并且使所有辅助代码从这里引用，从而减少打包后代码体积。

使用（开发和生产）
安装包

npm i @babel/plugin-transform-runtime -D
给 Babel 的 loader 配置插件

module: {
    rules: [
      {
        oneOf: [
        	{
                test: /\.js$/,
                // exclude: /node_modules/, // 排除node_modules代码不编译
                include: path.resolve(__dirname, "../src"), // 也可以用包含
                use: [
                  {
                    loader: "thread-loader", // 开启多进程
                    options: {
                      workers: threads, // 数量
                    },
                  },
                  {
                    loader: "babel-loader",
                    options: {
                      cacheDirectory: true, // 开启babel编译缓存
                      cacheCompression: false, // 缓存文件不要压缩
                      plugins: ["@babel/plugin-transform-runtime"], // Babel 插件配置,减少代码体积
                    },
                  },
                ],
            },
        ]
      }
    ]
}
Image Minimizer 图片压缩
开发如果项目中引用了较多图片，那么图片体积会比较大，将来请求速度比较慢。

我们可以对图片进行压缩，减少图片体积。

注意：如果项目中图片都是在线链接，那么就不需要了。本地项目静态图片才需要进行压缩。

image-minimizer-webpack-plugin: 用来压缩图片的插件

使用（开发和生产）
安装包（经常安装失败）

有损/无损压缩的区别
# 用来压缩图片的插件
npm i image-minimizer-webpack-plugin imagemin -D

# 无损压缩（两种压缩模式选一种）
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D

# 有损压缩（两种压缩模式选一种）
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
配置，我们以无损压缩配置为例：

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// 压缩的配置一般放在这里，也可以放在插件plugins里
optimization: {
    minimizer: [
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ]
}
打包时会出现报错：如果提示需要安装两个文件到 node_modules 中才能解决， 文件可以从课件中找到：

jpegtran.exe 需要复制到 node_modules\jpegtran-bin\vendor 下面；jpegtran 官网地址
optipng.exe 需要复制到 node_modules\optipng-bin\vendor 下面；OptiPNG 官网地址
优化代码运行性能
代码分割（Code Split）
打包代码时会将所有 js 文件打包到一个文件中，体积太大了。我们如果只要渲染首页，就应该只加载首页的 js 文件，其他文件不应该加载。

所以我们需要将打包生成的文件进行代码分割，生成多个 js 文件，渲染哪个页面就只加载某个 js 文件，这样加载的资源就少，速度就更快。

代码分割（Code Split）主要做了两件事：

分割文件：将打包生成的文件进行分割，生成多个 js 文件。
按需加载：需要哪个文件就加载哪个文件。
总结：配置了几个入口，至少输出几个 js 文件。

使用
文件目录：

根目录下新建两个文件夹src和public，src下新建两个js文件，public下新建一个html文件，根目录下新建webpack.config.js配置文件；
npm init -y 初始化包配置文件，注意文件路径如果有中文可能会报错；

安装包：

npm i webpack webpack-cli html-webpack-plugin -D
webpack 基础配置

// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 单入口
  // entry: './src/main.js',
  // 多入口
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    // [name]是webpack命名规则，使用chunk的name作为输出的文件名。
    // 什么是chunk？打包的资源就是chunk，输出出去叫bundle。
    // chunk的name是啥呢？ 比如： entry中xxx: "./src/xxx.js", name就是xxx。注意是前面的xxx，和文件名无关。
    // 为什么需要这样命名呢？如果还是之前写法main.js，那么打包生成两个js文件都会叫做main.js会发生覆盖。(实际上会直接报错的)
    filename: "js/[name].js",
    clear: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  mode: "production",
};
运行指令 npx webpack 打包；

提取重复代码，打包
如果多入口文件中都引用了同一份代码，我们不希望这份代码被打包到两个文件中，导致代码重复，体积更大。

我们需要提取多入口的重复代码，只打包生成一个 js 文件，其他文件引用它就好。

修改配置文件
多入口，有几个入口就一定会有几个及以上的文件输出，至于会不会有多个以上文件的输出，需在optimization中配置splitChunks；
# webpack.config.js

module.exports = {
	optimization: {
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
      // 修改配置
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（越大越高）
        //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        default: {
          // 其他没有写的配置会使用上面的默认值
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
}
按需加载文件
某些模块并不需要页面加载时就渲染的，而是执行了某个动作后自动触发的，比如，点击一个按钮触发的事件，可以将其封装一个单独文件里，只有点击按钮后才会加载该文件，并完成相应的功能；
优化首屏渲染速度；
使用：
按需加载语法：

import('文件路径').then(res => { // res中可以拿到这个文件导出的内容}).catch(err => { // 文件加载失败})
注意：import 函数返回一个 promise ；

import 动态导入，会将动态导入的文件代码分隔（打包时拆分成单独的文件），在需要使用时自动加载该文件，并执行相应功能；

注意：import 函数的语法不能被 eslint 所识别，会报错，因此需要在 eslint 的配置文件 .eslintrc.js 文件中增加额外配置；

# .eslintrc.js 文件中

module.exports = {
	// 插件
	plugins: ["import"], // 解决动态导入语法eslint报错；
}
场景
路由的动态导入用的也是 import 函数，也会将代码进行分隔，打包成单独文件，从而实现路由的按需加载；
对于在首屏加载时不需要的代码逻辑，可以打包在一个文件内，页面刚加载时不会立即去获取该资源，只有触发某条件时再去请求该资源；
给按需加载的文件取名字（动态导入）
通过 import 函数按需加载的文件，在打包之后生成的文件的文件名默认是随机的，因此不好分辨；可以使用webpack的魔法命名来给每一个按需加载的文件命名；
使用
在使用 import 函数进行按需加载文件时，使用webpack的魔法命名来给文件命名；

// 给按需加载的after_load.js文件命名为after_load
// webpackChunkName: "after_load"：这是webpack动态导入模块命名的方式
// "after_load"将来就会作为下面chunkFilename的属性值[name]的值显示。
import(/* webpackChunkName: "after_load" */ "./js/after_load.js").then(({ mul }) => {
    console.log(mul(2, 1));
});
chunkFilename给打包生成的非入口文件命名（包括动态导入输出的文件的命名）

# webpack.config.js 文件内
module.exports = {
  output: {
    path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
    filename: "static/js/[name].js", // 入口文件打包输出资源命名方式
    // chunkFilename给打包生成的非入口文件命名（包括动态导入输出的文件的命名）
    // [name] 取值为按需加载时 webpackChunkName 设置的值
    chunkFilename: "static/js/[name].chunk.js", // 动态导入输出资源命名方式
    // 省略其他属性配置
  },
}
统一处理输出资源的文件名
对于 通过 type: asset 处理的资源可以统一设置输出文件名，不需要每个都配置 generator 属性；

# webpack.config.js 文件内
module.exports = {
  output: {
    // 通过 type: asset 处理的资源的统一命名方式（例如 图片、字体，这里配置之后可以删掉单独的配置generator属性）
    assetModuleFilename: "static/media/[name].[hash:6][ext][query]",
    // 省略其他属性配置
  },
}
Preload / Prefetch 预先加载后续需要使用的资源
背景
我们前面已经做了代码分割，同时会使用 import 动态导入语法来进行代码按需加载（我们也叫懒加载，比如路由懒加载就是这样实现的）。

但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。

我们想在浏览器空闲时间，加载 后续需要使用的资源。我们就需要用上 Preload 或 Prefetch 技术。

简介
Preload：告诉浏览器立即加载 后续需要使用的资源。使用时需要设置as属性浏览器加载该文件的优先级。
Prefetch：告诉浏览器在空闲时才开始加载 后续需要使用的资源。
它们共同点：

都只会加载后续需要使用的资源，并不执行。
都有缓存。当后续触发该资源加载时直接加载缓存。
它们区别：

Preload加载优先级高，Prefetch加载优先级低。
Preload只能加载当前页面需要使用的资源，Prefetch可以加载当前页面资源，也可以加载下一个页面需要使用的资源。
总结：

当前页面优先级高的资源用 Preload 加载。
下一个页面需要使用的资源用 Prefetch 加载。
它们的问题：兼容性较差。

我们可以去 Can I Use 网站查询 HTML和CSS的 API 的兼容性问题。
Preload 相对于 Prefetch 兼容性好一点。
使用
安装包

npm i @vue/preload-webpack-plugin -D
配置webpack文件

# webpack.config.js 文件内

const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
module.exports = {
  plugins: [
  	new PreloadWebpackPlugin({
      rel: "preload", // 把后续需要使用的js文件采用 preload 的方式加载，立即加载，需要设置as属性配置加载的优先级
      as: "script", // 把后续需要使用的js文件当做 script 标签的优先级来加载，其中 style 的优先级最高
      // rel: 'prefetch' // 把后续需要使用的js文件采用 prefetch 的方式加载，浏览器空闲时加载，不用设置as属性
    }),
  ]
}
Network Cache 缓存
背景：为什么文件名要加上hash值
将来开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。

但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。

所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了。

hash值知识补充：
每个单独打包生成的文件都会生成一个唯一的 hash 值。

fullhash（webpack4 是 hash）
每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

chunkhash
根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。

contenthash
根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。

在webpack的输出配置中可以见到hash的使用；

存在的问题以及解决方案
存在的问题
当我们修改 after_load.js 文件再重新打包的时候，因为 contenthash 原因，after_load.js 文件 hash 值发生了变化，导致输出的after_load文件名发生变化（这是正常的）。

但是 main.js 文件的 hash 值也发生了变化，这会导致 main.js 的缓存失效。明明我们只修改 after_load.js, 为什么 main.js 也会变身变化呢？

因为 main.js 文件中引用了 after_load.js 文件，所以 after_load 文件名变化时也间接导致了 main 文件的内容修改，hash改变，进而导致 main 的输出文件的文件名改变，导致 main.js 的缓存失效。

解决方案
将 hash 值单独保管在一个 runtime 文件中。

我们最终输出三个文件：main、after_load、runtime。当 after_load文件发送变化，变化的是 after_load和 runtime 文件，main 不变。

runtime 文件只保存文件的 hash 值和它们与文件关系，整个文件体积就比较小，所以变化重新请求的代价也小。

# webpack.config.js 文件内

module.exports = {
  output: {
  	path: path.resolve(__dirname, '../dist'), // 输出文件路径一般是绝对路径，所有打包后的文件都在这个路径下
    // [contenthash:8]使用contenthash（上面有介绍该hash属性），取8位长度
    filename: 'static/js/[name].[contenthash:8].js', // 入口文件输出打包后的文件名，其他文件打包后输出在其同级目录下
    // chunkFilename给打包生成的非入口文件命名（包括动态导入输出的文件的命名）
    // [name] 取值为按需加载时 webpackChunkName 设置的值
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
    // 通过 type: asset 处理的资源的统一命名方式（例如 图片、字体，这里配置之后可以删掉单独的配置generator属性）
    assetModuleFilename: "static/media/[name].[hash:6][ext][query]", // 图片、字体等资源命名方式（注意用hash）
    // 自动清空上次打包的内容
    clean: true,
  }
  optimization: {
  	// 提取runtime文件，会将文件之间依赖的hash值提取成单独的文件来保管；
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则，打包后生成的单独文件的文件名
    },
  }
}
最终实现的效果是
当缓存的资源发生变化时，希望浏览器加载新的资源；
当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响；
Core-js 彻底解决 js 兼容性问题
背景：
过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。

它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。

所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决。

core-js 是专门用来做 ES6 以及以上 API 的 polyfill。

polyfill翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。

使用
代码中增加 ES6+ 代码

# main.js 文件内

// 添加promise代码，测试Core-js 彻底解决 js 兼容性问题
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});
由于 eslint 不能识别 ES6+ 代码（例如 promise ），会报错，因此需要修改 eslint 配置

安装包

npm i @babel/eslint-parser -D
修改 eslint 的配置文件

# .eslintrc.js 文件内

module.exports = {
  parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
  // 其他属性省略
};
使用core-js

安装包

npm i core-js
方式一：手动全部引入

# main.js 文件内

import "core-js";
这样引入会将所有兼容性代码全部引入，体积太大了。我们只想引入 promise 的 polyfill。
方式二：手动按需引入

只引入 promise 的 polyfill ，解决 promise 语法的兼容性问题；

# main.js 文件内

import "core-js/es/promise";
只引入打包 promise 的 polyfill，打包体积更小。但是将来如果还想使用其他语法，我需要手动引入库很麻烦。

方式三：自动按需引入

需要借助 babel 实现自动按需引入

# babel.config.js 文件内

module.exports = {
  // 智能预设：能够编译ES6语法
  presets: [
    [
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],
  ],
};
PWA（渐进式网络应用程序）
背景
开发 Web App 项目，项目一旦处于网络离线情况，就没法访问了。

我们希望给项目提供离线体验。

渐进式网络应用程序(progressive web application - PWA)：是一种可以提供类似于 native app(原生应用程序) 体验的 Web App 的技术。

其中最重要的是，在 离线(offline) 时应用程序能够继续运行功能。

内部通过 Service Workers 技术实现的。

使用
安装包

npm i workbox-webpack-plugin -D
修改webpack配置文件

# webpack.config.js 文件内

// PWA（渐进式网络应用程序），实现离线(offline) 时应用程序能够继续运行功能
const WorkboxPlugin = require("workbox-webpack-plugin");
module.exports = {
  plugins: [
  	new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]
};
注册生成 service worker ，之后才能使用 PWA 技术

# main.js 文件中

// 由于 service worker 存在兼容性问题，因此做了判断
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
解决路径问题

此时如果直接通过 VSCode 访问打包后页面，在浏览器控制台会发现 SW registration failed。

因为我们打开的访问路径是：http://127.0.0.1:5500/dist/index.html。此时页面会去请求 service-worker.js 文件，请求路径是：http://127.0.0.1:5500/service-worker.js，这样找不到会 404。

实际 service-worker.js 文件路径是：http://127.0.0.1:5500/dist/service-worker.js。

安装包（用来部署静态资源服务器的）

npm i serve -g
serve 也是用来启动开发服务器来部署代码查看效果的。

运行指令，启动一个开发服务器，来部署 dist 文件夹下的所有资源

// dist 就是打包文件的文件夹目录
serve dist
此时通过 serve 启动的服务器我们 service-worker 就能注册成功了。

直接打开该服务运行后的链接即可访问页面

Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.43.5:3000   │
   │                                          │
   │   Copied local address to clipboard!  
查看缓存后的资源

以上操作后，会把资源全部缓存在 service-worker 中，可以在 浏览器=》Application =》 Service-Worker 中查看注册的文件情况；资源缓存的地址在 浏览器=》Application =》Cache Storage 里面；
React 脚手架
开发环境项目搭建
搭建步骤
目录框架
根目录创建 config 文件夹，内部创建 webpack.dev.js 开发环境配置文件，完成webpack基础配置；根目录创建 public/index.html 存放html模板；

### webpack.dev.js 文件内

const path = require("path");
// eslint 插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// html模板
const HtmlWebpackPlugin = require("html-webpack-plugin");

// loader 抽离出公共方法
const getStyleLoaders = (preProcessor) => {
  return [
    "style-loader", // css 样式经过 style-loader 的处理，已经具备 HMR 功能了，但是需要在webpack配置文件中开启hot
    "css-loader",
    {
      // 处理样式兼容性问题
      // 需要配合 package.json 文件内的 browserslist 来指定兼容哪些浏览器以及兼容哪些版本
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean); // 过滤数组中为空的项（preProcessor没传的项）
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined, // 配置了开发服务器，输出的文件都在内存中，没有真实的打包文件输出，因此路径不需要设置
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js", // 通过import函数动态导入的chunk输出文件命名
    assetModuleFilename: "static/media/[hash:6][ext][query]", // 图片、字体图片等资源输出文件命名
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            // 将符合条件的资源按照条件进行处理后在打包输出
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
          },
          {
            test: /\.(ttf|woff2?)$/,
            // 将资源原封不动的打包输出
            type: "asset/resource",
          },
          {
            test: /\.(jsx|js)$/,
            include: path.resolve(__dirname, "../src"), // 指定处理范围
            loader: "babel-loader",
            options: {
              // babel 缓存
              cacheDirectory: true,
              // 缓存内容不压缩
              cacheCompression: false,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // eslit
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"), // 处理那些文件
      exclude: "node_modules", // 指定处理范围
      cache: true, // 开启缓存
      // eslint 缓存存放目录
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    // 配置模板
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  optimization: {
    // 分包，代码分隔
    splitChunks: {
      chunks: "all",
    },
    // 解决代码分隔导致的缓存失效，当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },

  // 开发服务器，自动化配置
  devServer: {
    open: true, // 自动打开浏览器
    host: "localhost",
    port: 3001,
    hot: true, // 开启热模块替换
    compress: true,
  },

  mode: "development",
  // source-map，便于查找错误文件及位置，便于调试
  devtool: "cheap-module-source-map",
}
安装包
npm install babel-loader babel-preset-react-app @babel/core eslint-webpack-plugin eslint-config-react-app html-webpack-plugin css-loader sass sass-loader less-loader style-loader stylus-loader postcss-loader postcss-preset-env webpack webpack-cli webpack-dev-server -D
根目录创建 babel 配置文件 babel.config.js ，以及 eslint 配置文件 .eslintrc.js ；

babel 直接使用 react-app 官方的配置即可
### babel.config.js 文件内

module.exports = {
  // 使用react官方规则，可以在这个链接查看 react官方的babel配置有哪些
  // https://github.com/facebook/create-react-app/blob/main/packages/babel-preset-react-app/create.js
  presets: ["react-app"], // 预设
};
eslint 可以继承 react 官方的配置 react-app ；
### .eslintrc.js 文件内

module.exports = {
  extends: ["react-app"], // 继承 react 官方规则
  parserOptions: {
    babelOptions: {
      presets: [
        // 解决页面报错问题
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};
初始化包管理工具 npm init -y ；

安装 react ，书写 react 代码；

npm install react react-dom react-router-dom
执行 npx webpack serve ;

如果报错如下（一）：

react-环境变量报错

原因：babel-preset-react-app 这个babel的预设必须要有环境变量来指定当前环境是开发环境、生成环境还是测试环境；

webpack中配置的 mode: "development" 是代码运行的时候读取的环境变量，并不是babel配置运行的时候能够读取的环境变量；

解决方案：使用 cross-env 这个包来配置环境变量；

使用：

安装包

npm install --save-dev cross-env
使用环境变量只需要在启动 webpack 指令前加上 cross-env NODE_ENV=development 或者 cross-env NODE_ENV=production 即可；

# package.json 文件内

"scripts": {
    "start": "npm run dev",
    "dev": "cross-env NODE_ENV=development webpack serve --config ./config/webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.prod.js"
  },
执行 npm start ;

如果报错如下（二）：

react-模块后缀名识别错误报错

原因：如果文件后缀名为 .jsx 、 .vue 、 .json 等文件，会出现无法识别文件；

解决方案：完善 webpack 配置如下：

### webpack.dev.js 文件内

module.exports = {
	// webpack解析模块时加载的选项
    resolve: {
        // 模块引入时，不写后缀名时自动补全文件扩展名
        extensions: [".jsx", ".js", ".json"],
    },
}
执行 npm start ;

常用配置
HMR 模块热替换
首先需要在webpack配置文件中开启 hot ；如下：
### webpack.dev.js 文件内

module.exports = {
	// 开发服务器，自动化配置
  devServer: {
    hot: true, // 开启热模块替换
    // 其他属性省略
  },
}
css 模块热替换
css 样式经过 style-loader 的处理，已经具备 HMR 功能了；
js 模块热替换
react 的 js 模块热替换 借助第三方包 实现
安装包

npm install @pmmmwh/react-refresh-webpack-plugin react-refresh -D
webpack中配置

注意：需要在 babel 的 plugins 中设置这个插件；
### webpack.dev.js 文件内

// react js代码 热更新HMR
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
            	oneOf: [
            		{
                        test: /\.(jsx|js)$/,
                        include: path.resolve(__dirname, "../src"), // 指定处理范围
                        loader: "babel-loader",
                        options: {
                          // babel 缓存
                          cacheDirectory: true,
                          // 缓存内容不压缩
                          cacheCompression: false,
                          plugins: [
                            "react-refresh/babel", // react开启js的HMR功能（@pmmmwh/react-refresh-webpack-plugin 这个插件的babel配置）
                          ],
                        },
                    },
            	],
            },
        ],
    },
	plugins: [
		// react js代码 热更新HMR（解决js的HMR功能运行时全局变量的问题）
    	new ReactRefreshWebpackPlugin(),
	]
}
React 前端路由
使用
安装包

npm install react-router-dom
从 react-router-dom 中引入 BrowserRouter 组件

前端路由必须包裹在 BrowserRouter 标签下才能被解析，BrowserRouter内部会封装context语法做一些路由参数的通信等；
### main.js 文件内

import React from 'react';
import ReactDOM from 'react-dom/client';
// 前端路由必须包裹在 BrowserRouter 标签下才能被解析，BrowserRouter内部会封装context语法做一些路由参数的通信等；
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 生成root根节点
const root = ReactDOM.createRoot(document.getElementById('app'));
// 渲染App组件
root.render(<BrowserRouter>
  <App />
</BrowserRouter>);
从 react-router-dom 中引入 Routes、Route 组件

引入路由链接导航Link组件来进行路由跳转；引入Routes、Route用于加载显示路由组件。
### App.jsx 文件内

import React from 'react';
// 引入路由链接导航Link组件来进行路由跳转
// 引入Routes、Route用于加载显示路由组件
import { Link, Routes, Route } from 'react-router-dom'

import Home from './pages/home';
import About from './pages/about';

function App() {
  return (
    <div>
      <h1>App</h1>
      {/* 导航链接 */}
      <ul>
        <li>
          <Link to="/home">home</Link>
        </li>
        <li>
          <Link to="/about">about</Link>
        </li>
      </ul>

      <Routes>
        {/* 每一个Route就是一个路由组件，需要指定路由路径path 以及 要加载的路由组件element */}
        <Route path='/home' element={ <Home /> }></Route>
        <Route path='/about' element={ <About /> }></Route>
      </Routes>
    </div>
  )
}

export default App;
执行 npm start 运行代码；

刷新页面发现路由找不到；解决方案：修改webpack配置

module.exports = {
    // 开发服务器，自动化配置
    devServer: {
        historyApiFallback: true, // 解决react-router刷新404问题
        // 其他配置省略
    },
}
扩展
如果希望路由组件单独打包，可以借助路由懒加载实现；需要对组件的引入做处理
生产环境项目搭建
生产环境与开发环境webpack配置的不同点：
输出
生产环境需要配置输出文件路径

输出的文件名最好携带 contenthash 值，便于缓存；（contenthash 文件内容改变时，该值会改变，导致文件名改变，缓存更新）

自定清空上次打包内容

### webpack.prod.js 文件内

module.exports = {
	output: {
      path: path.resolve(__dirname, '../dist'),
      filename: "static/js/[name].[contenthash:10].js",
      chunkFilename: "static/js/[name].[contenthash:10].chunk.js", // 通过import函数动态导入的chunk输出文件命名
      assetModuleFilename: "static/media/[hash:6][ext][query]", // 图片、字体图片等资源输出文件命名
      clean: true, // 自动清空上次打包的内容
    },
}
module（loader）
提取样式为单独文件

# 安装包
npm install mini-css-extract-plugin -D
将所有的 style-loader 替换为 MiniCssExtractPlugin.loader

插件中配置该包的配置

### webpack.prod.js 文件内

// 提取css成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// loader 抽离出公共方法
const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader, // css 样式经过 style-loader 的处理，已经具备 HMR 功能了，但是需要在webpack配置文件中开启hot
        "css-loader",
        {
            // 处理样式兼容性问题
            // 需要配合 package.json 文件内的 browserslist 来指定兼容哪些浏览器以及兼容哪些版本
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                    	"postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
        	},
        },
        preProcessor,
    ].filter(Boolean); // 过滤数组中为空的项（preProcessor没传的项）
};
module.exports = {
	plugins: [
		// 提取css成单独文件
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:10].css",
          chunkFilename: "static/css/[name].[contenthash:10].css",
        }),
	]
}
对样式文件进行压缩、对js文件进行压缩；（html文件在生产环境下会自动压缩）

# 安装包
npm install css-minimizer-webpack-plugin -D

# terser-webpack-plugin 随着webpack的下载自动下载的
配置插件

### webpack.prod.js 文件内

// 对 css 文件进行压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
// 对 js 文件进行压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
module.exports = {
	optimization: {
        // 分包，代码分隔
        splitChunks: {
          chunks: "all",
        },
        // 解决代码分隔导致的缓存失效，当只有一个文件资源发生变化，希望只有这一个文件的缓存失效，其他文件的缓存不要受到影响
        runtimeChunk: {
          name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
        // 代码压缩(css、js)
        minimizer: [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()],
    },
}
修改mode 和 devtool

### webpack.prod.js 文件内

module.exports = {
    mode: "production",
    // source-map，便于查找错误文件及位置，便于调试
    devtool: "source-map",
}
删除 devServer 开发服务器的自动化配置；(删掉内容)

### webpack.prod.js 文件内

module.exports = {
    // 开发服务器，自动化配置
  devServer: {
    open: true, // 自动打开浏览器
    host: "localhost",
    port: 3001,
    hot: true, // 开启热模块替换
    compress: true,
    historyApiFallback: true, // 解决react-router刷新404问题
  },
}
删掉 HMR 相关的代码（生产模式不需要HMR模块热替换功能）

从 @pmmmwh/react-refresh-webpack-plugin 包中引入的 ReactRefreshWebpackPlugin
插件中的 new ReactRefreshWebpackPlugin()
babel-loader 中的 plugins: ["react-refresh/babel"]
### webpack.prod.js 文件内

module.exports = {
    plugins: [
        // react js代码 热更新HMR（解决js的HMR功能运行时全局变量的问题）
        new ReactRefreshWebpackPlugin(),
    ]
}
对图片进行压缩（依赖比较难下载）

# 安装包
npm i image-minimizer-webpack-plugin imagemin -D
# 无损压缩
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
# 有损压缩
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
webpack配置

### webpack.prod.js 文件内

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
module.exports = {
    optimization: {
    // 压缩的操作
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  }
}
配置运行指令

# package.json 文件内

"scripts": {
    "start": "npm run dev",
    "dev": "cross-env NODE_ENV=development webpack serve --config ./config/webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.prod.js"
},
页面tab栏加个图标

将图标文件 favicon.ico 放置在 public 目录下

在 public 文件下的 index.html 文件中引入该图标

# index.html 文件内

<!-- 引入页面图标 -->
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
修改webpack配置，将 public 文件下的所有资源（非 index.html ）在打包时默认拷贝到 dist 文件下

### 安装包
npm install copy-webpack-plugin --save-dev
修改webpack配置文件

### webpack.prod.js 文件内

// 拷贝public文件下的静态资源到dist目录下（index.html文件除外）
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        // 将public下面的资源复制到dist目录去（除了index.html）
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, "../public"),
              to: path.resolve(__dirname, "../dist"),
              toType: "dir",
              noErrorOnMissing: true, // 不生成错误
              globOptions: {
                // 忽略index.html文件
                ignore: ["**/index.html"],
              },
              info: {
                // 跳过terser压缩js
                minimized: true,
              },
            },
          ],
        }),
    ]
}
通过 npm run build 打包后访问 index.html 文件 或者 serve dist 访问页面
