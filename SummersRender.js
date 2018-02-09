const fs = require('fs');
const path = require('path');
// const _ = require('lodash');


const art = require('art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');
const handlebars = require('handlebars');

const logger = require('./module/logger.js');
// const cache = require('./module/cache.js');
// const promiseRace = require('./module/promiseRace.js');

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
        logger.error(code,msg,e);
    }
}


class SummersRender {
    _isObject(data){
        return Object.prototype.toString.call(data).toLowerCase() === '[object object]'
    }
    constructor(config){
        this.config =  Object.assign(defaults,config);
    }
    compileByType(tplType,str,data,configs){
        const compileParams = {tplType,str,data};
        const compileObj = Object.assign(compileParams,this.beforeEngineCompile(tplType,str,data));
        tplType = compileObj.tplType;
        str = compileObj.str;
        data = compileObj.data;
        let htmlString;
        if(!tplType||!str||!data){
            return ''
        }
        switch (tplType.toLowerCase()){
            case 'ejs':
                let ejsOptions = configs['ejs_options'];
                htmlString = ejs.render(str,data,ejsOptions);
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
                let options = configs['ejs_options'];
                htmlString = ejs.render(str,data,options);
                break;
        }
        htmlString = this.afterEngineCompile(htmlString);
        return htmlString;
    }
    _getFileUri(page,compileConfig){
        if(typeof page !== 'string' ){
            page = page.toString();
            logger.error(page,'Page parameter error, must be a String');
            // throw new SummersRenderError(100,'Page should be a String');
        }
        const extName = path.extname(path.join(compileConfig.path,page));
        let fileURI;

        if(extName === ''){
            fileURI = path.join(compileConfig.path,page +'.'+ compileConfig.defaultEngine);
        }else if(extName === '.'){
            fileURI = path.join(compileConfig.path,page + compileConfig.defaultEngine);
        }else{
            fileURI = path.join(compileConfig.path,page)
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
            // throw new SummersRenderError(300,'Data error, It\'s not a JSON or Cannot be parsed to JSON',e);
            logger.error(data,'Data parameter error, It is not a JSON or Cannot be parsed to JSON');
            return {}
        }
    }
    compileByUri(data,page,config){
        // let beginTime = new Date();
        
        // const cachePromise = new Promise((resolve,reject) =>{
        //     try{
        //         const compileConfig = config? _.defaults(config,this.config):this.config;
        //         const fileURI  = this._getFileUri(page,compileConfig);
        //         const result = cache.getCache(data,fileURI);
        //         console.log(page, 'cache cost: ',new Date() - beginTime,'ms')
        //         resolve(result);               
        //     }catch(e){
        //         reject(e)
        //     }
        // })
        const compilePromsie = new Promise((resolve, reject) =>{
            try{
                const result = this.compileByUriSync(data,page,config);
                // console.log(page, 'compile cost: ',new Date() - beginTime,'ms')
                resolve(result);  
            }catch(e){
                reject(e);
            }
        })
        
        // return promiseRace([cachePromise,compilePromsie]);
        return compilePromsie;
    }
    compileByUriSync(data,page,config){
        if(config && !this._isObject(config)){
            // throw new SummersRenderError(400,'Config error, Should be a Object')
            logger.error(config,'Config parameter error, Should be a Object');
            config = null
        }
        const compileConfig = config? Object.assign(this.config,config):this.config;
        const fileURI  = this._getFileUri(page,compileConfig);
        const str = this._getFileStr(fileURI);
        const type = this._getEngineType(fileURI,compileConfig);
        const dataModel = this._getDataModel(data);
        try{
            const resultString = this.compileByType(type,str,dataModel,compileConfig);
            logger.info('Compile Success!',fileURI,'by',type);
            // cache.setCache(data,fileURI,resultString);
            return resultString;
        }catch (e){
            return new SummersRenderError(500,'Compile Error',e)
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
