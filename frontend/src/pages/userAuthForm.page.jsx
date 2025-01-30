import React, { useContext } from "react";
import InputBox from "../components/input.component";
import { Link } from "react-router-dom";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { StoreSession } from "../common/session.jsx";
import { userContext } from "../App.jsx";
import { Navigate } from "react-router-dom";
import { authWithGoogle } from "../common/firebase.jsx";
function UserAuthForm({ type }) {
  const {
  userAuth,  userAuth: { accessToken },
    setuserAuth,
  } = useContext(userContext);
  console.log(accessToken);

  const sendDataToServer = (route, data) => {
    axios
      .post(`https://blogfly-app-2.onrender.com/${route}`, data)
      .then(function ({ data }) {
        
        StoreSession("user", data);
        console.log('accessTokenData',data);
      console.log('userAuth',userAuth);
      
        setuserAuth(data);
      })
      .catch(function ({ response }) {
        console.log(response);
        if (response.data.message) {
          return toast.error(response.data.message);
        }
        if (response.data.error) {
          return toast.error(response.data.error);
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    const form = new FormData(formElement);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { fullname, password, email } = formData;
    console.log(formData);
    if (fullname) {
      if (!email || !password) {
        return toast.error("All fields are required");
      }
    }
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    if (!emailRegex.test(email)) {
      return toast.error("email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must have 6 to 20 characters as well as alteat 1 lowercase,1 uppercase and a numeric"
      );
    }
    sendDataToServer(type, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoute = "google-auth";
        let formData = {
          accessToken: user.accessToken,
        };
        sendDataToServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Trouble Login through Google");
        return console.log(err);
      });
  };

// Development Code
// let accessToken2=true

// producation virable is accessToken
  return (
    <>
      {accessToken ? (
        <Navigate to="/" />
      ) : (
        <AnimationWrapper keyValue={type}>
          <Toaster />
          <section className="h-cover flex items-center justify-center ">
            <form id="formElement" className="w-[80%] max-w-[400px]">
              <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                {type == "sign-in" ? "Welcome Back" : "Join us today"}
              </h1>
              {type === "sign-up" ? (
                <InputBox
                  name="fullname"
                  type="text"
                  placeholder="full Name"
                  icon="fi-rr-user"
                />
              ) : (
                ""
              )}

              <InputBox
                name="email"
                type="email"
                placeholder="Email"
                icon="fi-rr-envelope"
              />

              <InputBox
                name="password"
                type="password"
                placeholder="Password"
                icon="fi-rr-key"
              />

              <button
                className="btn-dark center mt-14"
                type="submit"
                onClick={handleSubmit}
              >
                {type.replace("-", " ")}
              </button>
              <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
                <hr className=" w-1/2 border-black" />
                <p>or</p>
                <hr className=" w-1/2 border-black" />
              </div>
              {/* <button
                className="btn-light my-5 flex items-center justify-center gap-4 w-[90%] center text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90]"
                
              >
                <i className="fi fi-rr-circle-user w-5 text-2xl flex items-center justify-center"></i>

                continue with guest account
              </button> */}
              <button
                className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                onClick={handleGoogleAuth}
              >
                <img src={googleIcon} alt="" className="w-5" />
                continue with google
              </button>

              {type === "sign-in" ? (
                <p className="mt-6 text-dark-grey text-xl text-center">
                  Don't have an account ?
                  <Link
                    to={"/signup"}
                    className="underline text-black text-xl ml-1"
                  >
                    Join us today
                  </Link>
                </p>
              ) : (
                <p className="mt-6 text-dark-grey text-xl text-center">
                  Alrady a member
                  <Link
                    to={"/signin"}
                    className="underline text-black text-xl ml-1"
                  >
                    sign in here.
                  </Link>
                </p>
              )}
            </form>
          </section>
        </AnimationWrapper>
      )}
    </>
  );
}

export default UserAuthForm;
