import star from "../assets/icons/star.svg";
import styles from "../styles/PodiumPlayer.module.css";

export default function PodiumPlayer({ player, place }) {
  return (
    <div className={styles.player}>
      <div className={styles.rank}>{place}</div>

      <div className={styles.avatarWrapper}>
        <img src={player.img} alt={player.nickname} className={styles.avatar} />
      </div>

      <div className={styles.name}>{player.nickname}</div>

      <div className={styles.points}>
        <img src={star} alt="" className={styles.star} />
        <span>{player.points} points</span>
      </div>
    </div>
  );
}
