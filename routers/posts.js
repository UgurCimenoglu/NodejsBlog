const express = require("express");
const router = express.Router();
const post = require("../model/post");
const path = require("path");
const Category = require("../model/category");
const user = require("../model/user")

router.get("/new", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  } else {
    Category.find({}).then(categories =>{
      res.render("site2/addpost" , {categories:categories})
    })
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res)=> {
  if (req.query.search) {
     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
     post.find({ "title": regex }).sort({$natural:-1}).populate({path:"author" , model:user}).then(posts =>{
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
    res.render("site2/blog" , {posts:posts , categories:categories})
  })
     }); 
  }
})

router.get("/category/:categoryId" , (req,res)=>{
  post.find({category:req.params.categoryId}).sort({$natural:-1}).populate({path:"category" , model:Category , path:"author", model:user}).then(posts =>{
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
res.render("site2/blog",{posts:posts , categories:categories})
})
  })
})


router.post("/test", (req, res) => {
  let post_image = req.files.post_image;
  post_image.mv(
    path.resolve(__dirname, "../public/img/postimages", post_image.name)
  );
  post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
    author: req.session.userId
  });

  req.session.sessionFlash = {
    type: `alert alert-success`,
    message: `Gönderi Başarılı Bir Şekilde Eklendi.`,
  };

  res.redirect("/blog");
});


router.get("/:id", (req, res) => {
  post.findById(req.params.id).populate({path:'author', model:user }).then((postsingle) => {
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
      post.find({}).populate({path:'author' , model:user}).sort({$natural:-1}).then( posts =>{
        res.render("site2/postsingle", { postsingle: postsingle , categories:categories , posts:posts});
      })
      
    })
    
  });
});

module.exports = router;
