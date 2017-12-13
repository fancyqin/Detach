const fs = require('fs');
const NViewRender = require('./NViewRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);

micenRender.beforeEngineCompile = function(type,str,data){
    data.total_count = 123456789;

    return {type,str,data}
};
micenRender.afterEngineCompile = function(htmlString){
    return htmlString + 'hahhahahah';
};
//example





//异步
micenRender.compileByUri(data,'/page/home').then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});



//同步
try {
    console.log(micenRender.compileByUriSync(data,'/page/productList',{defaultEngine:'ejs'}));
    console.log(micenRender.compileByUriSync(data,'/page/detail.jst'));
}catch (e){
    console.error(e);
}