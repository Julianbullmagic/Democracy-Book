const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require('cors')
const path = require('path')

const routes = require('./routes')
const PORT = process.env.PORT || 5000

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
mongoose
  .connect(process.env.MONGOLAB_URI || "mongodb+srv://Julian_Bull:bIGP1SxlM3RvYHEl@cluster0.k6i5j.mongodb.net/Democracy-Book?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log(err));
app.use('/',routes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => console.log(`server is up at ${PORT}`));
