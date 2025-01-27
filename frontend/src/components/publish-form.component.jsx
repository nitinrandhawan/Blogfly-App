import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Toaster,toast } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import Tag from './tags.component'
import axios from 'axios'
import { userContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
function PublicForm() {
  let CharacterLimit = 200;
  let tagLimit=10
  let {blog_id}= useParams()

let {blog,blog:{banner,title,des,tags,content},seteditorState,setBlog}=useContext(EditorContext)

let {userAuth:{accessToken}}=useContext(userContext)
let navigate=useNavigate()

  const handleCloseEvent=()=>{
seteditorState("editor")
  }

  const handleBlogTitle=(e)=>{
    console.log(e);
    let input=e.target
setBlog({...blog, title: input.value})
  }

  function handleBlogDes(e) {
    setBlog({...blog,des: e.target.value})
  }
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const handleKeyDown=(e)=>{
if(e.keyCode===13 || e.keyCode===188){
  e.preventDefault()
  let tagVal=e.target.value
  if(tags.length < tagLimit ){
if(!tags.includes(tagVal) && tagVal.length){
  setBlog({...blog,tags:[...tags,tagVal]})
}
}else{
  toast.error(`You can only add max tags: ${tagLimit}`)
}
e.target.value= ""
}
  }

  const handlePublishBtn=async(e)=>{
    if(e.target.className.includes("disable")){
      return;
    }
   if(!title.length){
    return toast.error("Write Title to publish Blog")
   }
   if(!des.length || des.length > CharacterLimit){
return toast.error("Write description, within 200 words to publish Blog")
   }
   if(!tags.length){
    return toast.error("Add atleast 1 Tag to help us ranking your post")
   }
   let LoadingPublish= toast.loading("Publishing...")
e.target.classList.add("disable")

try {
  const Response=await axios.post("http://localhost:8000/create-blog",{
    title,banner,des,content,tags,draft:false,id: blog_id
  },{
    headers:{
      'Authorization':`Bearer ${accessToken}`
    }
  })
  
toast.dismiss(LoadingPublish)
toast.success("Published")
e.target.classList.remove('disable')
setTimeout(() => {
  navigate('/')
}, 500);

  
} catch (error) {
toast.dismiss(LoadingPublish)
 console.log('publish request error: ',error); 
 console.log(error.response.data.error);
return toast.error(error.response.data.error || "Something went wrong")
}
  }
  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <Toaster/>
        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}>
          <i className='fi fi-br-cross'></i>
        </button>
        <div className='max-w-[550px] center'>
          <p className="text-dark-grey mb-1">Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} alt="" />
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
          </div>
          <div className='border-grey lg:border-1 lg:pl-8'>
            <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
            <input type="text" placeholder='Blog Title'  defaultValue={title} className='input-box pl-4' onChange={handleBlogTitle}/>

            <p className='text-dark-grey mb-2 mt-9'>Short Description about your blog</p>
           <textarea maxLength={CharacterLimit} defaultValue={des} className='h-40 resize-none leading-7 input-box pl-4' onChange={handleBlogDes} onKeyDown={handleTitleKeyDown}></textarea>
           <p className='mt-1 text-dark-grey text-sm text-right'>{CharacterLimit - des.length} characters left</p>
           <p className='text-dark-grey mb-2 mt-9'>Topic - ( Helps is searching and ranking your blog post )</p>
           <div className='relative input-box pl-2 py-2 pb-4'>
            <input type="text" placeholder='Topic' className='sticky input-box bg-white placeholder:opacity-70 top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={handleKeyDown} />
         
          {
            tags.map((tag,i)=>{
return <Tag tag={tag} tagIndex={i} key={i}/>
            })
          }
           </div>
           <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit - tags.length} Tags left</p>
           <button className='btn-dark px-8' onClick={handlePublishBtn}>Publish</button>
          </div>

      
      </section>
    </AnimationWrapper>
  )
}

export default PublicForm