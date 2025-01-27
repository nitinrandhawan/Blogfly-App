import React, { useEffect, useRef, useState } from 'react'

export let activeTabLineRef;
export let activeTabRef;

function InPageNavigation({routes,defaultHidden=[],defaultActiveIndex=0,children}) {
    const [InPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex)

   activeTabLineRef=useRef()
    activeTabRef=useRef()
    const OnChangeEvent=(btn,i)=>{
        
let {offsetWidth,offsetLeft}=btn
activeTabLineRef.current.style.width=offsetWidth + 'px';
activeTabLineRef.current.style.left=offsetLeft + 'px';
setInPageNavIndex(i)

    }

    useEffect(() => {
      OnChangeEvent(activeTabRef.current,defaultActiveIndex)
    }, [])
    
  return (
    <>
    <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
        {routes.map((route,i)=>{
            return (
                <button key={i} 
                ref={i===defaultActiveIndex? activeTabRef: null}
                className={'p-4 px-5 capitalize '+ (InPageNavIndex===i? 'text-black': 'text-dark-grey ') +(defaultHidden.includes(route)? 'md:hidden':' ')} onClick={(e)=>{OnChangeEvent(e.target,i)}}>
                    {route}
                </button>
            )
        })}
        <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300'/>
    </div>
    {Array.isArray(children)? children[InPageNavIndex]: children}
    </>

  )
}

export default InPageNavigation