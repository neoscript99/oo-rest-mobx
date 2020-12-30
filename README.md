## 本地开发依赖

```shell script
yarn build
npm link
```

### 方案 1：npm link
`npm link`用来把最新代码发布到本地，其它工程可以通过`npm link oo-rest-mobx`进行最新代码依赖，这样修改后不用每次发布新版本


### 方案 2：依赖oo-rest-mobx的ts源码
1. 复制源码到`res-web/src/oo-rest-mobx-src`
2. 按照[react-app-rewire-alias](https://github.com/oklas/react-app-rewire-alias)步骤，配置typescript别名
	```
	{
		"compilerOptions": {
			"baseUrl": "./",
			"paths": {
			"oo-rest-mobx": [
				"src/oo-rest-mobx-src/index.ts"
			]
			}
		}
	}
	```
	> 如果配置src之外的目录，如`../../matrix-admin/oo-rest-mobx/src/index.ts`，ide可以识别并跳转，但编译有问题（[react-app-rewire-alias的demo](https://github.com/oklas/react-app-rewire-alias/blob/master/example/main/tsconfig.paths.json)是可以的，原因未知）
	```
	D:/git_repo/my-project/matrix-admin/oo-rest-mobx/src/ant-design-field/DatePickerField.tsx 12:0
	Module parse failed: The keyword 'interface' is reserved (12:0)
	File was processed with these loaders:
	* ./node_modules/@pmmmwh/react-refresh-webpack-plugin/loader/index.js
	You may need an additional loader to handle the result of these loaders.
	| import isString from 'lodash/isString';
	| import { DatePickerProps } from 'antd/lib/date-picker';
	> interface P extends FieldProps {
	|   //DatePicker的required可能根据返回值不同而变化
	|   required?: boolean;
	```
1. 使用unison命令行做双向同步，也可以使用[微软SyncToy](https://www.microsoft.com/en-us/download/details.aspx?id=15155)，或[inotify+unison](https://blog.csdn.net/qq_41961459/article/details/104658868)进行自动监控同步
	```
	unison ~/git_repo/my-project/yzedu-research/res-web/src/node_modules/oo-rest-mobx ~/git_repo/my-project/matrix-admin/oo-rest-mobx/src -batch -prefer newer
	```
### 方案 3：本地依赖lib目录
同**方案 2**
1. 别名链接改为`"oo-rest-mobx": ["../../matrix-admin/oo-rest-mobx/lib/index.d.ts"]`
1. 不需要同步动作
### 方案 4：mklink、New-Item、ln创建软链接到源码src/node_modules目录
> 但目前本方案都无法编译，硬链接只支持文件
```shell script
mklink /h oo-rest-mobx "D:\git_repo\my-project\matrix-admin\oo-rest-mobx\src"
New-Item -ItemType SymbolicLink -Path oo-rest-mobx -Target "D:\git_repo\my-project\matrix-admin\oo-rest-mobx\src"
```
