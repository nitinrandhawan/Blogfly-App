import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

function BlogInteraction() {
  let {
    BlogData,
    BlogData: {
      _id,
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlogData,
    isLiked,
    setisLiked,
    setcommentsWrapper
  } = useContext(BlogContext);

  let {
    userAuth: { username, accessToken },
  } = useContext(userContext);

  const handleLikeBtn = () => {
    if (accessToken) {
      axios
        .post(
          "http://localhost:8000/like-blog",
          { _id, isLikedByUser: isLiked },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {})
        .catch((err) => {
          console.log("liked blog error", err);
        });

      setisLiked((prev) => !prev);
      console.log(isLiked);
      !isLiked ? total_likes++ : total_likes--;
      setBlogData({ ...BlogData, activity: { ...activity, total_likes } });
    } else {
      return toast.error("please login to like the blog");
    }
  };

  useEffect(() => {
    if (accessToken) {
      axios
        .post(
          `http://localhost:8000/isliked-by-user`,
          { _id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setisLiked(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <div className="flex gap-3 items-center">
            <button
              className={
                "w-10 h-10 rounded-full flex items-center justify-center " +
                (!isLiked ? "bg-grey/80" : "bg-red/20 text-red")
              }
              onClick={handleLikeBtn}
            >
              <i
                className={"fi " + (isLiked ? "fi-sr-heart" : "fi-rr-heart")}
              />
            </button>
            <p className="text-xl text-dark-grey">{total_likes} </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={()=> setcommentsWrapper(preval=> !preval)}>
              <i className="fi fi-rr-comment-dots" />
            </button>
            <p className="text-xl text-dark-grey">{total_comments}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl  hover:text-twitter" />
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
}

export default BlogInteraction;
