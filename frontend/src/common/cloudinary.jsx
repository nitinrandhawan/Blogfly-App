import axios from 'axios'
import toast from 'react-hot-toast';

export const uploadImage=async(img)=>{
    try {
        const response = await axios.post('https://blogfly-app-2.onrender.com/get-upload-url', img, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        return response.data
      } catch (error) {
        console.log('Error uploading the image', error);
        return toast.error("Up to 2MB is not allowed to upload");
      }
}