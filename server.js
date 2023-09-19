const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors({origin:true}));
// app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(
        'mongodb://mongo:27017/dashboard-server',
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const resource = require('./routes/api/Resource');


app.use('/api/resource',resource);

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'views','home.html'));
});

const port = 5000;

app.listen(port, () => console.log('Server running...'));
