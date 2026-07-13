import { Box, Flex, Image, Text, TextInput } from "@mantine/core";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

import { useStores } from "../context/StoreContext.jsx";
import StartNewGame from "../components/startPage/StartNewGame";
import JoinRoom from "../components/startPage/JoinRoom";
import styles from "../styles/StartPage.module.css";
import logoImg from "../assets/images/logo_img.png";
import logoText from "../assets/images/logo_text.png";
import { MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH } from "../domain/constants";
import { ROOM_SERVICE_ERRORS } from "../services/contracts/roomService.js";

const nicknames = [
  "Enter your nickname ...",
  "AIHunter",
  "BotBuster",
  "Human.exe",
  "CodeBreaker",
  "NeuralNinja",
  "PixelGhost",
  "LogicLurker",
  "ByteBandit",
  "CtrlAltElite",
  "PromptPirate",
  "DataDetective",
  "SiliconSleuth",
  "BrainBotter",
  "TheDebugger",
  "GlitchMaster",
  "SyntaxSamurai",
  "CipherFox",
  "AlgoAce",
  "QuantumQuokka",
  "BinaryPhantom",
  "ZeroOneZero",
  "CircuitShadow",
  "NeuralNomad",
  "BotSniffer",
  "AIWhisperer",
  "TokenTactician",
  "PromptWizard",
  "MachineMimic",
  "FakeFinder",
  "ImposterHunter",
  "TruthSeeker",
  "AnswerAnalyst",
  "MindReader",
  "GuessMaster",
  "ClueCrusher",
  "VoteViper",
  "BrainDetective",
  "MysteryMind",
  "ShadowPlayer",
  "HiddenHuman",
  "RealOrBot",
  "TheVerifier",
  "SuspiciousSoul",
  "CleverChimp",
  "SneakyNeuron",
  "RogueReasoner",
  "ThoughtThief",
  "CosmicCoder",
  "EchoEngine",
  "TheLastHuman",
];
export default function StartPage() {
  const [nickname, setNickname] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [nicknameIndex, setNicknameIndex] = useState(0);
  const [mode, setMode] = useState("typing");

  const { roomStore } = useStores();

  const handleNicknameChange = (event) => {
    const newNickname = event.currentTarget.value;
    setNickname(newNickname);

    if (!newNickname) {
      setPlaceholder("");
    }

    const isNicknameValid = newNickname.trim().length >= MIN_NICKNAME_LENGTH;

    const isNicknameError =
      roomStore.error?.code === ROOM_SERVICE_ERRORS.INVALID_NICKNAME;

    if (isNicknameValid && isNicknameError) {
      roomStore.clearError();
    }
  };
  useEffect(() => {
    if (nickname) return; // pause animation while user is typing

    const suggestedNickname = nicknames[nicknameIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      charIndex++;

      setPlaceholder(suggestedNickname.slice(0, charIndex));

      if (charIndex === suggestedNickname.length) {
        clearInterval(typingInterval);

        setTimeout(() => {
          setMode("deleting");
        }, 2000);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [nicknameIndex, nickname]);

  useEffect(() => {
    if (nickname || mode !== "deleting") return;

    const deletingInterval = setInterval(() => {
      setPlaceholder((prev) => {
        const next = prev.slice(0, -1);

        if (next === "") {
          clearInterval(deletingInterval);

          setNicknameIndex((prevIndex) => (prevIndex + 1) % nicknames.length);

          setMode("typing");
        }

        return next;
      });
    }, 100);

    return () => clearInterval(deletingInterval);
  }, [mode, nickname]);
  return (
    <Box className={styles.pageWrapper}>
      <Flex className={styles.startPageContainer}>
        <Flex className={styles.logoContainer}>
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
        </Flex>

        <TextInput
          className={styles.nicknameInput}
          label="Pick a nickname:"
          placeholder={placeholder}
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
      </Flex>
    </Box>
  );
}
