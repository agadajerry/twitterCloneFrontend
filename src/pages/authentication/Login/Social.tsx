import React, { useState, useRef, useEffect } from "react";
import { Route, useParams, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { storeUser, getUserData, isLoggedIn } from "./../../../hooks/useLogin";
import Login from "./Login";

const Social = (): JSX.Element => {
  const { user } = useParams();

  let userStored = storeUser(user);
  let token = getUserData();
  const navigate = useNavigate();

  let userDetails;
  useEffect(() => {
    const profile = async () => {
      try {
        const res = await axios(`https://tweetaclone.herokuapp.com/profile`, {
          headers: {
            Authorization: "Bearer " + token, //the token is a variable which holds the token
          },
        });
        const user = res.data.user;
        console.log(user)
        userDetails = storeUser({ user, token });

        window.location.href = "/";
      } catch (err) {
        console.log(err);
      }
    };
    profile();
  }, []);

  return (
    <>
      <p>loading</p>
    </>
  );
};
export default Social;
