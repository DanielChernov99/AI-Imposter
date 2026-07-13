import { SCORING_POINTS } from "./constants.js";

function uniqueHumanPlayers(players) {
  const seenPlayerIds = new Set();

  return players.filter((player) => {
    if (!player?.id || player.isAi === true || seenPlayerIds.has(player.id)) {
      return false;
    }

    seenPlayerIds.add(player.id);
    return true;
  });
}

function compareJoinedAt(leftPlayer, rightPlayer) {
  if (!leftPlayer.joinedAt || !rightPlayer.joinedAt) {
    return 0;
  }

  return leftPlayer.joinedAt.localeCompare(rightPlayer.joinedAt);
}

/**
 * Builds display-only Reveal scoring data from authoritative answers, votes,
 * and freshly loaded room players. This function never persists score data.
 */
export function buildRoundResult({ answers = [], players = [] }) {
  const humanPlayers = uniqueHumanPlayers(players);
  const pointsByPlayerId = new Map(
    humanPlayers.map((player) => [player.id, 0]),
  );

  for (const answer of answers) {
    if (answer.isValid !== true) {
      continue;
    }

    const voterPlayerIds = answer.voterPlayerIds ?? [];

    if (answer.isAi) {
      for (const voterPlayerId of voterPlayerIds) {
        if (pointsByPlayerId.has(voterPlayerId)) {
          pointsByPlayerId.set(
            voterPlayerId,
            pointsByPlayerId.get(voterPlayerId) +
              SCORING_POINTS.CORRECT_AI_GUESS,
          );
        }
      }

      continue;
    }

    if (pointsByPlayerId.has(answer.playerId)) {
      pointsByPlayerId.set(
        answer.playerId,
        pointsByPlayerId.get(answer.playerId) +
          voterPlayerIds.length *
            SCORING_POINTS.HUMAN_ANSWER_FOOLED_VOTER,
      );
    }
  }

  const rankedPlayers = humanPlayers
    .map((player, serverOrder) => ({ player, serverOrder }))
    .sort((left, right) => {
      const scoreDifference =
        (right.player.totalScore ?? 0) - (left.player.totalScore ?? 0);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return (
        compareJoinedAt(left.player, right.player) ||
        left.serverOrder - right.serverOrder
      );
    });

  const leaderboard = rankedPlayers.map(({ player }, index) => ({
    playerId: player.id,
    nickname: player.nickname,
    avatarUrl: player.avatarUrl ?? null,
    totalScore: player.totalScore ?? 0,
    rank: index + 1,
  }));
  const cumulativeRankByPlayerId = new Map(
    leaderboard.map((standing) => [standing.playerId, standing.rank]),
  );

  const roundPoints = humanPlayers
    .map((player, serverOrder) => ({
      playerId: player.id,
      nickname: player.nickname,
      avatarUrl: player.avatarUrl ?? null,
      pointsEarned: pointsByPlayerId.get(player.id),
      cumulativeRank: cumulativeRankByPlayerId.get(player.id),
      serverOrder,
    }))
    .sort(
      (left, right) =>
        right.pointsEarned - left.pointsEarned ||
        left.cumulativeRank - right.cumulativeRank ||
        left.serverOrder - right.serverOrder,
    )
    .map(
      ({
        playerId,
        nickname,
        avatarUrl,
        pointsEarned,
      }) => ({ playerId, nickname, avatarUrl, pointsEarned }),
    );

  return { answers, roundPoints, leaderboard };
}
