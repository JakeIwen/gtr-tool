var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/warehouse_group';


router.get('/orders', function(req, res) {
  console.log('get orders data');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error - get orders data: ', err);
      res.sendStatus(500);
    } else {

    client.query('SELECT order_date, description, street, city, state, zip, address_type, first_name, last_name ' +
    'FROM customers ' +
    'JOIN addresses ON customers.id = addresses.customer_id ' +
    'JOIN orders ON orders.address_id = addresses.id ' +
    'JOIN line_items ON orders.id = line_items.order_id ' +
    'JOIN products ON products.id = line_items.product_id ' +
    'ORDER BY last_name;',
 function(err, result) {
      done(); // close the connection.

      console.log(result);

      if(err) {
        console.log('select query error - get orders data ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });
  }
  });
});

router.get('/warehouse/:product', function(req, res) {
  var product = req.params.product;
  console.log('get search data');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error - get search data: ', err);
      res.sendStatus(500);
    } else {

    client.query('SELECT warehouse, fulfillment_days ' +
      'FROM warehouse ' +
      'JOIN warehouse_product ON warehouse.id=warehouse_product.warehouse_id ' +
      'JOIN products ON products.id=warehouse_product.product_id ' +
      'WHERE products.description LIKE $1 AND warehouse_product.on_hand > 0;', ['%' + product + '%'],
    function(err, result) {
      done(); // close the connection.

      console.log(result);

      if(err) {
        console.log('select query error - get orders data ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });
  }
  });
});

router.get('/:table', function(req, res) {
  console.log('get warehouse data');
  var table = req.params.table;
  console.log('table get:', table);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error - get warehouse data: ', err);
      res.sendStatus(500);
    } else {

    client.query('SELECT * FROM ' + table + ';', function(err, result) {
      done(); // close the connection.

      // console.log('the client!:', client);

      if(err) {
        console.log('select query error - get warehouse data ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });
  }
  });
});

module.exports = router;
