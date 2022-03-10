import styles from "../styles/Tweeting_style/TweetController.module.css";
// import { followingContext } from "../Components/FollowingProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "./NavBar/Nav";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../hooks/useContext";
import { BASE_URL } from "../constants/contants";
// import Trending_Follow from "./Trending_Follow";
// import Tweet from "./Tweet/Tweet";
// import { Navbar } from "reactstrap";
import Trending_Follow from "./Trending_Follow";
import { BeatLoader } from "react-spinners";
import Tweet from "./Tweet/Tweet";
import { CirclesWithBar } from "react-loader-spinner";
import { followingContext } from "./FollowingProvider";

function TrendsController() {
  
  const { followerTweet, followerCondition, isLoading,isScrolling } = useContext(followingContext);

  const userToken: any = useContext(UserContext);
  const token = userToken.token;
  const params: any = useParams();

  const [trends, setTrends] = useState<any>([]);
  const [hashtags, setHashtags] = useState<any>([]);
  const [follow, setFollow] = useState<any[]>([]);

  const urll = `${BASE_URL}api/trends`;
  const url = `${BASE_URL}api/trends/hashtag?hashtag=%23${params.id}&pageNo=1&pageSize=5`;
  const uri = `${BASE_URL}api/follow/suggest/?pageNo=2&pageSize=5`;


  useEffect(() => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setHashtags(res.data.data.tweet);
      })
      .catch((err) => {
        console.log(err);
      });
      axios
      .get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollow(res.data["suggested-connection"].suggestedConnection);
      })
      .catch((err) => {
        console.log(err);
      });
      axios
      .get(urll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setTrends(res.data.data.trending);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        const newFollow = follow.filter(item => item._id !== userId)
        setFollow(newFollow)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Nav />
      {/* <Trending_Follow /> */}

      <div className={styles["tweet-wrapper"]}>



        <div className={styles["tweet-body"]}>
          
        {followerCondition.length && followerCondition.map((val: any, index: number) => {
                return (
                  <Tweet
                    key={index}
                    isLiked={val.isLiked}
                    isRetweeted={val.isRetweeted}
                    isBookmarked={val.isBookmarked}
                    tweetImage={followerTweet[index].tweetImage}
                    commentCount={followerTweet[index].commentCount}
                    retweetCount={followerTweet[index].retweetCount}
                    messageBody={followerTweet[index].messageBody}
                    userId={followerTweet[index].userId}
                    createdAt={followerTweet[index].createdAt}
                    noOfLikes={followerTweet[index].noOfLikes}
                    _id={followerTweet[index]._id}
                    bookmarkCount={followerTweet[index].bookmarkCount}
                  />
                );
              })}
                  {isScrolling ?  <CirclesWithBar
                    color="#2F80ED"
                    height={50}
                    width={50}
                    wrapperStyle={{ justifyContent: "center",marginTop:"30px" }}
                  />:""}

          {hashtags?.length
            ? hashtags?.map((tag: any) => (
                <>
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-2">
                          <img
                            className="col-sm-12 tweet-avatar"
                            src={tag.userId.profilePic}
                            alt=""
                          />
                        </div>
                        <div className="col-6">
                          <h6 className="user-name-tweet col-12">
                            {tag.userId.firstName + " " + tag.userId.lastName}
                          </h6>
                          <h6 className="user-name-date col-12">
                            {(new Date(tag.updatedAt)).toDateString() + ", " + (new Date(tag.updatedAt)).toTimeString()}
                          </h6>
                        </div>
                        <div className="col-sm-4"></div>
                      </div>
                      <p>
                        {tag.messageBody ? tag.messageBody : ""}
                      </p>
                      {tag.tweetImage ? <img
                        className="card-img-top tweetimage"
                        src={tag.tweetImage}
                        alt=""
                      /> : ""}

                      {/* <div className="row">
                        <div className="col-7"></div>
                        <div className="col-5">
                          <div className="row">
                            <div className="col-sm-4 tweet-under">
                              449 Comments
                            </div>
                            <div className="col-sm-4 tweet-under">
                              59k Retweets
                            </div>
                            <div className="col-sm-4 tweet-under">
                              234 Saved
                            </div>
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="row text-center">
                        <div className="col-sm-3">
                          <i className="far fa-comment font-ic"> </i> Comments
                        </div>
                        <div className="col-sm-3">
                          <i className="fa fa-retweet font-ic"></i> Retweeted
                        </div>
                        <div className="col-sm-3">
                          <i className="far fa-heart font-ic"></i> Liked
                        </div>
                        <div className="col-sm-3">
                          <i className="far fa-bookmark font-ic"></i> Saved
                        </div>
                      </div> */}
                      {/* <br />
                      <div className="row">
                        <div className="col-1">
                          <img
                            className="card-img-top sendimage"
                            src="https://res.cloudinary.com/dveib1w9c/image/upload/v1645018165/tweeter/76776d7ccd43c1602fbc6aa3a6ee5ac5_ekahcu.png"
                            alt=""
                          />
                        </div>
                        <div className="col-11">
                          <input
                            type="email"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="name@example.com"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                  {/* <br />
                  <br /> */}
                </>
              ))
            : ""}
        </div>
        
        <div className={styles["trending-n-follow"]}>
        <div className={styles.trending}>
          <h3>trends for you</h3>
          <div className={styles.underline}></div>
          {Object.keys(trends).length ? (
            Object.keys(trends).map((trend: string) => (
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
            {follow.length ? (
              follow.map((item) => (
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
                    <button onClick={() => handleFollow(item._id)}>
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
      </div>
{/* gggg */}
      {/* <Tweet /> */}
      </div>
    </>
  );
}

export default TrendsController;
