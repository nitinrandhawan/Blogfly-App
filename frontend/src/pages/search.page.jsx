import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation, {
  activeTabRef,
} from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import { LoadMoreComponent } from "../components/load-more.component.jsx";
import { FilterPaginationData } from "../common/filter-pagination-data";
import AnimationWrapper from "../common/page-animation";
import UserCard from "../components/usercard.component";
import BlogPostCard from "../components/blog-post.component.jsx";

function SearchPage() {
  let { query } = useParams();

  const [Blog, setBlog] = useState(null);
  const [Users, setUsers] = useState(null);

  const searchBlog = async ({ page = 1, create_new_arr = false }) => {
    try {
      const { data } = await axios.post("https://blogfly-app-2.onrender.com/search-blogs", {
        page,
        query,
      });
      console.log('serachBlog',data);
      let formatedData = await FilterPaginationData({
        state: Blog,
        data: data,
        page,
        countRoute: "search-blogs-count",
        create_new_arr,
        data_to_send: { query },
      });
      console.log(formatedData);
      setBlog(formatedData);
    } catch (error) {
      console.log("Fetched LatestBlogs error: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const { data: { users }} = await axios.post("https://blogfly-app-2.onrender.com/search-user", {query});
    
      setUsers(users);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    activeTabRef.current.click();
    resetState();
    searchBlog({ page: 1, create_new_arr: true });
    fetchUser();
  }, [query]);

  const resetState = () => {
    setBlog(null);
    setUsers(null);
  };
  const UserCardWrapper = () => {
    return (
      <>
        {!Users ? (
          <Loader />
        ) : Users.length ? (
          Users.map((user, i) => {
            return <AnimationWrapper key={i} transition={{duration:1,delay: i*0.08}}>
              <UserCard user={user}/>
            </AnimationWrapper>
          })
        ) : (
          <NoDataMessage message="No User Found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {!Blog ? (
              <Loader />
            ) : Blog.results.length ? (
              Blog.results.map((blog, i) => {
                return <BlogPostCard content={blog} index={i} key={i} />;
              })
            ) : (
              <NoDataMessage message="No Blog Published" />
            )}
            <LoadMoreComponent state={Blog} fectchDataFunc={searchBlog} />
          </>
          <>
            <UserCardWrapper />
          </>
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">

<h1 className="font-medium text-xl mb-8">Users related to search <i className="fi fi-rr-user mt-1"></i></h1>
<UserCardWrapper/>
      </div>
    </section>
  );
}

export default SearchPage;
