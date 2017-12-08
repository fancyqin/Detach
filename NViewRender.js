const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const art = require('express-art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');
const handlebars = require('handlebars');

/****
error Code table
    100: Page should be a String
    200: Path Error,Cannot find file
    300: Data error, It\'s not a JSON or Cannot be parsed to JSON
    400: Compile Error
*****/

const defaults =  JSON.parse(fs.readFileSync(__dirname+'/nviewRenderConfig.json'));

class NVError {
    constructor(code,msg,e){
        this.code = code;
        this.msg = msg;
        if(e){
            this.e = e
        }
    }
}


class NViewRender {
    constructor(config){
        this.config =  _.defaults(config,defaults);
    }
    compileByType(tplType,str,data){
        this.beforeRender(tplType,str,data);
        let htmlString;
        if(!tplType||!str||!data){
            return ''
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
        this.afterRender(htmlString);
        return htmlString;
    }
    _getFileUri(page,compileConfig){
        if(typeof page !== 'string' ){
            throw new NVError(100,'Page should be a String');
        }
        const extName = path.extname(compileConfig.path + page);
        let fileURI;

        if(extName === ''){
            fileURI = compileConfig.path+ page +'.'+ compileConfig.defaultEngine;
        }else if(extName === '.'){
            fileURI = compileConfig.path+ page + compileConfig.defaultEngine;
        }else{
            fileURI = compileConfig.path+ page
        }
        return fileURI;
    }
    _getFileStr(fileURI){
        try{
            return fs.readFileSync(fileURI, this.config.charset);
        }catch(e) {
            throw new NVError(200,'Path Error,Cannot find file : ' + fileURI,e);
        }
    }
    _getEngineType(fileURI,compileConfig){
        const extName = path.extname(fileURI);
        return compileConfig.ext[extName.split('.')[1].toLowerCase()] || compileConfig.defaultEngine;
    }
    _getDataModel(data){
        try{
            return Object.prototype.toString.call(data) === '[object Object]' ? data : JSON.parse(data);
        }catch (e){
            throw new NVError(300,'Data error, It\'s not a JSON or Cannot be parsed to JSON',e);
        }
    }
    compileByUri(data,page,config){
        const compileConfig = config ? _.defaults(config,this.config):this.config;
        const fileURI  = this._getFileUri(page,compileConfig);
        let str,type,dataModel;
        const setParam = () =>{
            str = this._getFileStr(fileURI);
            type = this._getEngineType(fileURI,compileConfig);
            dataModel = this._getDataModel(data);
        };
        if(compileConfig.async){
            return new Promise((resolve, reject) =>{
                try{
                    setParam();
                    resolve(this.compileByType(type,str,dataModel));
                }catch(e){
                    reject(e);
                }
            })
        }else{
            setParam();
            try{
                return this.compileByType(type,str,dataModel);
            }catch (e){
                throw new NVError(400,'Compile Error',e)
            }
        }

    }

    //callBack
    beforeRender(tplType,str,data){}
    afterRender(htmlString){}

}

//todo beforeRender/afterRender callback

module.exports = NViewRender;
