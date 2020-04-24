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

