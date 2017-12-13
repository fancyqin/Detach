## use

### require

```
const NViewRender = require('nview-render');
```
### Create Instance

```
//实例默认配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);

```

### CompileByUri(data,page,[config])

#### Params

`data` : `{JSON}` || `{String}`     `String`可以`parse`为`JSON`

`page` : `{path}[.{extname}]`

路径拼合： `config.path` +`page` + `'.'` + `[config.defaultEngine]`  
或者      `config.path` + `page`
    
`config` : `{Object}`

默认配置：
```
{
  "charset":"utf-8",      //编码
  "defaultEngine":"ejs",  //默认引擎扩展名
  "ext":{                 //扩展名对应模板方法目前有"ejs、dot、pug、art、handlebars" 五种引擎 
    "html":"ejs", 
    "ejs":"ejs",
    "dot":"dot",
    "jst":"dot",
    "pug":"pug",
    "jade":"pug",
    "art":"art",
    "handlebars":"handlebars"
  },
  "application":"vo",     //暂不用
  "version":"1.0.0",      //暂不用
  "path":"view"           //view文件根目录   
}


```
    
#### Return

`{Promise}` reslove(data)

data `{String}` HTML


#### Use

```
//默认异步
micenRender.compileByUri(data,'/page/home').then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});

```

### compileByUriSync(data,page,[config])

#### Params

同上

#### Return

`{String}` HTML

#### Use

```
//同步写法
try {
    console.log(micenRender.compileByUriSync(data,'/page/productList',{defaultEngine:'ejs'}));
    console.log(micenRender.compileByUriSync(data,'/page/detail.jst'));
}catch (e){
    console.error(e);
}

```

### Callback
```
//模板引擎编译前
micenRender.beforeEngineCompile = function(type,str,data){
    data.total_count = 123456789;
    return {type,str,data}
};
```

```
//编译完毕return htmlString之前
micenRender.afterRender = function(htmlString){
    return htmlString + 'hahhahahah';
};

```


### catch error

`NViewRenderError{Object}`

`{code,msg,[e]}`

code对应msg:

- 100: Page should be a String
- 200: Path Error,Cannot find file
- 300: Data error, It\'s not a JSON or Cannot be parsed to JSON
- 400: Config error, Should be a Object
- 500: Compile Error