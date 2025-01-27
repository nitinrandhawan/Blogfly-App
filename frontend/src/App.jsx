import Navbar from "./components/navbar.component.jsx";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page.jsx";
import { createContext, useEffect, useState } from "react";
import { LookIntoSession } from "./common/session.jsx";
import Editor from "./pages/editor.pages.jsx";
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";
import SideNav from "./components/sidenavbar.component.jsx";
export const userContext=createContext({})

const App = () => {
const [userAuth, setuserAuth] = useState({})

const ReloadDataBySession=()=>{
  const userInSession= LookIntoSession('user')
userInSession ? setuserAuth(userInSession) : setuserAuth({accessToken:null})
}

useEffect(()=>{
  ReloadDataBySession()
},[])


  return (
    <>
    <userContext.Provider value={{userAuth,setuserAuth}}>
      <Routes>
        <Route path="/editor" element={<Editor/>}/>
        <Route path="/editor/:blog_id" element={<Editor/>}/>
        <Route path="/" element={<Navbar />} >
        <Route index element={<HomePage/>}/>
        <Route path="settings" element={<SideNav/>}>
<Route path="edit-profile" element={<h1>This is edit profile </h1>}/>
<Route path="change-password" element={<h1>This is change password </h1>}/>
        </Route>
        <Route path="signin" element={<UserAuthForm type={'sign-in'}/>} />
        <Route path="signup" element={<UserAuthForm type={'sign-up'}/>} />
        <Route path="search/:query" element={<SearchPage/>}/>
        <Route path="user/:id" element={<ProfilePage/>}/>
        <Route path="Blog/:blog_id" element={<BlogPage/>}/>
        <Route path="*" element={<PageNotFound/>}/>
        </Route>
      </Routes>
    </userContext.Provider>

    </>
  );
};

export default App;

