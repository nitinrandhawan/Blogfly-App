import React, { useContext, useState } from "react";
import { getDay } from "../common/date";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import Loader from "./loader.component";
import AnimationWrapper from "../common/page-animation";
import { userContext } from "../App";

function CommentCard({ index, leftVal, commentData }) {
  let {
    _id,
    commented_by: {
      personal_info: { profile_img, fullname, username: commented_by_user},
    },
    commentedAt,
    comment,
    children
  } = commentData;

  let {BlogData,BlogData: {activity,activity:{total_comments,total_parent_comments},comments,comments:{results: commentsArr},author:{personal_info:{username: blog_author}}},setBlogData,settotalParentCommentsLoaded} = useContext(BlogContext)

  let {userAuth:{accessToken,username}}=useContext(userContext)

const [isReplying, setisReplying] = useState(false)
const [loading, setloading] = useState(false)
const handleReplyClick=()=>{
    setisReplying(prev => !prev)
}
  const formattedComment = comment.replace(/\n/g, "<br/>");

  const getParentIndex=()=>{
    let startingPoint=index -1
    try {
      while(commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel){
        startingPoint--
      }
    } catch  {
      startingPoint = undefined;
    }
    return startingPoint
  }

  const removeCommentsCard=(startingPoint,isDelete=false)=>{
    if(commentsArr[startingPoint]){
    while(commentsArr[startingPoint].childrenLevel > commentData.childrenLevel ){
      commentsArr.splice(startingPoint ,1)

      if(!commentsArr[startingPoint]){
        break;
      }
    }}

    if(isDelete){
      let parentIndex=getParentIndex()
      if(parentIndex !== undefined){
        commentsArr[parentIndex].children =commentsArr[parentIndex].children.filter(child => child!== _id)
        if(!commentsArr[parentIndex].children.length){
          commentsArr[parentIndex].isReplyloaded= false
        }
      }
      commentsArr.splice(index , 1)
    }
    if(commentData.childrenLevel===0 && isDelete){
      settotalParentCommentsLoaded(prev => prev -1)
    }
    setBlogData({...BlogData,comments:{results: commentsArr},activity:{...activity,total_parent_comments:(commentData.childrenLevel===0 && isDelete ? -1 : 0)}})

  }

const loadReplies=({skip=0,currentIndex=index})=>{
hideReplies()
setloading(true)
if(commentsArr[currentIndex].children.length){
  axios.post("https://blogfly-app-2.onrender.com/get-replies",{_id: commentsArr[currentIndex]._id,skip})
.then(({data:{replies}})=>{
  console.log('replies',replies);
  
 commentsArr[currentIndex].isReplyloaded= true;

 for (let i = 0; i < replies.length; i++) {
  replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;
  commentsArr.splice(currentIndex + 1 + i + skip,0,replies[i])
 }
 setloading(false)
  setBlogData({...BlogData,comments:{...comments,results: commentsArr}})
})
.catch(err=>{
  console.log(err);
  
})
}

}

  const hideReplies=()=>{
    commentData.isReplyloaded = false;
    removeCommentsCard(index + 1)
  }

  const deleteComment=(e)=>{
e.target.setAttribute("disabled",true)
console.log('clicked');
axios.post('https://blogfly-app-2.onrender.com/delete-comment',{_id},{
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}).then(({data})=>{
e.target.removeAttribute("disabled",false)
 
  removeCommentsCard(index + 1,true)
  
}).catch(err=>console.log(err)
)

  }

  const LoadMoreRepliesBtn=()=>{
    let parentIndex=getParentIndex()
    let button=<button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={()=> loadReplies({skip:(index - parentIndex),currentIndex: parentIndex})}>Load More Replies</button>

    if(commentsArr[index + 1]){
      if(commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel){
        if( commentsArr[parentIndex].children.length > (index - parentIndex) ){
          return button;
        }
       }
    } else{
    if(parentIndex){
      if( commentsArr[parentIndex].children.length > (index - parentIndex) ){
        return button;
      }
    }
   }
  }
  
  return (
    <AnimationWrapper>

    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{commented_by_user}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>
        <p
          className="font-gelasio text-xl ml-3"
          dangerouslySetInnerHTML={{ __html: formattedComment }}
        ></p>
        <div className="flex gap-5 items-center mt-5">
        <button className="underline" onClick={handleReplyClick}>Reply</button>
        {children.length ?
          commentData.isReplyloaded ?
          <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}>
            <i className="fi fi-rs-comment-dots"></i>
            <span>Hide Reply</span></button>:
             <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReplies}>
              <i className="fi fi-rs-comment-dots"></i>
              {children.length} <span>Reply</span>
             </button> 
             : ""
        }
        {
          username === commented_by_user || username === blog_author ?
          <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/50 flex items-center" onClick={deleteComment}>
            <i className="fi fi-rr-trash pointer-events-none"></i>
          </button>: ""
        }
        </div>
       {
        loading ? <Loader width={'w-6'} height={'w-6'}/> : ""
       }
{
    isReplying ?
    <div className="mt-8">
    <CommentField action='reply' index={index} setReplying={setisReplying} replyingTo={_id} setloading={setloading}/>
   </div>: ""
}
      
      </div>
      <LoadMoreRepliesBtn/>
    </div>
    </AnimationWrapper>

  );
}

export default CommentCard;
