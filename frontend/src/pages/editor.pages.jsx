import React, { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublicForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import axios from "axios";

const blogStructure={
  title:'',
  banner:'',
  content:[],
  tags:[],
  des:'',
  author:{personal_info:{}}
}

export const EditorContext=createContext({})
function Editor() {

  let {blog_id}=useParams()

  const [blog,setBlog]=useState(blogStructure)
  const [editorState, seteditorState] = useState("editor");
  const [TextEditor, setTextEditor] = useState({isReady:false});
  const [loading,setLoading]=useState(true)

  // development code

  // let accessToken=true

  let {
    userAuth: { accessToken },
    setuserAuth,
  } = useContext(userContext);


useEffect(()=>{
  
if(!blog_id){
 return setLoading(false)
}

axios.post('http://localhost:8000/get-blog',{blog_id,draft:true,mode:'edit'})
.then(({data})=>{
  setBlog(data)
  setLoading(false)
})
.catch(err=>{
  console.log(err);
  
  setBlog(null)
  setLoading(false)
})

},[])

  return (
    <>
    <EditorContext.Provider value={{blog,setBlog,editorState,seteditorState,TextEditor,setTextEditor,}}>

      {!accessToken ? (
        <Navigate to="/signin" />
      ) :
      loading ? <Loader/>:
      editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublicForm />
      )}

    </EditorContext.Provider>

    </>
  );
}

export default Editor;
