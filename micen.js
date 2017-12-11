const fs = require('fs');
const NViewRender = require('./NViewRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);

micenRender.beforeRender = function(type,str,data){
    console.log('beforeRender : '+ type,str)
};
micenRender.afterRender = function(htmlString){
    console.log('afterRender : '+ htmlString)
};
//example




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


