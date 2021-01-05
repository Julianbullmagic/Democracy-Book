


const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require('cors')
const path = require('path')
const compress = require( 'compression')
const helmet = require( 'helmet')
const userRoutes = require( './routes/user.routes')
const authRoutes = require( './routes/auth.routes')
const postRoutes = require( './routes/post.routes')
const groupsRoutes = require( './routes/groups.routes')
const rulesRoutes = require( './routes/rules.routes')
const expertRoutes = require( './routes/expert.routes')
const marketplaceRoutes = require( './routes/marketplace.routes')

//comment out before building for production
const PORT = process.env.PORT || 5000




const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
const connect = mongoose
  .connect("mongodb+srv://Julian_Bull:bIGP1SxlM3RvYHEl@cluster0.k6i5j.mongodb.net/Democracy-Book?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log(err));


// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/groups', groupsRoutes)
app.use('/rules', rulesRoutes)
app.use('/experts', expertRoutes)
app.use('/marketplace', marketplaceRoutes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => console.log(`server is up at ${PORT}`));
