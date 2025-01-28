import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { uploadImage } from "../common/cloudinary.jsx";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages.jsx";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component.jsx";
import axios from "axios";
import { userContext } from "../App.jsx";
function BlogEditor() {
  let { blog_id } = useParams();
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    TextEditor,
    setTextEditor,
    seteditorState,
  } = useContext(EditorContext);

  let navigate = useNavigate();

  let {
    userAuth: { accessToken },
  } = useContext(userContext);

  useEffect(() => {
    if (!TextEditor.isReady) {
      const editor = new EditorJS({
        holderId: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      });
      setTextEditor(editor);
    }
  }, [blog]);

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleBannerUpload = async (e) => {
    const img = e.target.files[0];
    if (!img) {
      console.log("No image selected");
      return;
    }
    const formData = new FormData();
    formData.append("image", img);

    if (img) {
      const LoadingToast = toast.loading("Uploading...");
      const { url } = await uploadImage(formData);

      if (url) {
        toast.dismiss(LoadingToast);

        setBlog({ ...blog, banner: url });

        toast.success("Uploaded Successfully");
      } else {
        toast.dismiss(LoadingToast);
      }
    }
  };
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handlePublishButton = () => {
    if (!banner.length) {
      return toast.error("Please Upload Blog Banner");
    }
    if (!title.length) {
      return toast.error("Write Blog Title to publish it");
    }

    if (TextEditor.isReady) {
      TextEditor.save()
        .then((data) => {
          if (data.blocks.length) {
            console.log(data);
            setBlog({ ...blog, content: data });
            console.log("content", content);
            seteditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write Title to publish Blog");
    }

    let LoadingPublish = toast.loading("Saving Draft...");
    e.target.classList.add("disable");

    if (TextEditor.isReady) {
      TextEditor.save().then(async (content) => {
        try {
          const Response = await axios.post(
            "http://localhost:8000/create-blog",
            {
              title,
              banner,
              des,
              content,
              tags,
              draft: true,
              id: blog_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log(Response.data);
          toast.dismiss(LoadingPublish);
          toast.success("Saved");
          e.target.classList.remove("disable");
          setTimeout(() => {
            navigate("/");
          }, 500);
        } catch ({ response }) {
          e.target.classList.remove("disable");

          toast.dismiss(LoadingPublish);

          return toast.error(response.data.error || "Something went wrong");
        }
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Toaster />
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishButton}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner.length ? banner : defaultBanner}
                  className="z-20"
                />
                <input
                  type="file"
                  id="uploadBanner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor;
