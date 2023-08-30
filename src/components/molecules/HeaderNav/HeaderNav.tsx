import Logo from "../../atoms/Logo";
import NavLink from "../../atoms/NavLink";

import classes from "./NavLink.module.scss";

const HeaderNav = () => {
  return (
    <nav className={classes["header-nav"]}>
      <Logo />
      <ul className={classes["header-nav-list"]}>
        <NavLink label="Resume" />
        <NavLink label="Resume" />
        <NavLink label="Resume" />
        <NavLink label="Resume" />
      </ul>
    </nav>
  );
};

export default HeaderNav;
