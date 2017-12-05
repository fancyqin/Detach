const express = require('express');
const fs = require('fs');
const app = express();


const NViewRender = require('./NViewRender.js');
const engine = new NViewRender({
    path:__dirname + '/template-war/'
});

const data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

const engine_route = (route,file,name) => {
    app.get(route, (req, res) => {
        data.engine = name;
        data.xss = '<script>alert(1)</script>';
        res.send(engine.compileByUri(data,file))
    });
};


engine_route('/art','index.art','art-template');
engine_route('/ejs','index.ejs','ejs');
engine_route('/dot','index.jst','doT');
engine_route('/pug','index.pug','pug');
engine_route('/handlebars','index.handlebars','handlebars');

engine_route('/test','index.ddd','test');


app.listen(3000, ()=> {
    console.log('listening at 3000');
});
