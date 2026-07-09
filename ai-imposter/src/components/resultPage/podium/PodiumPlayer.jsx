import { Avatar, Box, Stack } from "@mantine/core";
import star from "../../../assets/icons/star.svg";
import styles from "./PodiumPlayer.module.css";

export default function PodiumPlayer({ player, place }) {
  return (
    <Stack className={styles.player} gap={0} align="center">
      <Box className={styles.avatarBlock}>
        <Box className={styles.rank}>{place}</Box>

        <Avatar
          src={player.img}
          alt={player.nickname}
          size="100%"
          radius="50%"
          justify="center"
          classNames={{
            root: styles.avatarRoot,
            image: styles.avatarImage,
          }}
        />
      </Box>

      <p className={styles.name} title={player.nickname}>
        {player.nickname}
      </p>

      <div className={styles.points}>
        <img src={star} alt="" className={styles.star} />
        <span className={styles.pointsText}>{player.points} points</span>
      </div>
    </Stack>
  );
}
