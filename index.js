let express = require('express');
let hbs = require('express-handlebars');
let db = require('mongoose');
let body = require('body-parser');

let userSchema = require('./model/userSchema');
let productSchema = require('./model/productSchema');
let adminSchema = require('./model/adminSchema');
let cartSchema = require('./model/cartSchema');

let User = db.model('User', userSchema, 'users');
let Product = db.model('Product', productSchema, 'products');
let Admin = db.model('Admin', adminSchema, 'administratorAccounts');
let Cart = db.model('Cart', cartSchema, 'carts');

let nameDN = '', allUser = '', allProduct = '', allAdmin = '';

db.connect('mongodb+srv://bookmanager:123456788@cluster0-lowdt.gcp.mongodb.net/SampleData', {}).then(function (res) {
    console.log('conected');
})

let app = express();
let path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(body.json());
app.use(body.urlencoded({extended: true}));
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.listen(9090);


app.get('/', function (request, response) {
    response.render('signIn', {status: 'none', user: '', pass: ''});
});
app.get('/index', async function (request, response) {
    let listUser = await User.find({}).lean();   //dk
    let listProduct = await Product.find({}).lean();   //dk
    let listAdmin = await Admin.find({}).lean();   //dk
    allUser = listUser.length;
    allProduct = listProduct.length;
    allAdmin = listAdmin.length;


    let user = request.query.user;
    let pass = request.query.pass;
    let sm = request.query.sm;

    if (sm == 1) {
        nameDN = user;
        console.log(user + " " + sm);
    }

    let admins = await Admin.find({username: user, password: pass}).lean();   //dk

    if (admins.length <= 0 && sm == 1) {
        response.render('signIn', {
            status: 'block',
            data: 'Không thể đăng nhập, kiểm tra lại tài khoản và mật khẩu của bạn.',
            user: '',
            pass: ''
        });
    } else {
        response.render('index', {
            status: 'none',
            user: nameDN,
            pass: pass,
            allUser: allUser,
            allProduct: allProduct,
            allAdmin: allAdmin
        });
    }


});

app.get('/createAdAc', async function (request, response) {
    let a = await Admin.find({}).lean();   //dk
    let search = request.query.search;
    let nameSP = request.query.nameSP;
    if (search == 1 && nameSP) {
        let seachAdmin = await Admin.find({username: nameSP}).lean();
        response.render('createAdAc', {
            status: 'none',
            data: seachAdmin,
        });
    } else {
        let sm = request.query.sm;
        let del = request.query.del;
        let edit = request.query.ud;
        if (sm == 1) {
            let nUser = request.query.nUser;
            let nPass = request.query.nPass;

            let findAdmin = await Admin.find({username: nUser}).lean();   //dk


            if (findAdmin.length <= 0) {
                let newAdmin = new Admin({
                    username: nUser,
                    password: nPass,
                });
                let status = await newAdmin.save();
                let admins = await Admin.find({}).lean();   //dk

                if (status) {
                    response.render('createAdAc', {
                        status: 'block',
                        textAlert: 'Tạo tài khoản thành công.',
                        data: admins,
                    });
                } else {
                    response.render('createAdAc', {
                        status: 'block',
                        textAlert: 'Tạo tài khoản thất bại.',
                        data: admins,
                    });
                }
            } else {

                response.render('createAdAc', {
                    status: 'block',
                    textAlert: 'Tài khoản đã tồn tại.Mời tạo tài khoản khác !',
                    data: a,
                });
            }
        } else if (del == 1) {
            console.log('del ad ' + request.query.idAD);
            let status = await Admin.findByIdAndDelete(request.query.idAD);
            let admins = await Admin.find({}).lean();   //dk
            if (status) {
                response.render('createAdAc', {
                    status: 'block',
                    textAlert: 'Xóa tài khoản thành công.',
                    data: admins,
                });
            } else {
                response.render('createAdAc', {
                    status: 'block',
                    textAlert: 'Xóa tài khoản thất bại.',
                    data: admins,
                });
            }
        } else if (edit == 1) {
            let nId = request.query.nId;
            let nUser = request.query.nUser;
            let nPass = request.query.nPass;
            console.log('edit ad ' + request.query.nId);

            let admins = await Admin.find({username: nUser, password: nPass}).lean();   //dk
            if (admins.length <= 0) {
                console.log(nId + "edit ad");
                let status = await Admin.findByIdAndUpdate(nId, {
                    username: nUser,
                    password: nPass
                });
                let nAdmins = await Admin.find({}).lean();
                if (status) {
                    response.render('createAdAc', {
                        status: 'block',
                        textAlert: 'Cập nhật tài khoản thành công.',
                        data: nAdmins,
                    });
                } else {
                    response.render('createAdAc', {
                        status: 'block',
                        textAlert: 'Cập nhật tài khoản thất bại.',
                        data: nAdmins,
                    });
                }
            } else {
                let nAdmins = await Admin.find({}).lean();
                response.render('createAdAc', {
                    status: 'block',
                    textAlert: 'Cập nhật tài khoản thất bại. Tài khoản đã tồn tại.',
                    data: nAdmins,
                });
            }

        } else {
            del = 0;
            edit = 0;
            response.render('createAdAc', {
                status: 'none',
                data: a,
            });
        }
    }
});
app.get('/updateAdAc', async function (request, response) {
    let userAD = request.query.userAD;
    let passAD = request.query.passAD;
    let idAD = request.query.idAD;
    response.render('updateAdAc', {
        status: 'none',
        user: userAD,
        pass: passAD,
        id: idAD
    });

});

