import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { Icon } from "~/components/icon";
import type { IconName } from "~/icons";

type NavLinks = {
  label: string;
  to: string;
  icon: IconName;
};

const NavLinks: NavLinks[] = [
  {
    label: "Home",
    to: "/",
    icon: "Home",
  },
  {
    label: "Timer",
    to: "/timer",
    icon: "Timer",
  },
];

export function Sidebar() {
  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
      {NavLinks.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex h-9 w-9 items-center justify-center md:h-8 md:w-8 ",
              isActive
                ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                : "rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                name={item.icon}
                className={clsx(
                  isActive && "transition-all group-hover:scale-110"
                )}
                size={isActive ? "sm" : "md"}
              />
              <span className="sr-only">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
