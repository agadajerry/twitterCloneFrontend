import React, { useState, useRef, useEffect } from "react";
import styles from "./signup.module.scss";
import { FaGoogle } from "react-icons/fa";
import { GrFacebook } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosLock } from "react-icons/io";
import { User } from "./signup.interface";
import { IoLogoTwitter, IoLogoGithub, IoMdPartlySunny } from "react-icons/io";
import { BsMoonStarsFill } from "react-icons/bs";
import { BASE_URL } from "../../../constants/contants";
import { notify } from "../../../hooks/useNotification";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom"
import { titleCase } from "../../../hooks/useTitleCase";


const url: string = `${BASE_URL}users/signup`;

const Signup = (): JSX.Element => {
  const [isLight, setIsLight] = useState(true);
  const [form, setForm] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingMsg, setloadingMsg] = useState<string>("");

  const focusPoint = useRef<HTMLInputElement>(null);
  const focusPoint2 = useRef<HTMLInputElement>(null);

  const setLightMode = () => {
    setIsLight(!isLight);
    return document.body.classList.toggle(`${styles.darkMode}`);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setloadingMsg("loading")
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
      // !response
      //   ? notify("success", "Creating Account", false)
      //   : console.log("finished");
      // console.log(response, form);

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Registeration Successful",
          showConfirmButton: false,
          timer: 2500,
        });
        setTimeout(() => {
          window.location.href = "login";
        }, 3000);
        // notify("success", "Registeration Successful", "login");
      }
      if (
        response.status === 400 ||
        response.status === 500 ||
        response.status === 404
      ) {
        const data = await response.json();
        console.log(data);
        const titleResponse=titleCase(data.message);
        Swal.fire({
          icon: "warning",
          title: `${titleResponse}`,
          showConfirmButton: false,
          timer: 5500,
        });
            setloadingMsg("");

        // notify("error", "Registration failed", false);
      }

      console.log(response);
    } catch (err: any) {
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
      <h2>Sign up</h2>
      {showError && <p className={styles["error-class"]}>{errorMsg}</p>}
      <div className={styles.form}>
        <div className={styles["format-box"]}>
          <CgProfile className={styles["profile-icon"]} />
          <input
            type="text"
            value={form.firstName}
            ref={focusPoint}
            name="firstName"
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        <div className={styles["format-box"]}>
          <CgProfile className={styles["profile-icon"]} />
          <input
            type="text"
            value={form.lastName}
            ref={focusPoint}
            name="lastName"
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
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
        <div className={styles["format-box"]}>
          <IoIosLock className={styles["lock-pass"]} />
          <input
            type="password"
            value={form.password}
            ref={focusPoint2}
            name="password"
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </div>

        <button onClick={handleSubmit}>
          {loadingMsg === "loading" && <BeatLoader color="#2F80ED" />}
          {loadingMsg !=="loading" && 'Sign up'}
        </button>
      </div>
      <p>
        Already have account? <Link to="/login">Login </Link>
      </p>
    </div>
  );
};
export default Signup;
