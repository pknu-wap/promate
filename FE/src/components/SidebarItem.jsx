// FE/src/components/SidebarItem.jsx
import { NavLink } from "react-router-dom";

function SidebarItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "menu-item active" : "menu-item"
      }
    >
      {icon && <span className="icon">{icon}</span>}
      <span className="label">{label}</span>
    </NavLink>
  );
}

export default SidebarItem;