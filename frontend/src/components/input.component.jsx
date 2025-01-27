import React, { useState } from 'react'

function InputBox({name,type,id,value,placeholder,icon}) {

    const [PasswordVisible, setPasswordVisible] = useState(false)
  return (
   <>
   <div className='relative w-full mb-4'>
<input type={type==='password'? PasswordVisible ? 'text' : 'password': type}
name={name}
placeholder={placeholder}
defaultValue={value}
id={id}
className='input-box'

/>

<i className={'fi '+ (icon) +" input-icon"}></i>

{
    type=='password'?
    <i className={'fi fi-rr-eye' +( !PasswordVisible ?'-crossed': '' )  +' input-icon left-[auto] right-4 cursor-pointer'} onClick={()=> setPasswordVisible(currentVal=>!currentVal)}></i>:""
}

   </div>
   </>
  )
}

export default InputBox