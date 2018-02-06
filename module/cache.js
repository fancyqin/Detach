const md5 = require('blueimp-md5');
const fs = require('fs');
const path = require('path');



const renderCache = {
    _delCacheItem(){

    },
    _getMdKey(data){
        const dataStr = JSON.stringify(data);
        return 'md_' + md5(dataStr);
    },
    _getCacheFilePath(page){
        const pathObj = path.parse(page);
        
        return path.join(pathObj.dir,pathObj.name + '.json')
    },
    setCache(data,page,string){
        const cacheFilePath = this._getCacheFilePath(page);
        const mdkey = this._getMdKey(data);
        let json;
        try{
            json = JSON.parse(fs.readFileSync(cacheFilePath));
        }catch(e){
            json = {};
        }
        json[mdkey] = string;

        //最多缓存20条数据。
        if(Object.getOwnPropertyNames(json).length > 20){
            delete json[Object.keys(json)[0]]
        }

        fs.writeFile(cacheFilePath,JSON.stringify(json),(err) =>{
            if(err) {
                console.error(err);
            }
        });
        
        
    },
    getCache(data,page){
        const mdkey = this._getMdKey(data);
        const cacheFilePath = this._getCacheFilePath(page);
        const json = JSON.parse(fs.readFileSync(cacheFilePath));
        if(mdkey in json){
            return json[mdkey];
        }else{
            throw 'without data'
        }
    }
    
}






module.exports = renderCache;