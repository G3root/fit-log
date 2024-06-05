import { Outlet, useLocation } from "@remix-run/react";

import { Tab, Tabs, TabPanel, TabList } from "~/components/tabs";

export default function TimerLayout() {
  const { pathname } = useLocation();
  return (
    <Tabs selectedKey={pathname}>
      <TabList>
        <Tab id="/timer" href="/timer">
          Timer
        </Tab>
        <Tab id="/timer/stop-watch" href="/timer/stop-watch">
          Stop Watch
        </Tab>
      </TabList>
      <TabPanel id={pathname}>
        <Outlet />
      </TabPanel>
    </Tabs>
  );
}
