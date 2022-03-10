import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Follower/follower";
import { PersonPlusFill } from "react-bootstrap-icons";
import axios from "axios";
import { AuthContext } from "../../context/Auth.context";
import { useContext } from "react";

function FollowingComponent(props: any, _id: any) {
  let followT = props.isFollow ? "Unfollow" : "Follow";
  const { user } = useContext(AuthContext);
  const [followText, setFollowText] = useState(followT);
  const [isFollowing, setIsFollowing] = useState(props.isFollow);
  console.log(user);

  //

  const instance = axios.create({
    baseURL: "https://tweetaclone.herokuapp.com",
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + user.token,
    },
  });

  const follow = async (id: string) => {
    try {
      const res = await instance.post("/api/follow", {
        userId: props.id,
      });
      console.log(res.status);
      res.status === 200 && setFollowText("Unfollow");
      setIsFollowing(true);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const unfollow = async (id: string) => {
    try {
      const res = await instance.delete("/api/follow", {
        data: {
          userId: props.id,
        },
      });
      res.status === 200 && setFollowText("Follow");
      setIsFollowing(false);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    return isFollowing ? unfollow(props.id) : follow(props.id);
  };

  return (
    <Modal.Body>
      <article>
        <div className="header">
          <div className="img-component">
            <img src={props.profilePic} alt="" className="follow-img" />
            <div className="center">
              <h4 className="follow-name"> {props.name}</h4>
              <p className="description"> {!props.isFollow ? "You follow" : "Do not follow"}</p>
            </div>
          </div>
          <Button className="my-button" onClick={handleClick}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
        <div>
          <p className="biodata">{props.bioData}</p>
        </div>
      </article>
      <hr></hr>
    </Modal.Body>
  );
}

export default FollowingComponent;
