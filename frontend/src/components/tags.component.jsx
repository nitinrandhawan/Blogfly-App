import { useContext, useState } from "react";
import { EditorContext } from "../pages/editor.pages";

function Tag({ tag, tagIndex }) {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);
  const [hoverEffect, setHoverEffect] = useState(true);


  const handleDeleteEvent = (e) => {
    console.log(e);
    tags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags: tags });
  };



const AddEditable=(e)=>{
e.target.setAttribute("contentEditable",true)
e.target.focus()
setHoverEffect(true)
}

  const handleTagEdit = (e) => {
    if (e.keyCode === 13 || e.keyCode == 188) {
      e.preventDefault();
      let currentVal = e.target.innerText;
      tags[tagIndex] = currentVal;

      setBlog({ ...blog, tags });
      e.target.setAttribute("contentEditable", false);
    setHoverEffect(false)
    }
  };

 
  return (
    <div className={`relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block pr-8 ${hoverEffect? 'hover-opacity' : ''}`}
    >
      <p
        className="outline-none"
        contentEditable="true"
        onKeyDown={handleTagEdit}
        onClick={AddEditable}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleDeleteEvent}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>

    
  );
}

export default Tag;
