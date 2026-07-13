import { Card, Stack, Text, Group, ThemeIcon, Box } from "@mantine/core";
import LeaderboardPlayer from "./LeaderboardPlayer.jsx";
import styles from "./Leaderboards.module.css";
import { SCORING_POINTS } from "../../../domain/constants.js";

function normalizePlayers(players) {
  const sourcePlayers = Array.isArray(players) ? players : [];
  const humanPlayers = sourcePlayers.filter((player) => player?.isAi !== true);
  const hasAuthoritativeRanks = humanPlayers.every((player) => {
    const numericRank = Number(player.rank);

    return Number.isFinite(numericRank) && numericRank > 0;
  });
  const orderedPlayers = humanPlayers
    .map((player, sourceIndex) => ({ player, sourceIndex }))
    .sort((left, right) => {
      if (hasAuthoritativeRanks) {
        return (
          Number(left.player.rank) - Number(right.player.rank) ||
          left.sourceIndex - right.sourceIndex
        );
      }

      return (
        (right.player.totalScore ?? 0) - (left.player.totalScore ?? 0) ||
        left.sourceIndex - right.sourceIndex
      );
    });

  return orderedPlayers.map(({ player, sourceIndex }, index) => ({
    ...player,
    playerId:
      player.playerId ??
      player.id ??
      `${player.nickname ?? "player"}-${sourceIndex}`,
    rank: hasAuthoritativeRanks ? Number(player.rank) : index + 1,
    totalScore: player.totalScore ?? 0,
  }));
}

export default function Leaderboards({ players = [] }) {
  const displayPlayers = normalizePlayers(players);

  return (
    <Card className={styles.card}>
      <Group className={styles.header} wrap="nowrap">
        <ThemeIcon className={styles.trophyIcon} radius="xl">
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
        {displayPlayers.map((player) => (
          <LeaderboardPlayer key={player.playerId} player={player} />
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
