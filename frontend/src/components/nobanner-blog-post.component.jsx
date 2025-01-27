import React from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { getDay } from "../common/date";

function MinimalBlogPost({ blog, index }) {
  let {
    blog_id: id,
    title,
    publishedAt,
    author: {
      personal_info: { fullname, username, profile_img },
    },
  } = blog;

  return (
    <AnimationWrapper>
      <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
        <h1 className="blog-index">{index < 9 ? "0" + (index + 1) : index + 1}</h1>
        <div>
          <div className="flex items-center gap-2">
            <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
            <p className="line-clamp-1">
              {fullname} @{username}
            </p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>
          <h1 className="blog-title">{title}</h1>
        </div>
      </Link>
    </AnimationWrapper>
  );
}

export default MinimalBlogPost;
