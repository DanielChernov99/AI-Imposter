import { Box, Image } from "@mantine/core";
import PodiumPlayer from "./PodiumPlayer";
import podiumImage from "../../assets/images/podium.png";
import styles from "../../styles/Podium.module.css";

export default function Podium({ players = [] }) {
  const firstPlayer = players[0] || null;
  const secondPlayer = players[1] || null;
  const thirdPlayer = players[2] || null;

  return (
    <Box className={styles.podium}>
      <Image
        src={podiumImage}
        alt="Top 3 podium"
        className={styles.podiumImage}
      />

      {secondPlayer && (
        <Box className={`${styles.playerPosition} ${styles.second}`}>
          <PodiumPlayer player={secondPlayer} place={2} />
        </Box>
      )}

      {firstPlayer && (
        <Box className={`${styles.playerPosition} ${styles.first}`}>
          <PodiumPlayer player={firstPlayer} place={1} />
        </Box>
      )}

      {thirdPlayer && (
        <Box className={`${styles.playerPosition} ${styles.third}`}>
          <PodiumPlayer player={thirdPlayer} place={3} />
        </Box>
      )}
    </Box>
  );
}
