const exp=require('express')
const app=exp()
const path = require('path')
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer')
const expressAsyncHandler = require('express-async-handler')
app.use(exp.static(path.join(__dirname,'./build')))
app.use(exp.json())
const transpoter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: "scoretrack@outlook.com",
        pass: "nithin1239"
    }
})

app.post('/sendEmail',expressAsyncHandler(async(req,res)=>{
    var userObj=req.body
    const handlebaroptions={
    viewEngine:{
        extName:".handlebars",
        partialsDir:path.resolve('./views'),
        defaultLayout:false,
    },
    viewPath:path.resolve('./views'),
    extName:".handlebars",
}
transpoter.use('compile', hbs(handlebaroptions));
const options={
    from:'scoretrack@outlook.com',
    to:userObj.email,
    subject:userObj.subject,
    template:'email',
    context:{
        NAME:userObj.name,
        CONTENT:userObj.content
    }
};
transpoter.sendMail(options,function(err,info){
    if(err){
        console.log(err)
        res.send({message:'Failure'})
    }
    else{
        res.send({message:"Success"})
    }
})
}))

app.use('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./build/index.html'))
})

//Handling Invalid Paths
app.use((req,res,next)=>{
    res.send({'message':`Invalid path ${req.url}`})
})


//Handling Errors
app.use((err,req,res,next)=>{
    res.send({'message':`error is ${err}`})
})
app.listen(3000,()=>{console.log('server started listening in port 3000')})