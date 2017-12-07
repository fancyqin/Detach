const fs = require('fs');
const NViewRender = require('./NViewRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);


//example

//异步写法
micenRender.compileByUri(data,'/page/home',{async:true}).then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});

micenRender.compileByUri(data,'/page/productList',{defaultEngine:'ejs',async:true}).then(result => {
    console.log(result)
}).catch(e => {
    console.error(e)
});


//默认同步
try {
    console.log(micenRender.compileByUri({},'/page/productList.ejs'));
}catch (e){
    console.error(e);
}


//let ee = new NViewRender();
//
//let d = '{"module":"home","springVersion":"5.0.0.RELEASE","username":"test"}';
//
//console.log(ee.compileByUri(d,'/detail.jst'));









