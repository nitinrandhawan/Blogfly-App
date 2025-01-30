import React, { useContext, useState } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "./nodata.component";
import CommentCard from "./comment-card.component";
import Loader from "./loader.component";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;
  
  await axios
    .post("https://blogfly-app-2.onrender.com/get-blog-comment", { blog_id, skip })
    .then(({ data }) => {
      console.log(data);
      
      data.map((comment) => {
        comment.childrenLevel = 0;
      });

      setParentCommentCountFun((preVal) => preVal + data.length);
      if (comment_array === null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });
  return res;
};

function CommentContainer() {
  let {BlogData,BlogData: {_id,title,activity:{total_parent_comments},comments: { results: commentsArr }},
    commentsWrapper,setBlogData,
    setcommentsWrapper,totalParentCommentsLoaded,settotalParentCommentsLoaded
  } = useContext(BlogContext);


  const handleLoadMoreComments=async()=>{
   
  let newCommentArr=  await fetchComments({blog_id:_id,skip:totalParentCommentsLoaded,setParentCommentCountFun: settotalParentCommentsLoaded,comment_array:commentsArr })
  
  setBlogData({...BlogData,comments:newCommentArr});
  
}
  return (
    <>
      {commentsWrapper ? (
        <div className="max-sm:w-full fixed top-0 sm:right-0 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden duration-1000 ">
          <div className="relative">
            <h1 className="text-xl font-medium">Comments</h1>
            <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
              {title}
            </p>
            <button
              className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
              onClick={() => setcommentsWrapper((preval) => !preval)}
            >
              <i className="fi fi-br-cross text-[17] mt-1 "></i>
            </button>
            <hr className="border-grey my-8 w-[120%] -ml-10" />
            <CommentField action="comment" />
          </div>
          {commentsArr && commentsArr.length ? (
            commentsArr.map((comment, i) => {
              console.log('comment',comment);
              
              return (
                <AnimationWrapper key={i}>
                   
                <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment}/>
                 
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message="No Comments" />
          )}
          {
total_parent_comments > totalParentCommentsLoaded ?
  <button className='text-dark-grey p-2 px-3 cursor-pointer hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={handleLoadMoreComments}>
  load more
      </button> : ""
          }
       
        </div>
      ) : ""}
    </>
  );
}

export default CommentContainer;
