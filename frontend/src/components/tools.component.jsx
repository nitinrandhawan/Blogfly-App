import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Marker from "@editorjs/marker";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/cloudinary";

const uploadImageByUrl=(e)=>{
let link= new Promise((resolve,reject)=>{
try {
    resolve(e)
} catch (error) {
    reject(error)
}
})
return link.then(url=>{
    return {
        success: 1,
        file: {url}
    }
})

}

const uploadImageByFile=async(e)=>{
  const formData = new FormData();
  formData.append("image", e);
return await uploadImage(formData).then(({url})=>{
  console.log(url);
  if(url){
    return {
      success:1,
      file:{url}
    }
  }
})
}

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
      uploadByUrl: uploadImageByUrl,
      uploadByFile: uploadImageByFile,
       }
      },
    },

  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};


