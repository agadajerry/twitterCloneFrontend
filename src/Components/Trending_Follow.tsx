import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants/contants";
import { UserContext } from "../hooks/useContext";
import styles from "../styles/Tweeting_style/TweetController.module.css";
// import { followingContext } from "./FollowingProvider";
import { BeatLoader } from "react-spinners";
import {AuthContext} from "../context/Auth.context";


function Trending_Follow() {
  // const { followerTweet } = useContext(followingContext);
  // const {user} = useContext(AuthContext);

  const { user, setUser }: any = useContext(UserContext);

  // const user: any = useContext(UserContext);
  const token = user.token;

  const [trends, setTrends] = useState<any>([]);
  const [follow, setFollow] = useState<any[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [trendLoading, setTrendLoading] = useState(false)

  const url = `${BASE_URL}api/trends`;
  const uri = `${BASE_URL}api/follow/suggest/?pageNo=2&pageSize=5`;

  useEffect(() => {
    setTrendLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTrendLoading(false)
        console.log(res.data);
        setTrends(res.data.data.trending);
      })
      .catch((err) => {
        setTrendLoading(false)
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setSuggestionLoading(true)
    axios
      .get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setSuggestionLoading(false)
        setFollow(res.data["suggested-connection"].suggestedConnection);
      })
      .catch((err) => {
        setSuggestionLoading(false)
        console.log(err);})
  }, [])

  const handleFollow = (userId: string) => {
    axios
      .post(
        `${BASE_URL}api/follow`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const newFollow = follow.filter((item) => item._id !== userId);
        setFollow(newFollow);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className={styles["trending-n-follow"]}>
        <div className={styles.trending}>
          <h3>trends for you</h3>
          <div className={styles.underline}></div>
          {!trendLoading ? (
            Object.keys(trends).length && Object.keys(trends).map((trend: string) => (
              <div key={trend} className={styles["trending-content"]}>
                <Link to={`/trends/${trend.replace(/#/g, "")}`}>
                  {trend}
                  <span>{trends[trend].length} Tweets</span>
                </Link>
              </div>
            ))
          ) : (
            <div className="d-flex justify-content-center my-3 h-100">
              <BeatLoader color="#2F80ED" />
            </div>
          )}
        </div>

        <div className={styles["who-to-follow"]}>
          <h3>Who to follow</h3>
          <div className={styles.underline}></div>
          <div className={styles["suggest-container"]}>
            {!suggestionLoading ? (
              follow.length && follow.map((item) => (
                <div className={styles["suggest-content"]}>
                  <div className={styles["suggest-user"]}>
                    {item.profilePic ? 
                    <img src={item.profilePic} alt="" /> : <div
                    style={{
                      background: "#2F80ED",
                      width: "43px",
                      height: "43px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      marginTop: "20px",
                      fontWeight: "bold"
                    }}
                  >
                    {item.firstName.charAt(0).toUpperCase() + item.lastName.charAt(0).toUpperCase()}
                  </div>}
                    <h3>{`${item.firstName} ${item.lastName}`}</h3>
                    <button onClick={() => handleFollow(item._id)} className={styles["follow-btn"]}>
                      <span></span>follow
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center my-3">
                <BeatLoader color="#2F80ED" />
              </div>
            )}
            <div className={styles.underline}></div>
          </div>
        </div>
        {/* End of sugestion container box */}
      </div>
    </>
  );
}

export default Trending_Follow;
