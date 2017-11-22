const express = require('express');
const engines = require('consolidate');
const fs = require('fs');
const app = express();

app.set('views', './template-war');

app.engine('art',require('express-art-template'));
app.engine('pug', require('pug').__express);
app.engine('ejs', require('ejs').renderFile);
app.engine('jst',engines['dot']);

let data = JSON.parse(fs.readFileSync(__dirname+'/data/repositories.json'));

const engine_route = (route,file,name) => {
    app.get(route, (req, res) => {
        data.engine = name;
        res.render(file,data);
    });
};


engine_route('/art','index.art','art-template');
engine_route('/ejs','index.ejs','ejs');
engine_route('/dot','index.jst','doT');
engine_route('/pug','index.pug','pug');


app.listen(3000, ()=> {
    console.log('listening at 3000');
});
