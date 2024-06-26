import * as React from "react";
import {
  Tab as _Tab,
  TabList as _TabList,
  TabPanel as _TabPanel,
  Tabs as _Tabs,
} from "react-aria-components";
import { cn } from "~/utils/misc";

const Tabs = _Tabs;

const TabList = ({
  className,
  ...props
}: React.ComponentProps<typeof _TabList>) => (
  <_TabList
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
);

const Tab = ({ className, ...props }: React.ComponentProps<typeof _Tab>) => (
  <_Tab
    className={cn(
      "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus:outline-none data-[disabled]:pointer-events-none data-[selected]:bg-background data-[selected]:text-foreground data-[disabled]:opacity-50 data-[selected]:shadow-sm data-[focus-visible]:outline-none data-[focused]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
      className
    )}
    {...props}
  />
);

const TabPanel = ({
  className,
  ...props
}: React.ComponentProps<typeof _TabPanel>) => (
  <_TabPanel
    className={cn(
      "mt-2 ring-offset-background data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
      className
    )}
    {...props}
  />
);

export { Tabs, TabList, TabPanel, Tab };
