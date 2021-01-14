const express = require('express');
var session = require('express-session');
const app = express();
const port = process.env.port || 8080;
const morgan = require('morgan');
app.use(morgan('dev'));
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'ssshhhhh'}));
app.use(express.static('assets'));
app.use(express.static('assets/images'));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('html', require('ejs').renderFile);
const multer = require('multer');

const ObjectID = require('mongodb').ObjectID;


const mongoClient = require('mongodb').MongoClient;
const mongo=require('mongodb');
const url = 'mongodb://localhost:27017';


var dbo;

mongoClient.connect(url, {useNewUrlParser: true}, function(error, db){
	if(error) throw error;
	console.log('database connected');
	dbo = db.db('ShortPad_db');
});



const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./assets/images');
	},
	filename: function(req,file,cb){
		var dateObject = new Date();
		var filename = dateObject.getDate() +"_"+ (dateObject.getMonth()+1) +"_"+ dateObject.getFullYear() +"_"+ dateObject.getHours() +"_"+ dateObject.getMinutes() +"_"+ dateObject.getSeconds() +"_"+ file.originalname;
		cb(null, filename);
	}
});

const fileFilter = (req,file,cb)=>{
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
		cb(null,true);
	else
		cb(new Error('Please insert image files specifically .jpeg/.png/.gif files'),false);
}

const upload = multer({storage:storage, fileFilter:fileFilter});


app.post('/AddStory/:id/:name', upload.single('picture'),function (req, res, next) {
	let type = req.body.storytype;
    let genre = req.body.genre;
    let title = req.body.title;
    let description = req.body.description;
    let content = req.body.content;
    let author_id = req.params.id;
    let author_name=req.params.name;
	let status = "0";
	let picture = req.file;
console.log(req.file);
var query = {
	title: title,
	description: description,
	content: content,
	img: picture.filename,
    user_id: 
    mongo.ObjectId(author_id),
	author_name:author_name,
	type: type,
	genre: genre,
	status: status,
    rating:"No rating yet"
	};
	dbo.collection("stories").insertOne(query, function (error, results, fields) {
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Story Successfully added!'
        });
    });
    
});




var sess;
app.get('/', (req, res) => {
    sess = req.session;
    if(sess.username){
        res.redirect('/ShortPad#!/home');        
    }else{
        res.redirect('/ShortPad#!');
    }
});

app.get('/checksession', (req, res) => {
    sess = req.session;
    if(sess.username){
                return res.send({loginstatus:1,username:sess.username,user_id:sess.user_id});
    }else{
        return res.send({loginstatus:0});
    }
});





app.post('/login', function(req,res){
    sess = req.session;
    let un = req.body.User_UserName;
    let pw = req.body.User_Password;

    var query = {
        $and:[
            {username:un},{password:pw}
        ]
    };

    dbo.collection('user').find(query).toArray(
		function(err, results){
			if(err) throw err;
            if(results.length>0){
                sess.user_id=results[0]._id;//dagdagmish
                sess.username = un;
                sess.password = pw;
                return res.send({message:"Authenticated"});
            }        
			return res.send({message:"Wrong Credentials"});
		}
	);


    
});

app.post('/register', function (req, res, next) {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;


    var query = {
                name: name,
                username: username,
                password: password
        };
    dbo.collection("user").insertOne(query, function (error, results, fields) {
        if(error) throw error;
        return res.send({message:"Registered"});
    });
});

