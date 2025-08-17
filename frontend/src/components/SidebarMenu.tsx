import { FaGear, FaHouse, FaPlus, FaUser } from "react-icons/fa6";
import logo from "../assets/logo.svg";
import LogoutButton from "./LogoutButton";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../state/user/useAuthStore";

function SidebarMenu() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { icon: <FaHouse />, to: "/" },
    { icon: <FaPlus />, to: "/create", special: true },
    { icon: <FaUser />, to: `/profile/${user?.uid}` },
    { icon: <FaGear />, to: "/settings" },
  ];

  return (
    <div className="h-full flex flex-col justify-between items-start">
      <img src={logo} alt="logo" width={45} />

      <ul className="flex flex-col gap-10 text-2xl text-stone-300 items-center">
        {menuItems.map(({ icon, to, special }, idx) => {
          const isActive = pathname === to;
          return (
            <li
              key={idx}
              className={`p-3 rounded-xl transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "text-accent"
                  : special
                  ? "bg-stone-200 text-stone-400 hover:text-accent"
                  : "hover:bg-stone-200 hover:text-stone-400"
              }`}
            >
              <Link to={to}>{icon}</Link>
            </li>
          );
        })}
      </ul>

      <LogoutButton />
    </div>
  );
}

export default SidebarMenu;
