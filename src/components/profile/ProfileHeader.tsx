import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfileHeader.css";
import Navbar from "../NavBar/Nav";
import { Circles } from "react-loader-spinner";
import { FaPlus } from "react-icons/fa";
import Following from "../Following/following";
import Follower from "../Follower/follower";
import { AVATAR } from "../../constants/contants";

interface IProps {
  firstName: string;
  lastName: string;
  bioData: string;
  profilePic: string;
  followingCount: number;
  followerCount: number;
  isFetching: boolean;
}

const ProfileHeader = (props: IProps) => {
  return (
    <div className="main">
      <Navbar />
      <div className="container-fluid header-img">
        <img
          className="banner_img"
          src="https://res.cloudinary.com/dveib1w9c/image/upload/v1645016471/tweeter/3abd6960b68914a11c9eb3e8defc5a0b_jryzek.png"
          alt="img"
        />
      </div>
      <div className="container negate-margin">
        <div className="card" style={{ minHeight: "25vh" }}>
          {props.isFetching === true ? (
            <Circles
              color="blue"
              height={50}
              width={50}
              wrapperStyle={{
                justifyContent: "center",
                alignItems: "center",
                height: "25vh",
              }}
            />
          ) : (
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3 ">
                  <div className="spacer">

                      <img
                        className="avatar-profile"
                        src={props.profilePic || AVATAR}
                        alt=""
                      />

                  </div>
                </div>
                <div className="col-sm-6">
                  {/* <br /> */}
                  <div className="row">
                    <div className="col-sm-4">
                      <h5>{props.firstName + " " + props.lastName}</h5>
                    </div>
                    <div className="col-sm-6 d-flex ">
                      {props.followingCount}<Following /> 
                      {props.followerCount}
                      <Follower />
                    </div>
                    <div className="col-sm-12" style={{marginTop: "40px"}} >
                      {props.bioData}
                      {/* Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰 */}
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <button
                    className="btn btn-primary"
                    style={{ padding: "10px" }}
                  >
                    <FaPlus className="" />
                    follow
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
