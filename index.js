const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.render('test');
})
app.listen(8080)