import { Box, Image } from "@mantine/core";
import PodiumPlayer from "./PodiumPlayer";
import podiumImage from "../../../assets/images/podium.png";
import styles from "./Podium.module.css";

export default function Podium({ players = [] }) {
  const placements = [
    { player: players[1], place: 2, className: styles.second },
    { player: players[0], place: 1, className: styles.first },
    { player: players[2], place: 3, className: styles.third },
  ];

  return (
    <Box className={styles.podium}>
      <Image
        src={podiumImage}
        alt="Top 3 podium"
        className={styles.podiumImage}
      />

      {placements.map(({ player, place, className }) => {
        if (!player) return null;

        return (
          <Box
            key={player.id ?? place}
            className={`${styles.playerPosition} ${className}`}
          >
            <PodiumPlayer player={player} place={place} />
          </Box>
        );
      })}
    </Box>
  );
}
