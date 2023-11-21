import styles from "./Header.module.scss";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className={`d-flex align-items-center ${styles.header}`}>
      <div className="flex-fill">
        <NavLink to="/">
          <img src={logo} alt="logo du blog" />
        </NavLink>
      </div>
      <ul>
        <NavLink to="login" className={`mr10 btn btn-primary`}>
          <span>Login</span>
        </NavLink>
        <NavLink to="register" className={`mr10 btn btn-primary-reverse`}>
          <span>Register</span>
        </NavLink>
      </ul>
    </header>
  );
}
