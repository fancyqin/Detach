const fs = require('fs');
const NViewRender = require('./NViewRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);


//example

//默认异步
micenRender.compileByUri(data,'/page/home').then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});

micenRender.compileByUri(data,'/page/productList',{defaultEngine:'ejs'}).then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});


//同步写法
try {
    console.log(micenRender.compileByUri(data,'/page/detail.jst',{async:false}));
}catch (e){
    console.error(e);
}










