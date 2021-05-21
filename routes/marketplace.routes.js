const express =require( 'express')
const router = express.Router();
var random = require('mongoose-simple-random');
const Item = require("../models/item.model");
const Shop = require("../models/shop.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', true);



  router.get("/items", (req, res, next) => {

    Item.findRandom({}, {}, {limit: 10}, function(err, results) {
      if (err) {
        console.log(err)
      }else{

          res.status(200).json({
                      data: results
                  });
    }
    })})


    router.get("/shops", (req, res, next) => {

      Shop.findRandom({}, {}, {limit: 10}, function(err, results) {
        if (err) {
          console.log(err)
        }else{
console.log(results)
            res.status(200).json({
                        data: results
                    });
      }
      })})



  router.get("/getitems/:searchvalue", (req, res, next) => {
    console.log(req.params.searchvalue)
        const items=Item.find({ name: { $regex:req.params.searchvalue, $options: "i" } })
        .limit(10)
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{

                  res.status(200).json({
                              data: docs
                          });
        }
    })})

    router.get("/getshops/:searchvalue", (req, res, next) => {
      console.log(req.params.searchvalue)

          const shops=Shop.find({ name: { $regex: req.params.searchvalue, $options: "i" } })
          .limit(10)
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{

                    res.status(200).json({
                                data: docs
                            });
          }
      })})





      router.post("/additem/:userId", (req, res, next) => {

         let newItem= new Item({
           _id:new mongoose.Types.ObjectId(),
           title:req.body['title'],
           description:req.body['description'],
           createdby:req.params.userId,
           priceorrate:req.body['priceorrate'],

         })
         console.log(newItem)


         newItem.save((err) => {
           if(err){
             res.status(400).json({
               message: "The Item was not saved",
               errorMessage : err.message
            })
           }else{
             res.status(201).json({
               message: "Item was saved successfully"
            })
           }
         })

      })





router.post("/addshop", (req, res, next) => {
console.log(req.body)
   let newItem= new Shop({
     _id:new mongoose.Types.ObjectId(),
     title:req.body['title'],
     description:req.body['description'],
   })
   console.log("new shop",newItem)


   newItem.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })

})



module.exports= router
