const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const db=require('./models/index')

const app=express();

app.use(bodyParser.json());
app.use(cors());

db.mongoose.connect('mongodb+srv://studentdb84:DEvPP3Gl8J24QqB2@mongotp.xqpmnt0.mongodb.net/firebasePractice')
.then(()=>{
    console.log('connected to mongo instance')
})
.catch(()=>{
    console.log('error connecting to mongo instance')
})
.finally(()=>{
    console.log('mongo code is running')
})

app.get('/',async (req,res)=>{
    try {
        res.status(200).send('works fine')
    } catch (error) {
        console.log(error);
        return res.status(500).send('server error')
    }
})

//ROUTES
app.use('/details',require('./routes/detail.route'))

const port=3000;

app.listen(port,()=>{
    console.log('app is running on http://localhost:'+port)
})