app.get('/createUsAc', async function (request, response) {
    let nUser = request.query.nUser;
    let nPass = request.query.nPass;
    if (nUser && nPass) {
        let users = await User.find({username: nUser}).lean();   //dk
        if (users.length <= 0) {
            let newUser = new User({
                username: nUser,
                password: nPass,
            });
            let status = await newUser.save();
            if (status) {
                response.render('createUsAc', {
                    status: 'block',
                    textAlert: 'Tạo tài khoản thành công.',
                });
            } else {
                response.render('createUsAc', {
                    status: 'block',
                    textAlert: 'Tạo tài khoản thất bại.',
                });
            }
        } else {
            response.render('createUsAc', {
                status: 'block',
                textAlert: 'Tài khoản đã tồn tại.Mời tạo tài khoản khác !',
            });
        }
    } else {
        response.render('createUsAc', {
            status: 'none',
        });
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
            btnUD: 'Cập nhật',
            btnC: 'danhsachkhachhang',
            action: 'danhsachkhachhang',
            userKH: userKH,
            passKH: passKH,
            idKH: idKH,
            dsp: 'block'
        });
    } else {
        response.render('signUp', {
            btnUD: 'Xong',
            btnC: 'signIn',
            action: 'signIn',
            dsp: 'none'
        });
    }


});

app.get('/uploadsanpham', async function (request, response) {
    let sm = request.query.sm;
    let nameSP = request.query.nameSP;
    let priceSP = request.query.priceSP;
    let descriptionSP = request.query.descriptionSP;
    let typeSP = request.query.typeSP;
    let slSP = request.query.slSP;
    let image = request.query.exImage;
    if (nameSP && priceSP && descriptionSP && typeSP && sm == 1) {
        let products = await Product.find({
            name: nameSP,
            price: priceSP,
            description: descriptionSP,
            type: typeSP,
            sl: slSP,
            image: image
        }).lean();   //dk
        if (products.length <= 0) {
            let addProduct = new Product({
                name: nameSP,
                price: priceSP,
                description: descriptionSP,
                type: typeSP,
                sl: slSP,
                image: image
            });
            let status = await addProduct.save();
            if (status) {
                response.render('uploadsanpham', {status: 'block', data: 'Thêm sản phẩm ' + nameSP + ' thành công.'});

            } else {
                response.render('uploadsanpham', {status: 'block', data: 'Thêm sản phẩm ' + nameSP + ' thất bại.'});

            }
        } else {
            response.render('uploadsanpham', {
                status: 'block',
                data: 'Thêm sản phẩm ' + nameSP + ' thất bại. Sản phẩm đã tồn tại.'
            });

        }
    } else {
        response.render('uploadsanpham', {status: 'none'});
    }
});
app.get('/updatesanpham', async function (request, response) {

    let update = request.query.update;
    console.log(update + '')
    if (update == 1) {
        update = 0;

        let idSP = request.query.idSP;
        let imageSP = request.query.imageSP;
        let nameSP = request.query.nameSP;
        let priceSP = request.query.priceSP;
        let descriptionSP = request.query.descriptionSP;
        let typeSP = request.query.typeSP;
        let slSP = request.query.slSP;

        response.render('updatesanpham', {
            title: 'Cập nhật sản phẩm',
            status: 'none',
            btnUD: 'Cập nhật',
            btnC: 'Làm lại',
            idSP: idSP,
            imageSP: imageSP,
            nameSP: nameSP,
            priceSP: priceSP,
            descriptionSP: descriptionSP,
            typeSP: typeSP,
            slSP: slSP,
        });
    }


});
app.get('/sanpham', async function (request, response) {
    let products = await Product.find({}).lean();
    let search = request.query.search;
    let nameSP = request.query.nameSP;
    if (search == 1 && nameSP) {
        let seachProducts = await Product.find({name: nameSP}).lean();
        response.render('sanpham', {data: seachProducts});
    } else {
        response.render('sanpham', {data: products});
    }

});

