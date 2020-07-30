const connection  = require('./db');
class Produit {

    static createProduit(name, desc, prix, image, resolve){
        connection.query('INSERT INTO produits SET name = ?, description = ?, prix = ?, image = ?', [name, desc, prix, image], function (error, succes) {
            if (error) throw error;
            resolve(succes);
        });
    }
    static getAll(resolve){
        connection.query(`  SELECT  * FROM produits`, function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
    static getProduitById(id, resolve){
        connection.query(`  SELECT  * FROM produits WHERE id = ?`, [id], function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
    static updateProduitById(quantite, id, resolve){
        connection.query(` Update produits SET quantite=? WHERE id=?`, [quantite, id], function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
    static getProduitCommander(resolve){
        connection.query(` SELECT  * FROM produits WHERE quantite > 0`, function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
    static deleteProduitCommander(id, resolve){
        connection.query(`DELETE FROM produits WHERE id=?`, [id], function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
    static findProduits(term, resolve){
        connection.query(`SELECT * FROM produits WHERE 
        lower(name) LIKE '%${term}%'`, function (error, succes) {
                if (error) throw error;
                resolve(succes);
        });
    }
}
// DELETE FROM `produits` WHERE 0
module.exports = Produit;