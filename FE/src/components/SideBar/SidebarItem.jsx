import { NavLink } from "react-router-dom";

function SidebarItem({ to, label, icon, activeIcon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "menu-item active" : "menu-item"
      }
    >
      {({ isActive }) => (
        <>
          {icon && (
            <span className="icon">
              <img src={isActive ? activeIcon : icon} alt="" />
            </span>
          )}

          <span className="label">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default SidebarItem;