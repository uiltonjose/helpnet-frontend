import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ListOSOpened from "./ListOSOpened";
import ListOSInProgress from "./ListOSInProgress";
import ListOSClosed from "./ListOSClosed";

class OSTab extends Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>OS Abertas</Tab>
          <Tab>OS em atendimento</Tab>
          <Tab>OS concluídas</Tab>
        </TabList>

        <TabPanel>
          <ListOSOpened />
        </TabPanel>
        <TabPanel>
          <ListOSInProgress />
        </TabPanel>
        <TabPanel>
          <ListOSClosed />
        </TabPanel>
      </Tabs>
    );
  }
}

export default OSTab;
