import { Flex, Image, Stack, TextInput, Title } from "@mantine/core";
import StartNewGame from "../components/startPage/StartNewGame";
import JoinRoom from "../components/startPage/JoinRoom";
import styles from "../components/startPage/StartPage.module.css";

export default function StartPage() {
  return (
    <Stack className={styles.startPageContainer}>
      <Stack className={styles.welcomeSection}>
        <Image></Image>
        <Title>Welcome</Title>
      </Stack>
      <TextInput placeholder="Enter your nickname"></TextInput>
      <Flex className={styles.enterGameOptions}>
        <StartNewGame />
        {/* <div className={styles.divider} /> */}
        <JoinRoom />
      </Flex>
    </Stack>
  );
}
