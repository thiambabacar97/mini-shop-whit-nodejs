const express = require('express');
const session = require('express-session');
const Produit = require('./models/Produit');
const bodyparser = require('body-parser') 
const upload= require('./models/validateData');
const path = require('path');

const app = express();

/*********************************mes middleware***************************** */
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/admin', express.static(path.join(__dirname, '/uploads')));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(require('./middlewares/flash'));

/*********************************moteur de template***************************** */
app.set('view engine', 'ejs');

/*********************************mes routes***************************** */
app.get('/admin', function(req, res) {
    res.render('back');
})
app.get('/', function(req, res) {
    try {
        Produit.getAll((data)=>{
            Produit.getProduitCommander((command)=>{
                req.flash('data', data) ;
                    let somme = 0;
                    for (let i = 0; i < command.length; i++) {
                        somme = somme+parseInt(command[i].quantite) * parseInt(command[i].prix)
                    }
                res.render('front', {produits: data, commands: command, somme: somme});

                app.post('/findProduit', (req, res)=>{
                    Produit.findProduits(req.body.produit, (data)=>{
                        // if (data === []) {
                        //     req.flash('error', 'auchune donne correspondante n\'est trouve') ;
                        // }
                        console.log(data);
                        res.render('front', {produits: data, commands: command, somme: somme});
                    })
                })
            });
        });
    } catch (error) {
        req.flash('error', 'le quantite doit etre superieur à "0"') ;
    }
});

app.post('/', (req, res)=> {
    try {
        const {quantite, id} = req.body;
        if(quantite <= 0 || quantite > 9) {
            req.flash('error', 'La quantite doit etre entre "0" et "9" ') ;
            res.redirect('/');
        }else{
            Produit.getProduitById(id, (data)=>{
                quantites = parseInt(data[0].quantite) + parseInt(quantite);
                if(quantites > 9) {
                    req.flash('error', 'Vous ne pouvez pas commander plus de 9 fois un même article') ;
                    res.redirect('/');
                }else{
                    Produit.updateProduitById(quantites, id, ()=>{
                        res.redirect('/');
                    });
                }
            })
        }
    } catch (error) {
        throw error;
    }
})
app.post('/admin', upload.single('image'), (req, res) => {
    try {
        const { title, description, prix } = req.body;
        const image = req.file;
        if (title && description && prix && image) {
            Produit.createProduit(title,description, prix, image.filename, ()=>{
                req.flash('success', 'data added') ;
                res.redirect('admin');
            });
        }else{
            req.flash('error', 'veilleiz remplir tous les champs!!') ;
            res.redirect('admin');
        }
    } catch (error) {
        throw error;
    }
});

app.post('/deletecmd',(req, res)=> {
    try {
        quantite = 0;
        Produit.updateProduitById(quantite, req.body.id, ()=>{
            try {
                req.flash('success', 'commande supprimer') ;
                res.redirect('/');
            } catch (error) {
                throw error
            }
        })
    } catch (error) {
        throw error;
    }
})

app.listen(8080);