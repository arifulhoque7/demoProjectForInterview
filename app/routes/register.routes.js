
module.exports = app => {
  const database = require("../models/db.js");
  
  app.set('view engine', 'ejs');

  const register = require("../controllers/register.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/register", register.create);
  router.post("/login", register.findOne);
  
  router.get("/products", function (req, res, next) {
    res.render('index', { title: 'Product List' })
  });
  router.get("/get_products", function (request, response, next) {
    
    var draw =request.query.draw; 
    var start =request.query.start; 
    var length =request.query.length; 
    var order_data =request.query.order; 

    if(typeof order_data == 'undefined'){

      var column_name = 'products.product_id';
      var column_sort_order = 'desc';
    }else{
      var column_index = request.query.order[0]['column'];
      var column_name = request.query.columns[column_index]['data'];
      var column_sort_order = request.query.order[0]['dir'];
    }

    var search_value = request.query.search['value'];

    var search_query = `
    AND(product_name LIKE '%${search_value}%'
    OR manufacturer_name LIKE '%${search_value}%'
    OR buy_price LIKE '%${search_value}%'
    OR sell_price LIKE '%${search_value}%'
    )
    `;

    database.query("SELECT COUNT(*) AS Total FROM products",function(error,data){
       var total_records = data[0].Total;


       database.query(`SELECT COUNT(*) AS Total FROM products WHERE 1 ${search_query}`,function(error,data){
          var total_record_with_filter = data[0].Total;

          var query =`
          SELECT * FROM products
          WHERE 1 ${search_query}
          ORDER BY ${column_name} ${column_sort_order}
          LIMIT ${start} , ${length}
          `;

          var data_arr = [];

          database.query(query,function(error,data){

            data.forEach(function(row){
              data_arr.push({
                'product_name' : row.product_name,
                'manufacturer_name' : row.manufacturer_name,
                'buy_price' : row.buy_price,
                'sell_price' : row.sell_price,
              });
            });

            var output ={
              'draw' : draw,
              'iTotalRecords' : total_records,
              'iTotalDisplayRecords' : total_record_with_filter,
              'aaData' : data_arr,
            };

            response.json(output);
          });
       });
    });


  });
  app.use('/api/user', router);
};
