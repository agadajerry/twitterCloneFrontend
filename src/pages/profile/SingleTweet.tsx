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
import Navbar from "../../Components/NavBar/Nav";


// import TweetNav from "../../Components/profile/TweetNav";

const SingleTweet = () => {

    let { id } = useParams();
    const { user } = useContext(AuthContext);
    const [getProfileError, setGetProfileError] = useState(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);
    const [profile, setProfile] = useState<Record<string, any> | null>(null);
    const [tweets, setTweets] = useState([]);
    
  
    useEffect(() => {
      const fetchData = async () => {
        try {
      
          setIsFetchingProfile(true);
          const { data } = await axios.get(`${BASE_URL}profile/${id}`, {
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
    }, [id, user.token]);
    
    useEffect(() => { 
          const displayTweets = async () => {
            
            const res = await fetch(`${BASE_URL}tweeting/singletweet/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
              }
            });
            const result = await res.json();
            console.log(result.data)
            setTweets(result.data);
          }
          displayTweets();
        }, [])

  return (
    <div>
        <Navbar />
        <div className="card-body">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12" style={{
                        textAlign: "center",
                        marginTop: "50px"
                    }}>
                        <h3>Profile</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SingleTweet




{/* <div className="col-sm-9">
        {tweets && tweets.map((tweet: any, index: any) => (
        <div key={index}>
            <Routes>
                <Route path="tweet" element={<Tweet updatedAt={tweet.updatedAt} messageBody={tweet.messageBody}/>} />
            </Routes>
        </div>
        ))}
    </div> */}