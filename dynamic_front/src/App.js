import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import UserProvider from "./components/Provider/UserProvider";

function App() {
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <UserProvider>
        <Header />
        <Outlet />
        <Footer />
      </UserProvider>
    </div>
  );
}

export default App;
