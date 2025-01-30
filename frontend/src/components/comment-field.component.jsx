import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { userContext } from "../App";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

function CommentField({ action,index=undefined,replyingTo=undefined,setReplying,setloading = undefined }) {
  const {
    userAuth: { accessToken, username, fullname, profile_img },
  } = useContext(userContext);

  let {
    BlogData,
    setBlogData,
    BlogData: {
      _id: blog_id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    settotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [comment, setcomment] = useState("");
const handleCommentKeyDown=(e)=>{ 
  if(e.key==="Enter" && e.shiftKey === false){
handleComment()
 }
  
}

  const handleComment = () => {
    
    if (!accessToken) {
      return toast.error("Login first to leave a comment");
    }
    if (!comment || !comment.length ) {
      return toast.error("Write something to leave a comment");
    }
else if(comment.trim() !== ""){
 setloading ? setloading(true) :""
  axios
  .post(
    "https://blogfly-app-2.onrender.com/add-comment",
    { blog_id, blog_author, comment : comment.trim(),replying_to:replyingTo },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  .then(({ data }) => {
   
   setloading ? setloading(false) :""
    setcomment("");
    data.commented_by = {
      personal_info: { username, fullname, profile_img },
    };

    let newCommentArr;

    if(replyingTo){
commentsArr[index].children.push(data._id);
data.childrenLevel= commentsArr[index].childrenLevel + 1;
data.parentIndex=index;
commentsArr[index].isReplyloaded = true;
commentsArr.splice(index + 1,0,data)
newCommentArr = commentsArr
setReplying(false)
console.log('commented Arr from field',commentsArr);
console.log('data Arr from field',data);

    }else{
      data.childrenLevel = 0;

      newCommentArr = [data, ...commentsArr];
    }
   

    let parentCommentIncrementVal = replyingTo ? 0 : 1;

    setBlogData({
      ...BlogData,
      comments: { ...comments, results: newCommentArr },
      activity: {
        ...activity,
        total_comments: total_comments + 1,
        total_parent_comments:
          total_parent_comments + parentCommentIncrementVal,
      },
    });

    settotalParentCommentsLoaded(
      (prev) => prev + parentCommentIncrementVal
    );
    console.log("comment data", data);
  })
  .catch((err) => {
    console.log("blog_id", blog_id);

    console.log(err);
  });
}
   
  };


  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onKeyDown={handleCommentKeyDown}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        onChange={(e) => setcomment(e.target.value)}
      ></textarea>
      <button className={"mt-5 px-10 " + (comment.trim()===""? "btn-light": "btn-dark")} onClick={handleComment} >
        {action}
      </button>
      
    </>
  );
}

export default CommentField;
