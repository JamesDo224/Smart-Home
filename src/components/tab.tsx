import React from "react";
import styles from "./tabs.module.css";

interface TabsProps {
  selectedTabs: string[];
  onChange: (newSelected: string[]) => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedTabs, onChange }) => {
  const tabs = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const toggleTab = (tab: string) => {
    if (selectedTabs.includes(tab)) {
      onChange(selectedTabs.filter((t) => t !== tab));
    } else {
      onChange([...selectedTabs, tab]);
    }
  };

  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <React.Fragment key={tab}>
          <div
            className={`${styles.tab} ${
              selectedTabs.includes(tab) ? styles.selected : styles.unselected
            }`}
            onClick={() => toggleTab(tab)}
          >
            {tab}
          </div>
          {index < tabs.length - 1 && <div className={styles.separator}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Tabs;