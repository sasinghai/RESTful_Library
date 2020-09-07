var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/book_app",{useNewUrlParser:true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

var bookSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type: Date,default: Date.now}
});

var Book=mongoose.model("Book",bookSchema);


app.get("/",function(req,res){
	res.redirect("/books");
});

app.get("/books",function(req,res){
	Book.find({},function(err,books){
		if(err)
			console.log("ERROR!");
		else{
			res.render("index",{books:books});
		}
	});
});

app.get("/books/new",function(req,res){
	res.render("new");
});

app.post("/books",function(req,res){
	var newBook=req.body.book;
	//console.log(newBlog.body);
	newBook.body=req.sanitize(newBook.body);
	//console.log(newBlog.body);
	Book.create(newBook,function(err,newBook){
		if(err){
			res.render("error");
		}else{
			res.redirect("/books");
		}
	});
});

app.get("/books/:id",function(req,res){
	Book.findById(req.params.id,function(err,foundBook){
		if(err){
			res.redirect("/books");
		}else{
			res.render("show",{book:foundBook});
		}
	});
});

app.get("/books/:id/edit",function(req,res){
	Book.findById(req.params.id,function(err,foundBook){
		if(err){
			res.redirect("/books");
		}else{
			res.render("edit",{book:foundBook});
		}
	});
});

app.put("/books/:id",function(req,res){
	var newBook=req.body.book;
	//console.log(newBlog.body);
	newBook.body=req.sanitize(newBook.body);
	Book.findByIdAndUpdate(req.params.id,newBook,function(err,updatedBook){
		if(err){
			res.redirect("/books");
		}else{
			res.redirect("/books/"+req.params.id);
		}
	})
});

app.delete("/books/:id",function(req,res){
	Book.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/books");
		}else{
			res.redirect("/books");
		}
	});
});

app.listen(3000,function(){
	console.log("Server listening!!");
});