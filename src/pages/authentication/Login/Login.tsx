import React, { useState, useRef, useEffect } from "react";
import styles from "./login.module.scss";
import { FaGoogle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { GrFacebook } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { User } from "./login.interface";
import { IoLogoTwitter, IoLogoGithub, IoMdPartlySunny } from "react-icons/io";
import { BsMoonStarsFill } from "react-icons/bs";
import { BASE_URL, HTTPCODE } from "../../../constants/contants";
import { storeUser } from "../../../hooks/useLogin";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Link, Route, Routes } from "react-router-dom";

import Swal from "sweetalert2";

const url: string = `${BASE_URL}users/login`;
const url2: string = `${BASE_URL}auth/google`;
// const local = "http://localhost:3000/auth/google";

const Login = (): JSX.Element => {
  const google = () => {
    window.open(url2, "_self");
    console.log(user);
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}auth/login/success`);
        console.log(res);
        const response = res.data;
        setUser(response);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  console.log(user);
  const [isLight, setIsLight] = useState(true);
  const [form, setForm] = useState<User>({ email: "", password: "" });
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadMsg, setLoadMsg] = useState<string>("");
  const [loadingMsg, setloadingMsg] = useState<string>("");

  const focusPoint = useRef<HTMLInputElement>(null);
  const focusPoint2 = useRef<HTMLInputElement>(null);

  const setLightMode = () => {
    setIsLight(!isLight);
    return document.body.classList.toggle(`${styles.darkMode}`);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setloadingMsg("loading");

    if (!form.email) {
      focusPoint.current!.style.border = "1.5px solid red";
      setTimeout(
        () => (focusPoint.current!.style.border = "1px solid red"),
        3000
      );
    }
    if (!form.password) {
      focusPoint2.current!.style.border = "1.5px solid red";
      setTimeout(
        () => (focusPoint2.current!.style.border = "1px solid #bdbdbd"),
        3000
      );
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (HTTPCODE.success.includes(response.status)) {
        console.log(data);
        storeUser(data);
        Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.href='/';
        }, 2000);
      }
      if (HTTPCODE.bad.includes(response.status)) {
        setloadingMsg("");

        Swal.fire({
          icon: "error",
          title: "Incorrect Credentials",
          showConfirmButton: false,
          timer: 2500,
        });
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name: string = e.currentTarget.name;
    let value: string = e.currentTarget.value;
    const newData = { ...form, [name]: value };
    setForm(newData);
  };
  useEffect(() => {
    if (focusPoint.current) {
      focusPoint.current.focus();
      return;
    }
  }, [focusPoint]);
  return (
    <div className="">
      <div className={styles["box-container"]}>
        {!isLight && (
          <IoMdPartlySunny
            className={`${styles.sun} ${styles.fillsun}`}
            onClick={setLightMode}
          />
        )}
        {isLight && (
          <BsMoonStarsFill
            className={`${styles.sun} ${styles.fillmoon}`}
            onClick={setLightMode}
          />
        )}
        <div className={styles["logo-head"]}>
          <IoLogoTwitter />
          <h4>Tweeter</h4>
        </div>
        <h2>Login</h2>
        <div className={styles.form}>
          <div className={styles["format-box"]}>
            <MdEmail className={styles["email-icon"]} />
            <input
              type="email"
              value={form.email}
              ref={focusPoint}
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className={styles["format-box"]}>
            <IoIosLock className={styles["lock-pass"]} />
            <input
              type="password"
              value={form.password}
              ref={focusPoint2}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <button onClick={handleSubmit}>
            {loadingMsg === "loading" && <BeatLoader color="#2F80ED" />}
            {loadingMsg !== "loading" && "Login"}
          </button>
        </div>
        <p>or continue with these social profile</p>
        <div className={styles["social-logins"]}>
          <button
            onClick={google}
            style={{
              background: "transparent",
              border: "1px solid #444",
              color: "#444",
              marginTop: "5px",
              fontSize: "0.8rem",
              textTransform: "capitalize",
              padding: '3px',
              width: '230px',
              height: '50px'
            }}
          >
            <FcGoogle
              style={{
                marginRight: "5px",
                fontSize: "1rem",
                letterSpacing: "2px",
              }}
            /> Login With Google
          </button>
        </div>
        <p>
          Don't have an account yet? <Link to="/signup">Register </Link>
        </p>
        <p className={styles["forget-password"]}>
          <a href="/forgot-password" style={{
                position: 'relative',
                bottom: '30px'
                // marginRight: "5px",
                // fontSize: "1rem",
                // letterSpacing: "2px",
              }}>Forget password?</a>
        </p>
      </div>
    </div>
  );
};
export default Login;
