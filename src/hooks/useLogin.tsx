import axios from "axios";
import { notify } from "../hooks/useNotification";
import Swal from "sweetalert2";

export const storeUser = (userData: any) => {
  let data = localStorage.setItem("tweeter", JSON.stringify(userData));
};
export const getUserData = () => {
  let data: any = localStorage.getItem("tweeter");
  return JSON.parse(data);
};
export const getUserToken = () => {
  let data: any = localStorage.getItem("tweeter");
  console.log(data);

  if (data) {
    data = JSON.parse(data);
    if (!data.user.profilePic) localStorage.removeItem("tweeter");

    localStorage.setItem("userlogingImage", data.user.profilePic);
    return data.token;
  }
  return null;
};
export const isLoggedIn = () => {
  let data: any = getUserToken();

  let loginUrl = window.location.href.split("/");
  console.log(loginUrl[loginUrl.length - 1]);
  const pages = ["login", "signup", "forgot-password"];
  const currentUrl = loginUrl[loginUrl.length - 1];
  // redirect

  console.log({ loginUrl });

  if (loginUrl[3] === "social") {
    // window.location.href = `/${currentUrl}`;
    return true;
  }

  if (!data && !pages.includes(currentUrl)) {
    window.location.href = "/login";
    return false;
  } else if (data && currentUrl === "login") {
    window.location.href = "/";
    return true;
  }
};

export const logOut = () => {
  localStorage.removeItem("tweeter");
  Swal.fire({
    icon: "success",
    title: "Signing Out Account",
    showConfirmButton: false,
    timer: 1500,
  });
  window.location.reload();
};
