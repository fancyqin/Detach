const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const art = require('express-art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');
const handlebars = require('handlebars');

const defaults = {
    charset:'utf-8',
    defaultEngine:'ejs',
    ext:{
        html:'ejs',
        ejs:'ejs',
        dot:'dot',
        jst:'dot',
        pug:'pug',
        jade:'pug',
        art:'art',
        'handlebars':'handlebars'
    },
    application:'vo',
    path:'/vo/view'
};

class NViewEngine {
    constructor(config){
        this.config =  _.defaults(config,defaults);
        this.config.path = 'wrwr'

    }
    compileByType(tplType,str,data){
        let htmlString;
        if(!tplType||!str||!data){
            return false
        }
        switch (tplType.toLowerCase()){
            case 'ejs':
                htmlString = ejs.render(str,data);
                break;
            case 'dot':
                let render = dot.template(str);
                htmlString = render(data);
                break;
            case 'pug':
                htmlString = pug.render(str,data);
                break;
            case 'art':
                htmlString = art.template.render(str,data);
                break;
            case 'handlebars':
                let template = handlebars.compile(str);
                htmlString = template(data);
                break;
            default:
                htmlString = ejs.render(str,data);
                break;
        }
        return htmlString;
    }
    getFileStr(fileURI){
        try{
            return fs.readFileSync(fileURI, this.config.charset);
        }catch(e) {
            return '路径error，找不到文件'
        }
    }

    getFileExtName(fileURI){
        try {
            return path.extname(fileURI).split('.')[1]
        }catch (e){
            return '路径error，文件扩展名错误'
        }
    }
    compileByUri(data,fileURI,config){
        const compileConfig = config ? _.defaults(config,this.cofing):this.config;

        const extName = path.extname(fileURI);

        if(extName === ''){
            fileURI = fileURI +'.'+ compileConfig.defaultEngine;
        }else if(extName === '.'){
            fileURI = fileURI + compileConfig.defaultEngine;
        }



        const str  = this.getFileStr(fileURI);

        const type = this.config.ext[extName.toLowerCase()] || this.config.defaultEngine ;
        try {
            return this.compileByType(type,str,data);
        }catch (e){
            return '模板渲染错误'
        }

    }

    getfilePath(name){
        return this.config.path +'/'+name
    }
    complleByName(name,data){

    }

}



module.exports = NViewEngine;
