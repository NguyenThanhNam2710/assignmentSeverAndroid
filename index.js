let express = require('express');
let hbs = require('express-handlebars');
let app = express();
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.listen(9090);
app.get('/login', function (request, response) {
    response.render('login');
    let user = request.query.user;
    let pass = request.query.pass;
    console.log(user + " " + pass);
});
app.get('/', function (request, response) {
    response.render('login');
    let user = request.query.user;
    let pass = request.query.pass;
    console.log(user + " " + pass);
});
app.get('/signUp', function (request, response) {
    response.render('signUp');
});
app.get('/index', function (request, response) {
    response.render('index');
});
app.get('/sanpham', function (request, response) {
    response.render('sanpham');
});
app.get('/quanlysanpham', function (request, response) {
    response.render('quanlysanpham');
});
app.get('/uploadsanpham', function (request, response) {
    response.render('uploadsanpham');
});
app.get('/danhsachkhachhang', function (request, response) {
    response.render('danhsachkhachhang');
});