app.get('/showprofile/:username', function (req, res, next) {
    let name = req.params.username;

    dbo.collection('user').find({"username":name}).toArray((err, results) => {
        // console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.get('/showOwnStoryUnpublished/:id', function (req, res, next) {
    let id = req.params.id;

    dbo.collection('stories').find({"user_id":mongo.ObjectID(id),"status":"0"}).toArray((err, results) => {
        // console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.get('/showOwnStorypublished/:id', function (req, res, next) {
    let id = req.params.id;

    dbo.collection('stories').find({"user_id":mongo.ObjectID(id),"status":"1"}).toArray((err, results) => {
        // console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.get('/showOwnStoryEdit/:id', function (req, res, next) {
    let id = req.params.id;

    dbo.collection('stories').find({"_id":mongo.ObjectID(id)}).toArray((err, results) => {
        // console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.put('/ownStoryUpdate/:id', function (req, res, next) {

    var id =req.params.id;
    console.log(id);
    var type=req.body.type;
    console.log(type);
    var genre=req.body.genre;
    console.log(genre);
    var title=req.body.title;
    console.log(title);
    var description=req.body.description;
    console.log(description);
    var content=req.body.content;
    console.log(content);


    dbo.collection('stories').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"type":type,"genre":genre,"title":title,"description":description,"content":content}},(err, results) => {
        console.log(results);
        if(err) { 
            console.log(err);
            res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.put('/changePhoto/:id', upload.single('picture'),function (req, res, next) {
	let id = req.params.id;
	let picture = req.file;
    console.log(req.file);

	dbo.collection("stories").updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"img":picture.filename}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  
    
});

app.put('/editComment/:id/:id2/:content', upload.single('picture'),function (req, res, next) {
	let id = req.params.id;
    let id2 = req.params.id2;
    let content = req.params.content;
    console.log(req.file);

	dbo.collection("stories").updateOne(
        {"_id":mongo.ObjectID(id),"comments.comment_id":mongo.ObjectID(id2)},{$set:{"comments.$.c_content":content}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  
    
});



app.put('/publish/:id', function (req, res, next) {

    var id =req.params.id;

    dbo.collection('stories').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"status":"1"}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.put('/unpublish/:id', function (req, res, next) {

    var id =req.params.id;

    dbo.collection('stories').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"status":"0"}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.delete('/delete/:id', function (req, res, next) {

    var id =req.params.id;

    dbo.collection('stories').deleteOne(
        {"_id":mongo.ObjectID(id)},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.delete('/delete2/:id', function (req, res, next) {

    var id =req.params.id;

    dbo.collection('stories').deleteOne(
        {"_id":mongo.ObjectID(id)},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});



app.put('/changePassword/:id', function (req, res, next) {

    var id =req.params.id;
    var password=req.body.password;

    dbo.collection('user').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"password":password}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.put('/changeUsername/:id/:username', function (req, res, next) {

    var id =req.params.id;
    var username=req.params.username;

    dbo.collection('user').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"username":username}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});

app.put('/changeName/:id', function (req, res, next) {

    var id =req.params.id;
    var name=req.body.name;

    dbo.collection('user').updateOne(
        {"_id":mongo.ObjectID(id)},{$set:{"name":name}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });	  

});
app.put('/addToFav/:username', function (req, res, next) {

    var username =req.params.username;
    var id =req.body._id;
    var title=req.body.title;

    dbo.collection('user').update({"username":username}, {$push:{"favorite":{"_id":mongo.ObjectID(id), "title":title }}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });

});

app.put('/addComment/:username/:name/:user_id/:content/:story_id', function (req, res, next) {

    var username =req.params.username;
    var name =req.params.name;
    var user_id=req.params.user_id;
    var content=req.params.content;
    var story_id=req.params.story_id;
    var id = new ObjectID();

    dbo.collection('stories').update({"_id":mongo.ObjectID(story_id)}, 
    {$push:{"comments":{"comment_id":mongo.ObjectID(id),"user_id":mongo.ObjectID(user_id),"c_name":name,"c_username":username,"c_content":content }}},(err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });

});

app.get('/viewfave/:username', function (req, res, next) {
    let username = req.params.username

    dbo.collection('user').aggregate([{"$match":{"username":username}}, { $lookup:{ from:"stories", localField:"favorite._id", foreignField:"_id", as:"book_details" }} ]).toArray((err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.delete('/removeFav/:book_id/:username', function (req, res, next) {
    let username = req.params.username
    let id=req.params.book_id
    dbo.collection('user').update({"username":username}, { $pull:{favorite:{_id:mongo.ObjectID(id)} }}),((err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.delete('/removeComment/:story_id/:comment_id', function (req, res, next) {
    let id = req.params.story_id;
    let id2 = req.params.comment_id;
    dbo.collection('stories').update({"_id":mongo.ObjectID(id)}, { $pull:{comments:{comment_id:mongo.ObjectID(id2)} }}),((err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});



app.get('/logout', function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(error);
        }else{
            res.redirect('/ShortPad#!');
        }
    });
});

app.get('/ShortPad', (req, res) => {
    sess = req.session;
    if(sess.username){
        res.render('pages/index.html');
    }else{
        res.render('pages/index.html');
    }
});


app.get('/showbooks', function (req, res, next) {
    var status=1;

    dbo.collection('stories').find({"status":"1"}).toArray((err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.get('/showbookss', function (req, res, next) {
    var status=-1;

    dbo.collection('stories').aggregate([{$sort:{"rating":-1}}]).toArray((err, results) => {
        console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});

app.get('/viewbook/:id', function (req, res, next) {
    let id = req.params.id

    dbo.collection('stories').find({"_id":mongo.ObjectID(id)}).toArray((err, results) => {
        // console.log(results);
        if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
    });
});




app.get('/checkrate/:story_id', function (req, res, next) {
    sess = req.session;

    var story_id =req.params.story_id;
    console.log("hoy"+sess.user_id);
        if(sess.user_id==null){
            console.log("do nothing");
        }
        else{
        var query = {
            user_id: sess.user_id,
            story_id:story_id

        };
    dbo.collection('ratings').find(query).toArray((err, results) => {
        console.log("habaaa"+results.length)
      console.log(results);
           
     if(err) { res.json({ success: false, data: null }); } 
        else { res.json(results); }
        res.end();
        
               
           
    });}
    
});

app.post('/addRating/:user_id/:rate', function (req, res, next) {

    var user_id =req.params.user_id;
    var story_id =req.body._id;
    var stars =req.params.rate;

    var query = {
            user_id: user_id,
            story_id: story_id,
            rating:+stars
    };
   var queryfind = {
            story_id: story_id
        };
    var rate=0;
    var ave_rate=0;
    dbo.collection("ratings").insertOne(query, function (error, results, fields) {
        if(error) throw error;
        console.log(results)
   dbo.collection('ratings').find(queryfind).toArray((err, results) => {
    console.log("anooooooooooooooooooooooooooooooooooooooooo")
    console.log(results);
    if(err) throw err;
    for(var i=0;i<results.length;i++){
        rate+=results[i].rating;
        console.log("ratinggggggggg"+results[i].rating)
        console.log("summmmmmratinggggggggg"+rate)
        ave_rate=rate/results.length;
        console.log("aveeeeeeratinggggggggg"+ave_rate)
        console.log("lengggggth"+results.length)
        console.log("hmm"+ave_rate);

    } 
    dbo.collection('stories').updateOne({"_id":mongo.ObjectID(story_id)},{$set:{"rating":round(ave_rate,2)}}, function (error, results, fields) {
      if(error) throw error; 

    });
    });
     return res.send({
            error: false,
            data: results,
            message: 'Story Rated!'

        });


        });
 


});
app.put('/editRating/:user_id/:rate', function (req, res, next) {

    var user_id =req.params.user_id;
    var story_id =req.body._id;
    var stars =req.params.rate;
    var query = {
            user_id: user_id,
            story_id: story_id,
        };
var queryfind = {
            story_id: story_id
        };
    var rate=0;
    var ave_rate=0;
    dbo.collection("ratings").updateOne(query,{$set:{"rating":+stars}}, function (error, results, fields) {
        if(error) throw error;
        console.log(results)
   dbo.collection('ratings').find(queryfind).toArray((err, results) => {
    console.log("anooooooooooooooooooooooooooooooooooooooooo")
    console.log(results);
    if(err) throw err;
    for(var i=0;i<results.length;i++){
        rate+=results[i].rating;
        console.log("ratinggggggggg"+results[i].rating)
        console.log("summmmmmratinggggggggg"+rate)
        ave_rate=rate/results.length;
        console.log("aveeeeeeratinggggggggg"+ave_rate)
        console.log("lengggggth"+results.length)
        console.log("hmm"+ave_rate);

    } 
    dbo.collection('stories').updateOne({"_id":mongo.ObjectID(story_id)},{$set:{"rating":round(ave_rate,2)}}, function (error, results, fields) {
      if(error) throw error; 

    });
    });
        return res.send({
            error: false,
            data: results,
            message: 'Story Rating Updated!'
        });

        });

});




app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Running at localhost:${port}`);
});
function round(v,d){
    return Number(Math.round(v+'e'+d)+'e-'+d);
}