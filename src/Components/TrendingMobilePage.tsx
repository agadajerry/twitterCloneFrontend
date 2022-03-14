import styles from "../styles/Tweeting_style/TrendingPage.module.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/useContext"
import { BASE_URL } from "../constants/contants";

function TrendingMobilePage() {
  const { user, setUser }: any = useContext(UserContext);

  // const user:any = useContext(UserContext)
  const token = user.token

  const [trends, setTrends] = useState<any>([]);

  const url = `${BASE_URL}api/trends`

  useEffect(() => {
    axios
      .get(url, {
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

  return (
    <>
      <div className={styles["trending-container-mobile"]}>
        <div className={styles.trending}>
          <h3>trends for you</h3>
          <div className={styles.underline}></div>
          {Object.keys(trends).map((trend: string) => (
            <div key={trend} className={styles["trending-content"]}>
              <Link to={`/trends/${trend.replace(/#/g, '')}`}>{trend}
              <span>{trends[trend].length} Tweets</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TrendingMobilePage;
