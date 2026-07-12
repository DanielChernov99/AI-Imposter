import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";

function LobbyPage() {
  return (
    <main className={styles.page}>
      <Header />
      <LobbyCard />
    </main>
  );
}

export default LobbyPage;
