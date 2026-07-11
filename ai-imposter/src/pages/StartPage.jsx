import { Box, Flex, Image, Stack, Text, TextInput } from "@mantine/core";
import { User } from "lucide-react";
import StartNewGame from "../components/startPage/StartNewGame";
import JoinRoom from "../components/startPage/JoinRoom";
import styles from "../styles/StartPage.module.css";
import logoImg from "../assets/images/logo_img.png";
import logoText from "../assets/images/logo_text.png";
import { MAX_NICKNAME_LENGTH } from "../domain/constants";
import { useState } from "react";

export default function StartPage() {
  const [nickname, setNickname] = useState("");

  return (
    <Box className={styles.pageWrapper}>
      <Stack className={styles.startPageContainer}>
        <Stack className={styles.logoContainer}>
          <Box className={styles.mascotBlock}>
            <Image className={styles.mascotImg} src={logoImg} alt="App Logo" />
          </Box>
          <Box className={styles.wordmarkBlock}>
            <Image
              className={styles.wordmarkImg}
              src={logoText}
              alt="AI Imposter"
            />
          </Box>
        </Stack>

        <TextInput
          className={styles.nicknameInput}
          label="Pick a nickname:"
          placeholder="Enter your nickname"
          leftSection={<User size={18} />}
          maxLength={MAX_NICKNAME_LENGTH}
          value={nickname}
          onChange={(event) => setNickname(event.currentTarget.value)}
        />

        <Flex className={styles.enterGameOptions}>
          <StartNewGame nickname={nickname} />
          <Box className={styles.orDivider}>
            <Box className={styles.orDividerLine} />
            <Box className={styles.orCircle}>
              <Text className={styles.orText}>Or</Text>
            </Box>
            <Box className={styles.orDividerLine} />
          </Box>
          <JoinRoom />
        </Flex>

        <Text className={styles.footerText}>
          Join with a nickname — no sign up required.
        </Text>
      </Stack>
    </Box>
  );
}
