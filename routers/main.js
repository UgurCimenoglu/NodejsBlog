const express = require("express");
const router = express.Router();
const blogPosts = require("../model/post")
const Category = require("../model/category")
const user = require("../model/user")

router.get("/", (req,res)=>{
    console.log(req.session)
    res.render("site2/index")
})

router.get("/blog" , (req,res)=>{

    const postPerPage = 1
    const page = req.query.page || 1


    blogPosts.find({}).populate({path:'author',model:user}).sort({$natural:-1})
        .skip((postPerPage*page) - postPerPage)
        .limit(postPerPage)
        .then( posts =>{
        blogPosts.countDocuments().then(postCount =>{
            Category.aggregate([{
                $lookup:{
                    from:'posts',
                    localField:"_id",
                    foreignField:"category",
                    as:"posts"
                }
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    num_of_posts:{$size: '$posts'}
                }
            }
        ]).then(categories =>{
              res.render("site2/blog",{
                posts:posts , 
                categories:categories , 
                current:parseInt(page),
                pages:Math.ceil(postCount/postPerPage)})
            })
        })
       
    })
})  

router.get("/contact" , (req,res)=>{
    res.render("site2/contact")
})





module.exports = router