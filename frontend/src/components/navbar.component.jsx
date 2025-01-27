import React, { useContext, useState } from 'react'
import logo from '../imgs/logo.png'
import { Link , useNavigate, Outlet} from 'react-router-dom'
import { userContext } from '../App';
import UserNavigationPanel from './user-navigation.component';



function Navbar() {
const [showSearchBar, setshowSearchBar] = useState(false)
const [navBarPanel, setnavBarPanel] = useState(false)
console.log('showSearch',showSearchBar);
const {userAuth,userAuth:{accessToken,profile_img}} = useContext(userContext)
console.log('navBarPanel',navBarPanel);
const handleNavBarPanel=()=>{
  setnavBarPanel((prevVal) => !prevVal)
}

let navigate=useNavigate()
const handleBlur=()=>{
  setTimeout(() => {
    
    setnavBarPanel(false)
  }, 200);
}

const handleSearch=(e)=>{
  let query=e.target.value
if(e.keyCode===13 && query.length){
 navigate(`/search/${query}`)
}

}
  return (
    <>
   <nav className='navbar'>
 <Link to="/" className='flex-none w-10 ' >
        <img src={logo} alt="logo" className='w-full' />
 </Link>
  

  <div className={'absolute top-full bg-white w-full left-0 mt-0.5 border-b border-grey py-4 px-[5vw] md:block md:border-0 md:relative md:inset-0 md:p-0 md:show md:w-auto '+ (showSearchBar ? 'show' :  'hide' )} >
    <input type="text"
     placeholder='search'
     onKeyDown={handleSearch}
     className='rounded-full w-full md:w-auto bg-grey p-4 pl-6  pr-[12%] md:pr-6 placeholder:text-dark-grey md:pl-16'
     />

     <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
  </div>

<div className="flex item-center  gap-3 md:gap-6 ml-auto" onClick={()=> setshowSearchBar(currentVal => !currentVal)} onBlur={handleBlur}>
  <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'>
    <i className='fi fi-rr-search text-xl'></i></button>

    <Link to={'/editor'} className='hidden md:flex gap-2 link'>
    <i className='fi fi-rr-file-edit'></i>
    <p>write</p>
    </Link>
    {
      userAuth && accessToken ? 
      <>
      <Link to="/dashboard/notification" >
        <button className='w-12  h-12 rounded-full bg-grey relative hover:bg-black/10 '>
<i className='fi fi-rr-bell text-2xl block mt-1'></i>

        </button>
</Link>
<div className="relative" onClick={handleNavBarPanel}>
<button className='w-12  h-12 mt-1 '>
<img src={profile_img} alt="" className='object-cover w-full h-full rounded-full'/>

        </button>
     { navBarPanel  ?  <UserNavigationPanel/> : ''}
</div>
</>
     
    :
    <>
<Link to="/signin" className='btn-dark py-2'>
sign In
</Link>
<Link to="/signup" className='btn-light hidden md:block py-2'>
sing up
</Link>
</>

}

</div>
   </nav>
<Outlet/>
   </>

  )
}

export default Navbar