const express = require("express");
const router = express.Router();
const categorySchema = require("../../model/category");
const posts = require("../../model/post"); 
const path = require("path")


router.get("/" , (req,res)=>{
    res.render("admin/index")
})

router.get("/categories" , (req,res)=>{
    categorySchema.find({}).sort({$natural:-1}).then( categories =>{
        res.render("admin/categories" , {categories:categories})
    })
    
})

router.post("/categories" , (req,res)=>{
    categorySchema.create(req.body,(error,data) => {
        res.redirect("/admin/categories")
    })
})

router.delete("/categories/:id" , (req,res)=>{
    categorySchema.deleteOne({_id:req.params.id}).then(()=>{
        res.redirect("/admin/categories")
    })
    
})

router.get("/posts", (req,res)=>{
    posts.find({}).populate({path:"category",model:categorySchema}).sort({$natural:-1}).then(posts =>{
       res.render("admin/posts",{posts:posts}); 
    })
    
})

router.delete("/posts/:id",(req,res)=>{
    posts.deleteOne({_id:req.params.id}).then(()=>{
        res.redirect("/admin/posts")
    })
})

router.get("/posts/edit/:id", (req,res)=>{
    posts.findOne({_id:req.params.id}).then(post =>{
        categorySchema.find({}).then(categories =>{
            res.render("admin/editpost",{post:post , categories:categories});
        })
    })
})

router.put("/posts/:id" , (req,res)=>{
    let post_image = req.files.post_image;
    post_image.mv(path.resolve(__dirname,'../../public/img/postimages' , post_image.name))

    posts.findOne({_id:req.params.id}).then(post=>{
        post.title = req.body.title,
        post.content = req.body.content,
        post.date = req.body.date,
        post.category = req.body.category,
        post.post_image = `/img/postimages/${post_image.name}`,
        post.save().then( post =>{
            res.redirect("/admin/posts")
        })

    })
})

module.exports = router