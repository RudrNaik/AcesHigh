import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import TerminalPanel from "./components/menu/TerminalPanel";
import TerminalFeed from "./components/menu/TerminalFeed";

const something: string[] = [
  ">This is a test message to ensure the menu is working as intended.",
  ">WARN: Much is under development, please excuse any links that route to 404.",
  ">Eyes up pilot."
];

const randomNum = Math.floor(Math.random() * something.length);

const bootLines: string[] = [
  "GOLD COAST COMMAND AND CONTROL SYSTEM",
  "GC Laboratories CCS NETWORK",
  "Credentials verified. Welcome back Pilot.",
  "",
  something[randomNum],
  "",
  ">[GCOS ::/] System Baked. Ready.",
];


function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setLogs((prev) => [
        ...prev.slice(-30),
        bootLines[index],
      ]);

      index++;

      if (index >= bootLines.length) {
        clearInterval(interval);
        setIsBooting(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleHover = (
    path: string,
    description: string
  ) => {
    if (isBooting) return;

    setLogs((prev) => [
      ...prev.slice(-28),
      `$ ${path}`,
      `>[GCOS::/] ${description}`,
    ]);
  };

  return (
    <div
      className="w-full h-fill min-h-screen text-cyan-100"
    >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
              className="flicker"
            >
              <TerminalPanel
                title="Ordnance and Airframes"
                subtitle="Equipment Database"
                icon="✱"
                onHover={handleHover}
                link="/equipment"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
              }}
              className="flicker"
            >
              <TerminalPanel
                title="Rulebook"
                subtitle="Flight Manual"
                icon="🗊"
                onHover={handleHover}
                link="https://docs.google.com/document/d/1NH2TJWfAlQ5-e2CO07gO1Ws8VHIUYpnsuSKNOeARu60/edit?tab=t.0#heading=h.dlr8nvp3ogxl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
              }}
              className="flicker"
            >
              <TerminalPanel
                title="Character Manager"
                subtitle="Pilot Records"
                icon="❖"
                onHover={handleHover}
                link="/InDev"
              />
            </motion.div>
          </div>

          <div className="h-full hidden md:block">
            <TerminalFeed logs={logs} />
          </div>
        </div>
    </div>
  );
}

export default TerminalPage;