(function(){

    var Util = {};
    
    Util.prototype.method = function(name,func){
        if (!this.prototype[name]){
            this.prototype[name] = func;
        }
        return this;
    }

    Util.method('na',function(){


    })

    //from A to C
    var hanoi = function(disc,A,B,C){
        if(disc > 0){
            hanoi(disc - 1,A,C,B);
            console.log('move ' + disc + ' from ' + A +' to ' + C);
            hanoi(disc -1 ,B,A,C);
        }
    }
    hanoi(3,'A','B','C');



})();