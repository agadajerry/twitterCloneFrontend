import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FollowingComponent from "../followingComponent/followingComponent";
import "./follower.scss";
import axios from "axios";
import { AuthContext } from "../../context/Auth.context";
import { useContext } from "react";

function Follower() {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [followers, setFollowers] = useState([]);

  const url = "https://tweetaclone.herokuapp.com/";

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const res = await axios(`${url}api/follow/?pageNo=1&pageSize=20`, {
          headers: {
            Authorization: "Bearer " + user.token, //the token is a variable which holds the token
          },
        });
        const followers = res.data.data.followers;
        setFollowers(followers);
        console.log(followers);
      } catch (err) {
        console.log(err);
      }
    };
    getFollowers();
  }, []);

  const followerElement = followers.map(
    ({ index, firstName, _id, lastName, profilePic, bioData, isFollow }) => (
      <FollowingComponent
        key={index}
        name={firstName + " " + lastName}
        profilePic={profilePic}
        bioData={bioData}
        isFollow={isFollow}
        id={_id}
      />
    )
  );

  return (
    <>
      <div className="follow-button" onClick={handleShow}>
        Followers List
      </div>

      {followers && console.log(followers)}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <div className="fixed">
            <p>daniel jenson is following You </p>
          </div>
        </Modal.Header>
        {followerElement}
      </Modal>
    </>
  );
}

export default Follower;
