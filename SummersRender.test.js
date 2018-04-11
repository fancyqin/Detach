const SummersRender = require('./SummersRender.js');
const expect = require('chai').expect;


describe('参数返回值测试',function(){
    
    const render = new SummersRender();
    it('参数空',function(){
        render.compileByUri().then(result => {
            expect(result).to.be.a('string');
        }).catch(e => {
            // expect(e).to.be.a('string');
        })
    });

    it('参数一个string',function(){
        render.compileByUri('aa').then(result => {
            expect(result).to.be.a('string');
        }).catch(e => {
            // expect(e).to.be.a('string');
        })
    });

    it('参数一个num',function(){
        render.compileByUri(12).then(result => {
            expect(result).to.be.a('string');
        }).catch(e => {
            // expect(e).to.be.a('string');
        })
    });
    it('参数一个obj',function(){
        render.compileByUri({a:1}).then(result => {
            expect(result).to.be.a('string');
        }).catch(e => {
            // expect(e).to.be.a('string');
        })
    });

    it('参数null',function(){
        render.compileByUri(null).then(result => {
            expect(result).to.be.a('string');
        }).catch(e => {
            // expect(e).to.be.a('string');
        })
    });

});


describe('配置项正确测试',function(){

    const render = new SummersRender({defaultEngine:'pug',path:'F:\\summers-render/static/view'});
    
    it('无数据',function(){
        render.compileByUri({},'/page/home').then(result =>{
            expect(result).to.be.a('string');
        }).catch(e =>{
            expect(e).to.be.a('string');
        })
    })

})

