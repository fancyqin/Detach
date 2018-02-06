import { Promise } from "./C:/Users/qinfan/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bluebird";

// const firstResolvePromise = (promises) =>{
//     return Promise.all(promises.map(p =>{
//         return p.then(
//             val => Promise.reject(val),
//             err => Promise.resolve(err)
//         );  
//     })).then(
//         errors => Promise.reject(errors),
//         values => Promise.resolve(values) 
//     )
// }

const promiseRace = function(promises, count = 1, results = []) {
    promises = Array.from(promises);
    if (promises.length < count) {
        return Promise.reject('Race is not finishable');
    }
     
    let indexPromises = promises.map((p, index) => p.then(() => index, () => {throw index;}));
     
    return Promise.race(indexPromises).then(index => {
        let p = promises.splice(index, 1)[0];
        p.then(e => results.push(e));
        if (count === 1) {
            return results;
        }
        return promiseRace(promises, count-1, results);
    }, index => {
        promises.splice(index, 1);
        return promiseRace(promises, count, results);
    });
};








// const racePromise = (promise) =>{
//     return new Promise( (fatherResolve,fatherReject) =>{
//         promise.map(p =>{

//         })
//     })
// }






module.exports = (promises,resolveCount = 0,rejectCount = 0,result) => {
    let indexPromises = promises.map((p,index) => p.then(()=> index,()=> { throw index } ))

    return Promise.race(indexPromises).then(index =>{
        let p = promises.splice(index,1)[0];
            
    })


}