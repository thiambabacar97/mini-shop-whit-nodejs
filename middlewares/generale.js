module.exports = function () {
    //mes middleware
    app.use(express.static('public'));
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
    app.use(require('flash'));
}