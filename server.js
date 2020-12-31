const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require('cors')
const path = require('path')
const express = require( 'express')
const path = require( 'path')
const bodyParser = require( 'body-parser')
const cookieParser = require( 'cookie-parser')
const compress = require( 'compression')
const cors = require( 'cors')
const helmet = require( 'helmet')
const Template = require( './template')
const userRoutes = require( './routes/user.routes')
const authRoutes = require( './routes/auth.routes')
const postRoutes = require( './routes/post.routes')
const groupsRoutes = require( './routes/groups.routes')
const rulesRoutes = require( './routes/rules.routes')
const expertRoutes = require( './routes/expert.routes')
const marketplaceRoutes = require( './routes/marketplace.routes')
const React = require( 'react')
const ReactDOMServer = require( 'react-dom/server')
const MainRouter = require( './client/MainRouter')
const { StaticRouter } = require( 'react-router-dom')

const { ServerStyleSheets } = require( '@material-ui/styles')(ServerStyleSheets)
const { ThemeProvider } = require( '@material-ui/styles')(ThemeProvider)

const theme = require( './client/theme')
//end

//comment out before building for production
const devBundle = require( './devBundle')

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
