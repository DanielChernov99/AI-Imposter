import { Box, Flex, Image, Stack, Text, TextInput, Title } from "@mantine/core";
import StartNewGame from "../components/startPage/StartNewGame";
import JoinRoom from "../components/startPage/JoinRoom";
import styles from "../components/startPage/StartPage.module.css";
import logo from "../assets/images/ai_imposter_logo.png";

export default function StartPage() {
  return (
    <Stack className={styles.startPageContainer}>
      <Stack className={styles.welcomeSection}>
        <Image className={styles.logo} src={logo} alt="App Logo"></Image>
        <Title className={styles.welcomeText}>Welcome</Title>
      </Stack>
      <TextInput
        className={styles.nicknameInput}
        placeholder="Enter your nickname"
      ></TextInput>
      <Flex className={styles.enterGameOptions}>
        <StartNewGame />
        <Box className={styles.orDivider}>
          <Box className={styles.orDividerLine} />
          <Box className={styles.orCircle}>
            <Text>Or</Text>
          </Box>
          <Box className={styles.orDividerLine} />
        </Box>
        <JoinRoom />
      </Flex>
    </Stack>
  );
}
