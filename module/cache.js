const md5 = require('blueimp-md5');




const renderCache = {
    _get(key){

    },
    _set(key,value){

    },
    _delCacheItem(){

    },
    _getMdKey(data){
        const dataStr = JSON.stringify(data);
        return 'md_' + md5(dataStr);
    },
    setCache(data,page,string){
        
    },
    getCache(data,page){
        
    }
    
}






module.exports = renderCache;