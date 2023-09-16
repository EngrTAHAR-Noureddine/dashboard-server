const mongoose = require('mongoose');

const Schema=mongoose.Schema;

//Create Schema
const ResourceSchema = new Schema({
    TIMESTAMP:{
        type:String,
        required:true
    },
    CPU_PERCENTAGE:{
        type:Number,
        required:true
    },
    RAM_PERCENTAGE:{
        type:Number,
        required:true
    },
    DISK_PERCENTAGE:{
        type:Number,
        required:true
    },
    IS_ANOMALY:{
        type:Number,
        required:true
    }
});
// 'TIMESTAMP',  'CPU_PERCENTAGE', 'RAM_PERCENTAGE', 'DISK_PERCENTAGE', 'IS_ANOMALY'
module.exports = ResourceModule = mongoose.model('resource',ResourceSchema);