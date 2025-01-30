import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, {
  activeTabRef,
} from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component.jsx";
import MinimalBlogPost from "../components/nobanner-blog-post.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import { FilterPaginationData } from "../common/filter-pagination-data.jsx";
import { LoadMoreComponent } from "../components/load-more.component.jsx";
import BlogPostCard from "../components/blog-post.component.jsx";

function HomePage() {
  const [Blog, setBlog] = useState("");
  const [TrendingBlog, setTrendingBlog] = useState("");
  const [pageState, setPageState] = useState("home");

  let categories = [
    "cooking",
    "social media",
    "health",
    "tech",
    "fitness",
    "travel",
    "hollywood",
    "sport",
  ];

  const fetchedLatestBlogs = async ({page=1}) => {
    try {
      const {data} = await axios.post("https://blogfly-app-2.onrender.com/latest-blogs",{page});
      console.log(data);
      let formatedData= await FilterPaginationData({
        state:Blog,
        data:data,
        page,
        countRoute:"all-latest-blogs-count"
      })
      console.log(formatedData);
      setBlog(formatedData)
    } catch (error) {
      console.log("Fetched LatestBlogs error: ", error);
    }
  };

  
  const fetchedBlogsByCategory = async ({page=1}) => {
    try {
      const {data} = await axios.post("https://blogfly-app-2.onrender.com/search-blogs", {
        tag: pageState,page
      });
      let formatedData= await FilterPaginationData({
        state:Blog,
        data:data,
        page,
        countRoute:"search-blogs-count",
       data_to_send:{tag:pageState} 
      })
      console.log(formatedData);
      setBlog(formatedData);
    } catch (error) {
      console.log("Fetched LatestBlogs error: ", error);
    }
  };
  const fetchedTrendingBlogs = async () => {
    try {
      const Response = await axios.get("https://blogfly-app-2.onrender.com/trending-blogs");
      console.log("Trending blogs", Response.data.blogs);
      setTrendingBlog(Response.data.blogs);
    } catch (error) {
      console.log("Fetched TrendingBlogs error: ", error);
    }
  };

  useEffect(() => {
    if (pageState === "home") {
      fetchedLatestBlogs({page:1});
    } else {
      fetchedBlogsByCategory({page:1});
    }
    if (!TrendingBlog) {
      fetchedTrendingBlogs();
    }

    activeTabRef.current.click();
  }, [pageState]);

  // const handleFieldItem=async(e)=>{
  // console.log(e.target.innerHTML);
  // try {
  //   const filter = String(e.target.innerHTML);
  //   const Response=await axios.get('https://blogfly-app-2.onrender.com/latest-blogs',{ filter  })
  //   console.log(Response.data)
  //   setBlog(Response.data)
  //   console.log('filter',Blog);
  // } catch (error) {
  //   console.log('Fetched LatestBlogs error: ',error);
  // }
  // }

  const handleFieldItem = async (e) => {
    // try {
    //   const filter = String(e.target.innerHTML);
    //   const response = await axios.get('https://blogfly-app-2.onrender.com/latest-blogs', {
    //     filter: filter // Ensure filter is a valid string
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   console.log(response.data);
    //   setBlog(response.data);
    // } catch (error) {
    //   console.log('Fetched LatestBlogs error: ', error);
    // }
    let category = e.target.innerText.toLowerCase();
    console.log(category);
    setBlog(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          {/* {Latest Posts} */}
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
            {!Blog ? (
              <Loader />
            ) : Blog.results.length ? (
              Blog.results.map((blog, i) => {
                
                return <BlogPostCard content={blog} index={i} key={i} />;
              })

            ) 
            : 
            
            (
              <NoDataMessage message="No Blog Published" />
            )}
<LoadMoreComponent state={Blog} fectchDataFunc={pageState==='home'? fetchedLatestBlogs : fetchedBlogsByCategory}/> 
</>
            {!TrendingBlog ? (
              <Loader />
            ) : (
              TrendingBlog.length?
              TrendingBlog.map((blog, i) => {
                return <MinimalBlogPost blog={blog} index={i} key={i} />;
              })
              : <NoDataMessage message="No Trending Blogs"/>
            )}
           

          </InPageNavigation>
        </div>

        {/* {trending posts} */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      className={
                        "tag " +
                        (pageState == category
                          ? "bg-black text-white "
                          : "bg-grey")
                      }
                      key={i}
                      onClick={handleFieldItem}
                    >
                      {category.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending<i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

              {!TrendingBlog ? (
                <Loader />
              ) : (
                TrendingBlog.length?
                TrendingBlog.map((blog, i) => {
                  return <MinimalBlogPost blog={blog} index={i} key={i} />;
                })
                : <NoDataMessage message="No Trending Blogs"/>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