app.get('/quanlysanpham', async function (request, response) {
    let products = await Product.find({}).lean();
    let search = request.query.search;
    let nameSP = request.query.nameSP;
    if (search == 1 && nameSP) {
        let seachProducts = await Product.find({name: nameSP}).lean();
        response.render('quanlysanpham', {data: seachProducts, status: 'none'});
    } else {

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
        } else if (edit == 1) {

            let nId = request.query.nId;
            let nameSP = request.query.nameSP;
            let priceSP = request.query.priceSP;
            let exImage = request.query.exImage;
            let descriptionSP = request.query.descriptionSP;
            let typeSP = request.query.typeSP;
            let slSP = request.query.slSP;
            let products = await Product.find({
                name: nameSP,
                price: priceSP,
                description: descriptionSP,
                type: typeSP,
                sl: slSP,
                image: exImage
            }).lean();   //dk
            if (products.length <= 0) {
                console.log(nId + "edit sp");
                let status = await Product.findByIdAndUpdate(nId, {
                    name: nameSP,
                    price: priceSP,
                    description: descriptionSP,
                    type: typeSP,
                    sl: slSP,
                    image: '../public/images/' + exImage
                });
                let nProduct = await Product.find({}).lean();
                if (status) {
                    response.render('quanlysanpham', {
                        data: nProduct,
                        status: 'block',
                        textAlert: 'Cập nhật sản phẩm thành công.'
                    });
                } else {
                    response.render('quanlysanpham', {
                        data: nProduct,
                        status: 'block',
                        textAlert: 'Cập nhật sản phẩm thất bại.'
                    });
                }
            } else {
                let nProduct = await Product.find({}).lean();
                response.render('quanlysanpham', {
                    data: nProduct,
                    status: 'block',
                    textAlert: 'Cập nhật sản phẩm thất bại. Sản phẩm cập nhật đã tồn tại.'
                });
            }

        } else {
            response.render('quanlysanpham', {data: products, status: 'none'});
        }
    }
});
app.get('/danhsachkhachhang', async function (request, response) {
    let users = await User.find({}).lean();
    let search = request.query.search;
    let nameSP = request.query.nameSP;
    if (search == 1 && nameSP) {
        let seachUser = await User.find({username: nameSP}).lean();
        response.render('danhsachkhachhang', {data: seachUser, status: 'none'});
    } else {

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

            let users = await User.find({username: nUser, password: nPass}).lean();   //dk
            if (users.length <= 0) {
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
                let nUsers = await User.find({}).lean();
                response.render('danhsachkhachhang', {
                    data: nUsers,
                    status: 'block',
                    textAlert: 'Cập nhật khách hàng thất bại. Tên khách hàng đã tồn tại.'
                });
            }
        } else {
            response.render('danhsachkhachhang', {data: users, status: 'none'});
            del = 0;
            edit = 0;
        }


    }
});


//get dl
app.get('/getDL', async function (request, response) {
    response.render('getDL');
});

app.get('/getAlluser', async function (request, response) {
    let users = await User.find({});
    response.send(users);
});
app.get('/getAllproduct', async function (request, response) {
    let products = await Product.find({});
    response.send(products);
});

app.get('/getAllCart', async function (request, response) {
    let carts = await Cart.find({});
    response.send(carts);
});



app.post('/postUser', async function (request, response) {
    let nUser = request.body.username;
    let nPass = request.body.password;
    if (nUser && nPass) {
        let users = await User.find({username: nUser}).lean();   //dk
        if (users.length <= 0) {
            let newUser = new User({
                username: nUser,
                password: nPass,
            });
            let status = await newUser.save();
            if (status) {
                response.render('createUsAc', {
                    status: 'block',
                    textAlert: 'Tạo tài khoản thành công.',
                });
            } else {
                response.render('createUsAc', {
                    status: 'block',
                    textAlert: 'Tạo tài khoản thất bại.',
                });
            }
        } else {
            response.render('createUsAc', {
                status: 'block',
                textAlert: 'Tài khoản đã tồn tại.Mời tạo tài khoản khác !',
            });
        }
    } else {
        response.render('createUsAc', {
            status: 'none',
        });
    }


});
app.post('/postCart', async function (request, response) {
    let user = request.body.user;
    let productID = request.body.productID;
    let name = request.body.name;
    let price = request.body.price;
    let description = request.body.description;
    let type = request.body.type;
    let sl = request.body.sl;
    let image = request.body.image;


    let newCart = new Cart({
        user: user,
        productID: productID,
        name: name,
        price: price,
        image: image,
        description: description,
        type: type,
        sl: sl,
    });
    let status = await newCart.save();
    if (status) {
        response.send(newCart)
    } else {
        response.send('Them thất bại.')
    }


});



