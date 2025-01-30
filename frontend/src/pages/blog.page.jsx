import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
import { getDay } from '../common/date'
import BlogInteraction from '../components/blog-interaction.component'
import { BlogContent } from '../components/blog-content.component'
import CommentContainer, { fetchComments } from '../components/comments.component'
import BlogPostCard from '../components/blog-post.component'

export const BlogPageStructure={
    "activity": {
      "total_likes": 0,
      "total_comments": 0,
      "total_reads": 0,
      "total_parent_comments": 0
    },
    "_id":"",
    "blog_id": "",
    "title": "",
    "banner": "",
    "des": "",
    "content": [
      {
        "time": "",
        "blocks": [
          {
            "id": "",
            "type": "",
            "data": {
              "text": ""
            }
          }
        ],
      }
    ],
    "tags": [
      "",
    ],
    "author": {
      "personal_info": {
        "fullname": "",
        "username": "",
        "profile_img": ""
      }
    },
    "comments": [],
    "draft": false,
    "publishedAt": "",
    "updatedAt": "",
  }

export  const BlogContext=createContext({})

function BlogPage() {
let {blog_id}=useParams()

const [BlogData, setBlogData] = useState(BlogPageStructure)
const [similarBlogs, setSimilarBlogs] = useState(BlogPageStructure)
const [Loading, setLoading] = useState(true)
const [isLiked, setisLiked] = useState(false)
const [commentsWrapper, setcommentsWrapper] = useState(false)
const [totalParentCommentsLoaded, settotalParentCommentsLoaded] = useState(0)

let {_id, title,banner,des,author:{personal_info:{profile_img,fullname,username: author_username}},tags,comments,content,publishedAt}=BlogData

const fetchBlogPageData=async()=>{
    try {      
      const {data}=await axios.post(`https://blogfly-app-2.onrender.com/get-blog`,{blog_id})
      console.log('blog page id',blog_id);
      console.log('blog.id',data._id);
      
      let FetchComments= await fetchComments({blog_id: data._id,setParentCommentCountFun: settotalParentCommentsLoaded})
      data.comments=FetchComments
      setBlogData(data)
      console.log(data);
      console.log('comment',FetchComments);
      
      setLoading(false)
      console.log('Check Blog id',BlogData._id);


   axios.post('https://blogfly-app-2.onrender.com/search-blogs',{tag: data.tags[0], limit:6,eliminate_blog: blog_id}).then(({data})=>{

      setSimilarBlogs(data)
    }).catch(err=>{console.log(err.message);
    })
      
    } catch (error) {
        console.log('error',error);
      setLoading(false)
    }
}

useEffect(()=>{
  resetStates()
    fetchBlogPageData()
},[blog_id])

const resetStates=()=>{
setBlogData(BlogPageStructure)
setSimilarBlogs(BlogPageStructure)
setLoading(true)
setisLiked(false)
setcommentsWrapper(false)
settotalParentCommentsLoaded(0)
}

  return (
<AnimationWrapper>

{
  Loading ? <Loader/> : 
  <BlogContext.Provider value={{BlogData,setBlogData,isLiked,setisLiked,commentsWrapper,setcommentsWrapper,totalParentCommentsLoaded,settotalParentCommentsLoaded}}>
    <CommentContainer/>
  <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
    <div className="mt-12"> 
      <h2>{title}</h2>
      <div className='flex max-sm:flex-col justify-between my-8'>
        <div className='flex gap-5 items-start'>
          <img src={profile_img}  className='w-12 h-12 rounded-full' />
          <p className='capitalize'>
            {fullname}
            <br />
            @
            <Link to={`/user/${author_username}`} className='underline'>{author_username}</Link>
          </p>
        </div>
        <p className='text-dark-grey opacit75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
      </div>
<BlogInteraction/>
    <img src={banner} className='aspect-video'/>
    </div>
<div className="my-12 font-gelasio blog-page-content">
  {
    content[0].blocks.map((block,i)=>{
      return <div key={i} className='my-4 md:my-8'>
        <BlogContent block={block}/>
      </div>
    })
  }
</div>
 
<BlogInteraction/>

{
  similarBlogs && similarBlogs.length ?
  <>
  <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar Blogs</h1> 
  {
    similarBlogs.map((blog,i)=>{
      return <AnimationWrapper key={i} transition={{duration:1 ,delay: i*0.08}}>
  <BlogPostCard content={blog} index={i} key={i} />

      </AnimationWrapper>
    })
  }
  </> :""
 }
  </div>
  </BlogContext.Provider>
}
</AnimationWrapper>

   

  )
}

export default BlogPage