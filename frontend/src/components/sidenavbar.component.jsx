import { useContext, useRef, useState } from "react"
import { Navigate, NavLink, Outlet } from "react-router-dom"
import { userContext } from "../App"

const SideNav=()=>{
    let {userAuth:{accessToken}}=useContext(userContext)
   let path= location.pathname.split("/")[2]
    let [pageState,setPageState]=useState(path.replace("-"," "));
    const [sideBarIcon, setsideBarIcon] = useState(false)
    let activeTabLine=useRef()
let sideBarIconTab=useRef()
let pageStateTab=useRef()

const changePageStateTab=(e)=>{

    let {offsetWidth,offsetLeft}=e.target;
    activeTabLine.current.style.width=offsetWidth + "px"
    activeTabLine.current.style.left=offsetLeft + "px"
if(e.target===sideBarIconTab){
    setsideBarIcon(true)
}else{
    setsideBarIcon(false)
    // pageStateTab.current.click()
}

}
return (
   accessToken === null ? <Navigate to='/signin'/> :
       <>
<section className="relative flex max-md:flex-col gap-10 py-0 m-0 ">
    <div className="sticky top-[80px] z-30">
        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
            <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageStateTab}><i className="fi fi-rr-bars-staggered pointer-events-none"></i></button>
            <button ref={pageStateTab} className="p-5 capitalize " onClick={changePageStateTab}>{pageState}</button>
            <hr ref={activeTabLine} className="absoulte bottom-0 duration-500 bg-red w-8" />
        </div>
        <div className="min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100% + 80px)] max-md:px-16 max-md:ml-7 duration-500 ">
            <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />
            <NavLink to='/dashboard/blogs' onClick={(e)=> setPageState(e.target.innerText)} className={"sidebar-link"}>
            <i className="fi fi-rr-document"></i>
            Blogs</NavLink>
            <NavLink to='/dashboard/notification' onClick={(e)=> setPageState(e.target.innerText)} className={"sidebar-link"}>
            <i className="fi fi-rr-bell"></i>
            Notification</NavLink>
            <NavLink to='/editor' onClick={(e)=> setPageState(e.target.innerText)} className={"sidebar-link"}>
            <i className="fi fi-rr-file-edit"></i>
            Write</NavLink>
            <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
            <hr className="border-grey -ml-6 mb-8 mr-6" />
            <NavLink to='/settings/edit-profile' onClick={(e)=> setPageState(e.target.innerText)} className={"sidebar-link"}>
            <i className="fi fi-rr-user"></i>
            Edit Profile</NavLink>
            <NavLink to='/settings/change-password' onClick={(e)=> setPageState(e.target.innerText)} className={"sidebar-link"}>
            <i className="fi fi-rr-lock"></i>
            Change Password</NavLink>
        </div>
    </div>
    <div className="max-md:-mt-8 mt-5 w-full">

    <Outlet/>
       </div>
</section>
       
    </>
   
    

)
}
export default SideNav