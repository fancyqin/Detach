const fs = require('fs');
const SummersRender = require('./SummersRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = {defaultEngine:'pug',path:'F:\\summers-render/static/view'};

const micenRender = new SummersRender(micenRenderConfig);

// micenRender.beforeEngineCompile = function(type,str,data){
//     data.total_count = 111111;

// };
// micenRender.afterEngineCompile = function(htmlString){
//     return htmlString + 'hahhahahah';
// };
//example





//异步
// micenRender.compileByUri(data,'/page/home').then(result => {
//     console.log('home: ',result)
// }).catch(e => {
//     console.error(e)
// });

// micenRender.compileByUri(data,'/page/productList',{defaultEngine:'ejs'}).then(result => {
//     console.log('list: ',result)
// }).catch(e => {
//     console.error(e)
// });

// micenRender.compileByUri(data,'/page/detail.jst').then(result => {
//     console.log('detail: '+result)
// }).catch(e => {
//     console.error(e)
// });


micenRender.compileByUri(data,'/page/setting',{defaultEngine:'vm'}).then(result => {
    console.log('setting: '+result)
}).catch(e => {
    console.error(e)
});

//同步
// try {
//     console.log(micenRender.compileByUriSync(data,'/page/productList',{defaultEngine:'ejs'}));
//     console.log(micenRender.compileByUriSync(data,'/page/detail.jst'));
// }catch (e){
//     // console.error(e);
// }