let express = require('express');
let hbs = require('express-handlebars');
let db = require('mongoose');
let userSchema = require('./model/userSchema');
let productSchema = require('./model/productSchema');
let User = db.model('User', userSchema, 'users');
let Product = db.model('Product', productSchema, 'products');
// let User = db.model('User', userSchema, 'users');
// 1 la ten model
// 2 la file schema
// 3 la ten cua collection tren server

db.connect('mongodb+srv://bookmanager:123456788@cluster0-lowdt.gcp.mongodb.net/SampleData', {}).then(function (res) {
    console.log('conected');
})

let app = express();
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.listen(9090);
app.get('/signIn', async function (request, response) {

    let nUser = request.query.nUser;
    let nPass = request.query.nPass;

    let newUser = new User({
        username: nUser,
        password: nPass,
    });
    let status = await newUser.save();
    if (status) {
        response.render('signIn', {status: 'block', data: 'Account successfully created.', user: nUser, pass: nPass});
    } else {
        response.send('Tạo tài khoản thất bại.');
    }

});
app.get('/', function (request, response) {
    response.render('signIn', {status: 'none', user: '', pass: ''});
});
app.get('/signUp', async function (request, response) {
    response.render('signUp');
});
app.get('/index', async function (request, response) {

    let user = request.query.user;
    let pass = request.query.pass;
    let sm = request.query.sm;

    console.log(user + " " + pass + " " + sm);

    let users = await User.find({username: user, password: pass}).lean();   //dk

    if (users.length <= 0 && sm == 1) {
        response.render('signIn', {status: 'block', data: 'Can\'t login !!! Check your account.', user: '', pass: ''});
    } else {
        response.render('index', {data: users});
    }


});
app.get('/sanpham', async function (request, response) {
    let products = await Product.find({}).lean();
    response.render('sanpham', {data: products});
});
app.get('/quanlysanpham', async function (request, response) {
    let products = await Product.find({}).lean();
    response.render('quanlysanpham', {data: products});
});
app.get('/uploadsanpham', async function (request, response) {

    let nameSP = request.query.nameSP;
    let priceSP = request.query.priceSP;
    let descriptionSP = request.query.descriptionSP;
    let typeSP = request.query.typeSP;
    if (nameSP && priceSP && descriptionSP && typeSP) {
        let addProduct = new Product({
            name: nameSP,
            price: priceSP,
            description: descriptionSP,
            type: typeSP,
        });
        let status = await addProduct.save();
        if (status) {
            response.render('uploadsanpham', {status: 'block', data: 'Thêm sản phẩm ' + nameSP + ' thành công.'});

        } else {
            response.render('uploadsanpham', {status: 'block', data: 'Thêm sản phẩm ' + nameSP + ' thất bại.'});

        }
    } else {
        response.render('uploadsanpham', {status: 'none'});
    }
});
app.get('/danhsachkhachhang', async function (request, response) {
    let users = await User.find({}).lean();


    let idKH = request.query.idKH;
    let del = request.query.del;
    if (del == 1) {
        console.log(idKH);
        del = 0;
        let status = await User.findByIdAndDelete(idKH);
        if (status) {
            response.render('danhsachkhachhang', {data: users, status: 'block', textAlert: 'Xóa thành công.'});
        } else {
            response.render('danhsachkhachhang', {data: users, status: 'block', textAlert: 'Xóa thất bại.'});
        }

    } else {
        response.render('danhsachkhachhang', {data: users, status: 'none'});
    }
});


// them sua xoa bang mongoose
app.get('/getAlluser', async function (request, response) {
    // let users = await User.find({_id: '5ea3f05127ae1bd3fefc2f5b'}).lean();   //dk
    // response.render('index', {data: users});
});
app.get('/deleteUser', async function (request, response) {
    let status = await User.findByIdAndDelete('5ea3f3f3f010ce7e90312e63')
    if (status) {
        response.send('xoa thanh cong');
    } else {
        response.send('xoa that bai');
    }
});
app.get('/createUser', async function (request, response) {
    let user = new User({
        name: 'nam dep trai',
        phone: '113',
        email: 'nam@gmail.com',
        address: 'Ninh Binh'
    });
    let status = await user.save();
    if (status) {
        response.send('them thanh cong');
    } else {
        response.send('them that bai');
    }
});
app.get('/updateUser', async function (request, response) {

    let status = await User.findByIdAndUpdate('5ea3f05127ae1bd3fefc2f5b', {
        name: 'nam dep trai',
        phone: '113',
        email: 'nam@gmail.com',
        address: 'Ninh Binh'
    });
    if (status) {
        response.send('update thanh cong');
    } else {
        response.send('update that bai');
    }
});

function delUser(id) {
    console.log('del')
    let status = User.findByIdAndDelete(id)
    if (status) {
        response.send('xoa thanh cong');
    } else {
        response.send('xoa that bai');
    }
};



