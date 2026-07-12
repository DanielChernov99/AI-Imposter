import { Box, Flex, Image, Stack, Text, TextInput } from "@mantine/core";
import { User } from "lucide-react";
import StartNewGame from "../components/startPage/StartNewGame";
import JoinRoom from "../components/startPage/JoinRoom";
import styles from "../styles/StartPage.module.css";
import logoImg from "../assets/images/logo_img.png";
import logoText from "../assets/images/logo_text.png";
import { MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH } from "../domain/constants";
import { ROOM_SERVICE_ERRORS } from "../services/roomService.js";
import { useState } from "react";
import { useStores } from "../context/StoreContext.jsx";

export default function StartPage() {
  const [nickname, setNickname] = useState("");

  const { roomStore } = useStores();

  const handleNicknameChange = (event) => {
    const newNickname = event.currentTarget.value;
    setNickname(newNickname);

    const isNicknameValid = newNickname.trim().length >= MIN_NICKNAME_LENGTH;

    const isNicknameError =
      roomStore.error?.code === ROOM_SERVICE_ERRORS.INVALID_NICKNAME;

    if (isNicknameValid && isNicknameError) {
      roomStore.clearError();
    }
  };

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
          onChange={handleNicknameChange}
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
          <JoinRoom nickname={nickname} />
        </Flex>

        <Text className={styles.footerText}>
          Join with a nickname — no sign up required.
        </Text>
      </Stack>
    </Box>
  );
}
