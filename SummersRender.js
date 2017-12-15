const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const art = require('art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');
const handlebars = require('handlebars');

/****
error Code table
    100: Page error, Should be a String
    404: Path Error,Cannot find file
    300: Data error, It\'s not a JSON or Cannot be parsed to JSON
    400: Config error, Should be a Object
    500: Compile Error
*****/

const defaults =  require('./SummersRenderConfig.js');

class SummersRenderError {
    constructor(code,msg,e){
        this.code = code;
        this.msg = msg;
        if(e){
            this.e = e
        }
    }
}


class SummersRender {
    _isObject(data){
        return Object.prototype.toString.call(data).toLowerCase() === '[object object]'
    }
    constructor(config){
        this.config =  _.defaults(config,defaults);
    }
    compileByType(tplType,str,data){
        const compileParams = {tplType,str,data};
        const compileObj = _.defaults(this.beforeEngineCompile(tplType,str,data),compileParams);
        tplType = compileObj.tplType;
        str = compileObj.str;
        data = compileObj.data;
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
                htmlString = art.render(str,data);
                break;
            case 'handlebars':
                let template = handlebars.compile(str);
                htmlString = template(data);
                break;
            default:
                htmlString = ejs.render(str,data);
                break;
        }
        htmlString = this.afterEngineCompile(htmlString);
        return htmlString;
    }
    _getFileUri(page,compileConfig){
        if(typeof page !== 'string' ){
            throw new SummersRenderError(100,'Page should be a String');
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
            throw new SummersRenderError(404,'Path Error,Cannot find file : ' + fileURI,e);
        }
    }
    _getEngineType(fileURI,compileConfig){
        const extName = path.extname(fileURI);
        return compileConfig.ext[extName.split('.')[1].toLowerCase()] || compileConfig.defaultEngine;
    }
    _getDataModel(data){
        try{
            return this._isObject(data) ? data : JSON.parse(data);
        }catch (e){
            throw new SummersRenderError(300,'Data error, It\'s not a JSON or Cannot be parsed to JSON',e);
        }
    }
    compileByUri(data,page,config){
        return new Promise((resolve, reject) =>{
            try{
                resolve(this.compileByUriSync(data,page,config))
            }catch(e){
                reject(e);
            }
        });
    }
    compileByUriSync(data,page,config){
        if(config && !this._isObject(config)){
            throw new SummersRenderError(400,'Config error, Should be a Object')
        }
        const compileConfig = config? _.defaults(config,this.config):this.config;
        const fileURI  = this._getFileUri(page,compileConfig);
        const str = this._getFileStr(fileURI);
        const type = this._getEngineType(fileURI,compileConfig);
        const dataModel = this._getDataModel(data);
        try{
            return this.compileByType(type,str,dataModel);
        }catch (e){
            throw new SummersRenderError(500,'Compile Error',e)
        }
    }


    //callBack
    beforeEngineCompile(tplType,str,data){
        return {tplType,str,data}
    }
    afterEngineCompile(htmlString){
        return htmlString;
    }

}


module.exports = SummersRender;
