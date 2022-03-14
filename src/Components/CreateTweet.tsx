import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Circles } from "react-loader-spinner";
import Swal from "sweetalert2";
import { AVATAR, BASE_URL } from "../constants/contants";
// import { BASE_URL } from '../constants/contants';
import { UserContext } from "../hooks/useContext";
import styles from "../styles/Tweeting_style/TweetController.module.css";

function CreateTweet() {
  const { user, setUser }: any = useContext(UserContext);

  // const userToken:any = useContext(UserContext)
  const token = user.token;

  // const url = `${BASE_URL}api/trends`
  // const uri = `${BASE_URL}api/follow/suggest/?pageNo=2&pageSize=5`

  //   useEffect(() => {
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res.data)
  //         setTrends(res.data.data.trending);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //       axios
  //         .get(uri, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res)=>{
  //         console.log(res.data)
  //         setFollow(res.data.data.suggestedConnection)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }, []);

  const [newheight, setNewHeight] = useState("22px");
  const [modal, setModal] = useState(false);
  const [whoCanReplay, setWhoCanReplay] = useState("Everyone");
  const [imageUrl, setImageUrl] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [exitImage, setExitImage] = useState("");

  const [enteredText, setEnteredText] = useState("");
  const [enteredImg, setEnteredImg] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);

  const formData = new FormData();
  const addTextHandler = async (event: any) => {
    formData.append("messageBody", enteredText);
    formData.append("tweetImage", enteredImg as File);
    formData.append("whoCanReply", whoCanReplay);

    try {
      setLoading(true);
      const data = await axios.post(`${BASE_URL}tweeting`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data`,
        },
      });

      // Swal.fire("Hey Twitee!", "Tweet posted!", "success");
      Swal.fire({
        icon: "success",
        title: "Created tweet successfully",
        showConfirmButton: false,
        timer: 2500,
      });

      console.log(data);
      setLoading(false);
      setEnteredText("");
      removeImage();
      setEnteredImg(null);
    } catch (e: any) {
      console.log(e.response.data);
      setLoading(false);
    }

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
  };

  //get text of who can replay
  function getText(e: any) {
    setWhoCanReplay(e.currentTarget.textContent);
    setModal(false);
  }

  const getImage = (e: any) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setEnteredImg(e.target.files ? e.target.files[0] : null);
    console.log(e.target.files[0]);
    setImageHeight("50%");
    setImageWidth("50%");
    setExitImage("https://img.icons8.com/ios/32/ff0000/close-window.png");
  };

  function removeImage() {
    setImageUrl("");
    setImageHeight("");
    setImageWidth("");
    setExitImage("");
  }

  function increaseHeight(e: any) {
    let changeHeight = e.target.scrollHeight;
    setEnteredText(e.target.value);
    console.log(enteredText);

    setNewHeight(changeHeight);

    if (e.target.value === "") {
      setNewHeight("25px");
    }
  }

  return (
    <>
      <div className={styles["tweet-heading"]}>
        <h3>Tweet something</h3>
        <div className={styles.underline}></div>
        <div className={styles["write-message"]}>
          <img src={user.user.profilePic || AVATAR} className={styles["user-image"]} alt="user" />
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            placeholder="What's happening?"
            onChange={(e) => increaseHeight(e)}
            style={{ height: newheight }}
            value={enteredText}
          ></motion.textarea>
        </div>

        <div className={styles["set-media-image"]}>
          <img
            alt=""
            src={imageUrl ? imageUrl : ""}
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: "4px",
            }}
          />
          <span onClick={removeImage}>
            <img src={exitImage} alt="" />
          </span>
        </div>

        <div className={styles["select-media-container"]}>
          <div className={styles["select-media"]}>
            {/* select media */}

            <p style={{ display: "none" }}>
              <input
                type="file"
                id="file"
                accept="image/*"
                name="image"
                onChange={(e) => getImage(e)}
              />
            </p>

            <p className={styles["select-image"]}>
              <label htmlFor="file">
                <img src="https://img.icons8.com/material-outlined/48/2F80ED/image.png" alt="img" />
              </label>
            </p>

            <div onClick={() => setModal(!modal)}>
              <img
                className={styles["media-image"]}
                src="https://img.icons8.com/material-rounded/48/2F80ED/globe--v1.png"
                alt="img"
              />
              <h3>{whoCanReplay}</h3>
            </div>
          </div>

          <button type="submit" onClick={addTextHandler}>
            {loading === true ? (
              <Circles
                color="#FFFFFF"
                height={20}
                width={20}
                wrapperStyle={{ justifyContent: "center" }}
              />
            ) : (
              "Tweet"
            )}
          </button>
        </div>
      </div>
      <div className={modal ? styles["replierContainer"] : styles["hideReplierContainer"]}>
        <h3>Who can reply?</h3>
        <p>Choose who can reply</p>
        <a href="#!" className={styles["image-n-text"]}>
          <img
            className={styles["media-image"]}
            src="https://img.icons8.com/material-rounded/28/000000/globe--v1.png"
            alt="img"
          />
          <h3 onClick={(e) => getText(e)}>Everyone</h3>
        </a>
        <a href="#!" className={styles["image-n-text"]}>
          <img
            className={styles["media-image"]}
            src="https://img.icons8.com/ios-glyphs/30/000000/group-foreground-selected.png"
            alt="img"
          />
          <h3 onClick={(e) => getText(e)}>People you follow</h3>
        </a>
      </div>
    </>
  );
}

export default CreateTweet;
