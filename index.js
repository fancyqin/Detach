const express = require('express');
const engines = require('consolidate');
const fs = require('fs');
const app = express();
const art = require('express-art-template');
const pug = require('pug');
const ejs = require('ejs');
const dot = require('dot');
const dust = require('dustjs-linkedin');

app.set('views', './template-war');
app.set('view engine', 'html');

app.engine('art',art);
app.engine('pug', pug.__express);
app.engine('ejs', ejs.renderFile);
app.engine('jst',engines['dot']);
app.engine('dust',engines['dust']);
let data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

const engine_route = (route,file,name) => {
    app.get(route, (req, res) => {
        data.engine = name;
        data.xss = '<script>alert(1)</script>';
        res.render(file,data);
    });
};

const renderWar = (name,doSth) => {
    data.engine = name;
    data.xss = '<script>alert(1)</script>';
    let time = new Date();
    for (let i=0;i<100;i++){
        doSth();
    }
    console.log(name+': '+(new Date() - time)+'ms');
};
renderWar('art-template',()=>{
    let html = art.template.render(fs.readFileSync(__dirname+'/template-war/index.art','utf8'),data);
    //console.log(html);
});
renderWar('ejs',()=>{
    let html = ejs.render(fs.readFileSync(__dirname+'/template-war/index.ejs','utf8'),data);
    //console.log(html);
});
renderWar('dot',()=>{
    let render = dot.template(fs.readFileSync(__dirname+'/template-war/index.jst','utf8'));
    let html = render(data);
    //console.log(html);
});
renderWar('pug',()=>{
    let html = pug.render(fs.readFileSync(__dirname+'/template-war/index.pug','utf8'),data);
    //console.log(html);
});
renderWar('dust.js',()=>{
    var src = fs.readFileSync(__dirname+'/template-war/index.dust', 'utf8');
    var compiled = dust.compile(src, 'hello');
    dust.loadSource(compiled);
    dust.render('hello',data,(err,out) => {
        //console.log(out);
    });
});

engine_route('/art','index.art','art-template');
engine_route('/ejs','index.ejs','ejs');
engine_route('/dot','index.jst','doT');
engine_route('/pug','index.pug','pug');
engine_route('/dust','index.dust','dust.js');

app.listen(3000, ()=> {
    console.log('listening at 3000');
});
