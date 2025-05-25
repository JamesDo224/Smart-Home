import React, { useState, useEffect } from "react";
import Switch from "./switch";
import styles from "./togglelist.module.css";
import bulbIcon from "../assets/bulb.png";
import curtainIcon from "../assets/curtain.png";
import windowIcon from "../assets/window.png";
import { getAllDevices } from "../services/getAlllDevices";
export interface ToggleItem {
  id: string; // id is now a string
  icon: string;
  label: string;
  state: boolean;
}

// Map device names to icons (adjust labels if needed)
const iconMap: { [key: string]: string } = {
  "Bóng đèn": bulbIcon,
  "Rèm cửa": curtainIcon,
  "Cửa sổ": windowIcon,
};

interface ToggleListProps {
  onChange: (selectedIds: string[]) => void;
  refreshTrigger?: boolean;
}

const ToggleList: React.FC<ToggleListProps> = ({  onChange, refreshTrigger }) => {
  const [items, setItems] = useState<ToggleItem[]>([]);

  // Fetch devices using the API when the component mounts.
  useEffect(() => {
    async function fetchDevices() {
      try {
        const result = await getAllDevices();
        // The API is expected to return { status, message, data: [ {id, name, feedName}, ... ] }
        if (result && result) {
          const toggleItems = result.map((device: any) => {
            let icon = "";
            if (device.name === "light") {
              icon = iconMap["Bóng đèn"];
            } else if (device.name === "motor") {
              icon = iconMap["Rèm cửa"];
            } else if (device.name === "servo") {
              icon = iconMap["Cửa sổ"];
            }
            if (icon) {
              return {
              id: device.id.toString(), // convert id to string
              label:
                device.name === "light"
                ? "Bóng đèn"
                : device.name === "motor"
                ? "Rèm cửa"
                : device.name === "servo"
                ? "Cửa sổ"
                : device.name,
              icon: icon,
              state: false,
              };
            }
            return null; // Exclude devices without a matching icon
          });
          setItems(toggleItems.filter((item): item is ToggleItem => item !== null));
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    }
    fetchDevices();
  }, [refreshTrigger]);

  // Toggle the state for a specific item.
  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, state: !item.state } : item
    );
    setItems(updated);
    // Pass the list of selected ids (as strings) to the parent component.
    onChange(updated.filter((item) => item.state).map((item) => item.id));
  };

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          {item.icon && (
            <img src={item.icon} alt={item.label} className={styles.icon} />
          )}
          <span className={styles.label}>{item.label}</span>
          <div className={styles.switch}>
            <Switch
              checked={item.state}
              onChange={() => handleToggle(item.id)}
              id={`switch-${item.id}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToggleList;