const fs = require('fs');
const path = require('path');

const art = require('express-art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');

const NViewEngine = {
    config:{
        charset:'utf-8',
        defaultEngine:'ejs',
        ext:{
            html:'ejs',
            ejs:'ejs',
            dot:'dot',
            jst:'dot',
            pug:'pug',
            jade:'pug',
            art:'art'
        }
    },
    compile(tplType,str,data){
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
            default:
                htmlString = ejs.render(str,data);
                break;
        }
        return htmlString;
    },
    getFileStr(fileURI){
        try{
            return fs.readFileSync(fileURI, this.config.charset);
        }catch(e) {
            return '路径error，找不到文件'
        }
    },
    getFileExtName(fileURI){
        try {
            return path.extname(fileURI).split('.')[1]
        }catch (e){
            return '路径error，文件扩展名错误'
        }
    },
    compileByUri(fileURI,data){
        const extName = this.getFileExtName(fileURI);
        const type = this.config.ext[extName.toLowerCase()] || this.config.defaultEngine ;
        const str  = this.getFileStr(fileURI);
        return this.compile(type,str,data);
    }

};

module.exports = NViewEngine;
