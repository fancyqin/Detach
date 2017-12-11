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

### CompileByUri(data,page,config)
```
//默认同步
try {
    console.log(micenRender.compileByUri(data,'/page/productList',{defaultEngine:'ejs',async:true}));
    console.log(micenRender.compileByUri(data,'/page/detail.jst'));
}catch (e){
    console.error(e);
}

//异步写法
micenRender.compileByUri(data,'/page/home',{async:true}).then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});

```


### Callback
```
//模板引擎编译前
micenRender.beforeRender = function(type,str,data){
    console.log('beforeRender : '+ type,str,data)
};

//编译完毕return htmlString之前
micenRender.afterRender = function(htmlString){
    console.log('afterRender : '+ htmlString)
};

```