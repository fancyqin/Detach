const fs = require('fs');
const NViewRender = require('./NViewRender.js');

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

//micen配置
const micenRenderConfig = JSON.parse(fs.readFileSync(__dirname+'/static/view/nview.json'));

const micenRender = new NViewRender(micenRenderConfig);

const test = (page,config) => {


    micenRender.compileByUri(data,page,config).then(data => {
        console.log(data)
    }).catch(e => {
        console.error(e)
    })
    // try{
    //     console.log(micenRender.compileByUri(data,page,config));
    // }catch (e){
    //     console.error(e);
    // }
};

micenRender.compileByUri(data,'/page/home.jd').then(data => {
    console.log(data)
}).catch(e => {
    console.error(e)
})


test('/page/home.jd');

test('/page/productList',{defaultEngine:'ejs'});

test('/page/detail.jst');









