const mongoose = require('mongoose');

const Todoschema = new mongoose.Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
iscompleted:{
    type:Boolean,
    default:false
},
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
}
});

const Todos = mongoose.model('Todos', Todoschema);

module.exports = Todos;