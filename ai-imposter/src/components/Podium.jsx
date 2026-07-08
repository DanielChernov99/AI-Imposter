import PodiumPlayer from "./PodiumPlayer";
import podiumImage from "../assets/images/podium.png";
import styles from "../styles/Podium.module.css";

export default function Podium({ players = [] }) {
  const firstPlayer = players[0] || null;
  const secondPlayer = players[1] || null;
  const thirdPlayer = players[2] || null;

  return (
    <div className={styles.podium}>
      <img
        src={podiumImage}
        alt="Top 3 podium"
        className={styles.podiumImage}
      />

      {secondPlayer && (
        <div className={`${styles.playerPosition} ${styles.second}`}>
          <PodiumPlayer player={secondPlayer} place={2} />
        </div>
      )}

      {firstPlayer && (
        <div className={`${styles.playerPosition} ${styles.first}`}>
          <PodiumPlayer player={firstPlayer} place={1} />
        </div>
      )}

      {thirdPlayer && (
        <div className={`${styles.playerPosition} ${styles.third}`}>
          <PodiumPlayer player={thirdPlayer} place={3} />
        </div>
      )}
    </div>
  );
}
