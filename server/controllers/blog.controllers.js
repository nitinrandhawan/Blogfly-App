import { nanoid } from "nanoid";
import User from "../Schema/User.js";
import Blog from "../Schema/Blog.js";
import Notification from "../Schema/Notification.js";

const createBlog = (req, res) => {
  let authorId = req.user;

  let { title, des, banner, tags, content, draft,id } = req.body;
  if (!title.length) {
    return res.status(401).json({
      Error: "Must provid blog title to publish",
    });
  }
  if (!des || des.length > 200) {
    return res.status(401).json({
      Error: "Write description under 200 letters",
    });
  }
  if (!banner.length) {
    return res.status(401).json({
      Error: "Upload banner is publish blog",
    });
  }
  if (!tags.length || tags.length > 10) {
    return res.status(401).json({
      Error: "Add tags and It cannot be Maximum 10 tags",
    });
  }

  if (!content.blocks.length) {
    return res.status(401).json({
      Error: "There must be some blog content to publish it ",
    });
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =title.replace(/[^a-zA-z0-9]/g, " ").replace(/\s+/g, "-") + nanoid();
  console.log(blog_id);

  if(id){
Blog.findOneAndUpdate({blog_id: id},{title, des, banner, tags, content, draft: draft ? draft : false}).then(()=>{
  return res.status(200).json({id})
}).catch(err=>{
  return res
  .status(500)
  .json({ error: err.message });
})
  }else{
    let blog = new Blog({
      title,
      des,
      banner,
      tags,
      content,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });
  
    blog
      .save()
      .then(async (blog) => {
        let incrementVal = draft ? 0 : 1;
  
        await User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        )
          .then((user) => {
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            console.error(err);
            return res
              .status(500)
              .json({ error: "failed to update posts number" });
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.message });
      });
  }

};

const LatestBlogs = (req, res) => {
  let { page } = req.body;
  let maxLimit = 10;

  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .skip((page - 1) * maxLimit)
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json(blogs);
    })
    .catch((err) => {
      console.log("error", err);
      return res.status(500).json({ error: err.message });
    });
};

const AllLatestBlogsCount = (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
};

const TrendingBlogs = (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.username personal_info.fullname personal_info.profile_img -_id"
    )
    .sort({
      "activity.total_likes": -1,
      "activity.total_reads": -1,
      publishedAt: -1,
    })
    .limit(5)
    .select("blog_id title publishedAt -_id")
    .then((blogs) => {
      res.status(200).json({ blogs });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const SearchBlogs = (req, res) => {
  let { tag, page, query, author,limit, eliminate_blog } = req.body;
  let maxLimit = limit ? limit : 2;
  console.log(tag);
  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id:{$ne: eliminate_blog} };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  }
  else if(author){
    findQuery={author,draft:false}
  }
  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .skip((page - 1) * maxLimit)
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json(blogs);
    })
    .catch((err) => {
      console.log("error", err);
      return res.status(500).json({ error: err.message });
    });
};
const SearchBlogsCount = (req, res) => {
  let { tag, query,author } = req.body;

  let findQuery;
  if (tag) {
    findQuery = { tags: tag, draft: false };
  }
  if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } 
   if(author){
    findQuery={author,draft:false}
  }
  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
};

const SearchUsers = (req, res) => {
  let { query } = req.body;
  User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(50)
    .select(
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

const SearchProfile = (req, res) => {
  let { username } = req.body;

  User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -blogs -google_auth _id -updatedAt")
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const GetBlog = (req, res) => {
  let {blog_id} = req.body;
  let Increment = 1;
  Blog.findOneAndUpdate(
    { blog_id, draft: false },
    { $inc: { "activity.total_reads": Increment } }
  ).select('-comments')
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname _id"
    )
    .then((blog) => {
   
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": Increment } }
      ).catch((err) => {
        return res.status(500).json({ error: err.message });
      });

      
      return res.status(200).json(blog);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const LikeBlog=(req,res)=>{
let user_id=req.user;
let {_id,isLikedByUser}=req.body;

let incrementVal= !isLikedByUser ? 1 : -1

Blog.findOneAndUpdate({_id},{$inc: {"activity.total_likes": incrementVal}}).
then(blog=>{
  if(!isLikedByUser){
   let like= new Notification({
      "type": "like",
      "blog": _id,
      "user": user_id,
      "notification_for": blog.author
    })

  like.save().then(notification=>{
    return res.status(200).json({"likedByUser": true})
  })
  }else{
  Notification.findOneAndDelete({blog:_id,type:"like",user:user_id}).then(blog=>{
    return res.status(200).json({"likedByUser": false})
  }).catch(err=>{
    console.log(err.message);
    
  })
}
}).catch(err=>{
  console.log(err.message);
  
})
}

const isLikedByUser=(req,res)=>{
  let user_id=req.user;
  let {_id}=req.body;
Notification.exists({user:user_id,blog: _id, type:"like"}).then(result=>{
  res.status(200).json({result})
}).catch(err=>{
  console.log(err.message);
  
})
}
export {
  createBlog,
  LatestBlogs,
  TrendingBlogs,
  SearchBlogs,
  AllLatestBlogsCount,
  SearchBlogsCount,
  SearchUsers,
  SearchProfile,
  GetBlog,
  LikeBlog,
  isLikedByUser
};
