const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const img = path.join(__dirname,'text.png');

const tess = Tesseract.recognize(img);

tess.progress( p => {
    console.log('progress',p)
}).then(result =>{
    console.log('result',result)
})