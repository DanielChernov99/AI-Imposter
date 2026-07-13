import { Card, Stack, Text, Group, ThemeIcon, Box } from "@mantine/core";
import LeaderboardPlayer from "./LeaderboardPlayer.jsx";
import styles from "./Leaderboards.module.css";
import { SCORING_POINTS } from "../../../domain/constants.js";

export default function Leaderboards({ players = [] }) {
  return (
    <Card
      className={styles.card}
      shadow="sm"
      radius="lg"
      bg="rgba(8, 18, 43, 0.9)"
    >
      <Group className={styles.header} wrap="nowrap">
        <ThemeIcon className={styles.trophyIcon} size={58} radius="xl">
          🏆
        </ThemeIcon>

        <Box>
          <Text className={styles.title} fw={900}>
            LEADERBOARD
          </Text>

          <Text className={styles.subtitle}>Human players only</Text>
        </Box>
      </Group>

      <Stack gap={0}>
        {players.map((player, index) => (
          <LeaderboardPlayer key={player.id} player={player} rank={index + 1} />
        ))}
      </Stack>

      <Box className={styles.footer}>
        <Group gap="sm" align="flex-start" wrap="nowrap">
          <ThemeIcon className={styles.footerIcon} size={24} radius="xl">
            ✦
          </ThemeIcon>

          <Box>
            <Text className={styles.ruleText}>
              Correctly pick the AI answer:{" "}
              <span className={styles.green}>
                {SCORING_POINTS.CORRECT_AI_GUESS} points
              </span>
            </Text>

            <Text className={styles.ruleText}>
              Pick a human answer: that player gets{" "}
              <span className={styles.yellow}>
                {SCORING_POINTS.HUMAN_ANSWER_FOOLED_VOTER} point
              </span>
            </Text>
          </Box>
        </Group>
      </Box>
    </Card>
  );
}
