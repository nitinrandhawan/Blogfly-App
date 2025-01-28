import React from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

function BlogPostCard({ content, index }) {
  let {
    banner,
    blog_id,
    des,
    publishedAt,
    title,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    tags,
    activity: { total_likes },
  } = content;

  return (
    <AnimationWrapper duration={1} delay={index * 0.1}>
      <Link
        to={`/Blog/${blog_id}`}
        className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
      >
        <div className="w-full">
          <div className="flex items-center gap-2">
            <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
            <p className="line-clamp-1">
              {fullname} @{username}
            </p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>
          <h1 className="blog-title">{title}</h1>
          <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:">
            {des}
          </p>
          <div className="flex gap-4 mt-7">
            <span className="btn-light py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <i className="fi fi-rr-heart"></i>
              {total_likes}
            </span>
          </div>
        </div>
        <div className="h-28 aspect-square bg-grey">
          <img
            src={banner}
            alt="banner"
            className="w-full h-full aspect-square object-cover"
          />
        </div>
      </Link>
    </AnimationWrapper>
  );
}

export default BlogPostCard;
