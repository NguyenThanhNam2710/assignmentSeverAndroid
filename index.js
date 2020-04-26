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
let path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')))
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
        response.render('signIn', {status: 'block', data: 'Tạo tài khoản thành công.', user: nUser, pass: nPass});
    } else {
        response.send('Tạo tài khoản thất bại.');
    }

});
app.get('/', function (request, response) {
    response.render('signIn', {status: 'none', user: '', pass: ''});
});
app.get('/index', async function (request, response) {

    let user = request.query.user;
    let pass = request.query.pass;
    let sm = request.query.sm;

    console.log(user + " " + pass + " " + sm);

    let users = await User.find({username: user, password: pass}).lean();   //dk

    if (users.length <= 0 && sm == 1) {
        response.render('signIn', {
            status: 'block',
            data: 'Không thể đăng nhập, kiểm tra lại tài khoản và mật khẩu của bạn.',
            user: '',
            pass: ''
        });
    } else {
        response.render('index', {data: users});
    }


});

app.get('/signUp', async function (request, response) {

    let update = request.query.update;
    console.log(update + '')
    if (update == 1) {
        update = 0;

        let idKH = request.query.idKH;
        let userKH = request.query.userKH;
        let passKH = request.query.passKH;
        response.render('signUp', {
            title: 'Sửa tài khoản',
            btnUD: 'Sửa',
            btnC: 'Làm lại',
            action: 'danhsachkhachhang',
            userKH: userKH,
            passKH: passKH,
            idKH: idKH
        });
    } else {
        response.render('signUp', {
            title: 'Tạo tài khoản',
            btnUD: 'Xong',
            btnC: 'Làm lại',
            action: 'signIn',
            userKH: '',
            passKH: '',
            idKH: ''
        });
    }


});
app.get('/uploadsanpham', async function (request, response) {

    let nameSP = request.query.nameSP;
    let priceSP = request.query.priceSP;
    let descriptionSP = request.query.descriptionSP;
    let typeSP = request.query.typeSP;
    let slSp = request.query.slSP;
    let image = request.query.exImage;
    if (nameSP && priceSP && descriptionSP && typeSP) {
        let addProduct = new Product({
            name: nameSP,
            price: priceSP,
            description: descriptionSP,
            type: typeSP,
            sl: slSp,
            image: '../public/images/' + image
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


app.get('/sanpham', async function (request, response) {
    let products = await Product.find({}).lean();
    response.render('sanpham', {data: products});
});

app.get('/quanlysanpham', async function (request, response) {
    let products = await Product.find({}).lean();


    let del = request.query.del;
    let edit = request.query.update;
    console.log(del + ' ' + edit);
    if (del == 1) {
        let idSP = request.query.idSP;
        console.log(idSP + "del Sp");

        let status = await Product.findByIdAndDelete(idSP);
        let nProduct = await Product.find({}).lean();
        if (status) {
            response.render('quanlysanpham', {
                data: nProduct,
                status: 'block',
                textAlert: 'Xóa sản phẩm thành công.'
            });
        } else {
            response.render('quanlysanpham', {
                data: nProduct,
                status: 'block',
                textAlert: 'Xóa sản phẩm thất bại.'
            });
        }
    } else {
        response.render('quanlysanpham', {data: products, status: 'none'});
    }
});
app.get('/danhsachkhachhang', async function (request, response) {
    let users = await User.find({}).lean();
    let del = request.query.del;
    let edit = request.query.update;
    console.log(del + ' ' + edit);
    if (del == 1) {
        let idKH = request.query.idKH;
        console.log(idKH + "del kh");

        let status = await User.findByIdAndDelete(idKH);
        let nUsers = await User.find({}).lean();
        if (status) {
            response.render('danhsachkhachhang', {
                data: nUsers,
                status: 'block',
                textAlert: 'Xóa khách hàng thành công.'
            });
        } else {
            response.render('danhsachkhachhang', {
                data: nUsers,
                status: 'block',
                textAlert: 'Xóa khách hàng thất bại.'
            });
        }

    } else if (edit == 1) {

        let nId = request.query.nId;
        let nUser = request.query.nUser;
        let nPass = request.query.nPass;
        console.log(nId + "edit kh");
        let status = await User.findByIdAndUpdate(nId, {
            username: nUser,
            password: nPass
        });
        let nUsers = await User.find({}).lean();
        if (status) {
            response.render('danhsachkhachhang', {
                data: nUsers,
                status: 'block',
                textAlert: 'Cập nhật khách hàng thành công.'
            });
        } else {
            response.render('danhsachkhachhang', {
                data: nUsers,
                status: 'block',
                textAlert: 'Cập nhật khách hàng thất bại.'
            });
        }

    } else {
        response.render('danhsachkhachhang', {data: users, status: 'none'});
        del = 0;
        edit = 0;
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



