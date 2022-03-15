import React, { useEffect, useState } from "react";
import { Routes, Route, useParams, Link } from "react-router-dom";

import ProfileHeader from "../../Components/profile/ProfileHeader";
import "./Profile.css";

import Tweet from "../../Components/profile/Tweet";
import TweetNav from "../../Components/profile/TweetNav";
import axios from "axios";
import { BASE_URL } from "../../constants/contants";
import { AuthContext } from "../../context/Auth.context";
import { useContext } from "react";
import { UserContext } from "../../hooks/useContext";

const Profile = () => {
  let params = useParams();
  const { user, setUser }: any = useContext(UserContext);
  // const { user } = useContext(AuthContext);
  const [getProfileError, setGetProfileError] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetchingProfile(true);
        const { data } = await axios.get(`${BASE_URL}profile/${params.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log(data, "user profile");

        setProfile(data);
        setIsFetchingProfile(false);
      } catch (e: any) {
        setIsFetchingProfile(false);
        setGetProfileError(e);
      }
    };

    fetchData();
  }, [params.id, user.token]);

  useEffect(() => {
    const displayTweets = async () => {
      const res = await fetch(`${BASE_URL}tweeting/otherusertweet/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const result = await res.json();
      console.log(result.data, result.data[1]["OtherUserTweet"], "fdfdfndfb check");
      setTweets(result.data[1]["OtherUserTweet"]);
    };
    displayTweets();
  }, []);

  return (
    <div>
      <ProfileHeader
        firstName={profile?.user.firstName}
        lastName={profile?.user.lastName}
        bioData={profile?.user.bioData}
        profilePic={profile?.user.profilePic}
        followerCount={profile?.followers.Totalfollowers}
        followingCount={profile?.following.Totalfollowing}
        isFetching={isFetchingProfile}
      />
      {/* <br /> */}
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <TweetNav />
          </div>
          <div className="col-sm-9">
            {tweets && console.log(tweets, "check state datat")}

            {tweets.length > 0 &&
              tweets.map((val: any, i: any) => (
                <div>
                  <Link
                    to={`/tweetcomment/${val._id}`}
                    style={{
                      textDecoration: "none",
                      color: "#000",
                    }}
                  >
                    <Tweet
                      messageBody={val["messageBody"]}
                      createdAt={val["createdAt"]}
                      firstName={val.userId.firstName}
                      lastName={val.userId.lastName}
                      tweetImage={val.tweetImage}
                    />
                  </Link>
                </div>
              ))}

            {/* {tweets && tweets.map((tweet: any, index: any) => (
            <div key={index}>
              <Routes>
                <Route path="/profile/*" element={<Tweet messageBody={tweet["item"]["messageBody"]}/>} />
              </Routes>
            </div>
          ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
