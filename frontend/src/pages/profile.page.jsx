import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/loader.component'
import AnimationWrapper from '../common/page-animation'
import { userContext } from '../App'
import AboutUser from '../components/about.component'
import { FilterPaginationData } from '../common/filter-pagination-data'
import NoDataMessage from '../components/nodata.component'
import { LoadMoreComponent } from '../components/load-more.component'
import InPageNavigation from '../components/inpage-navigation.component'
import BlogPostCard from '../components/blog-post.component'

export const ProfileDataStructure={
    "personal_info": {
      "fullname": "",
      "username": "",
      "bio": "",
      "profile_img": ""
    },
    "social_links": {
      "youtube": "",
      "instagram": "",
      "facebook": "",
      "twitter": "",
      "github": "",
      "website": ""
    },
    "account_info": {
      "total_posts": 0,
      "total_reads": 0
    },
    "joinedAt":""
  }


function ProfilePage() {
let {id : profile_id}=useParams()
const [ProfileData, setProfileData] = useState(ProfileDataStructure)
const [Loading, setLoading] = useState(true)
const [blogs, setBlogs] = useState(null)
const [profileLoaded, setprofileLoaded] = useState('')

let {userAuth:{username}}=useContext(userContext)

let {personal_info:{fullname,bio,username: profile_username,profile_img},account_info:{total_posts,total_reads},social_links
,joinedAt}=ProfileData


const fetchUserProfile=async()=>{
    try {
      let {data}=  await axios.post('http://localhost:8000/search-profile',{username:profile_id})
      console.log(data);
      setProfileData(data)
      setprofileLoaded(profile_id)
      getBlogs({user_id: data._id })
      setLoading(false)
      
    } catch (error) {
        console.log('error',error);
    }
}

const getBlogs=({page = 1,user_id}) =>{
  user_id= user_id===undefined ? blogs.user_id : user_id;

  axios.post('http://localhost:8000/search-blogs',{author:user_id,
    page,limit:6
  }).then(async ({data})=>{
    console.log('data',data);
    
    let formatedData= await FilterPaginationData({
      state: blogs,
      data: data,
      page,
      countRoute: "search-blogs-count",
      data_to_send: { author: user_id}
    })
    formatedData.user_id = user_id
    console.log(formatedData);
    
    setBlogs(formatedData)
  })

}

useEffect(()=>{
  if(profileLoaded!==profile_id){
    setBlogs(null)
  }
  if(blogs=== null){
    resetData()
    fetchUserProfile()
  }
},[profile_id,blogs])


const resetData=()=>{
    setProfileData(ProfileDataStructure)
    setLoading(true)
    setBlogs(null)
}

  return (
    <>

    <AnimationWrapper>

  {
      Loading ? <Loader/>: 
      <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
<div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50% md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10" >
<img src={profile_img} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' />
<h1 className='text-2xl font-medium'>@ {profile_username}</h1>
<p className='text-xl capitalize h-6'>{fullname}</p>
<p> {total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads </p>
<div className='flex gap-4 mt-2'>
    {
 profile_username === username ? 
    <Link to={"/setting/edit-profile"} className='btn-light rounded-md'>Edit Profile</Link> : ""
    }
</div>


<AboutUser className={"max-md:hidden"} bio={bio} social_links={social_links} joinedAt={joinedAt}/>

</div>
<div className="max-md:mt-12 w-full">
<InPageNavigation
            routes={["Blog Published", "About"]}
            defaultHidden={["About"]}
          >
            <>
            {!blogs ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                return <BlogPostCard content={blog} index={i} key={i} />;
              })

            ) 
            : 
            
            (
              <NoDataMessage message="No Blog Published" />
            )}
<LoadMoreComponent state={blogs} fectchDataFunc={getBlogs}/> 
</>
          <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt}/>
           

          </InPageNavigation>
</div>
      </section>
    }
    
    </AnimationWrapper>
    </>
  )
}

export default ProfilePage