import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import TerminalPanel from "./components/menu/TerminalPanel";
import TerminalFeed from "./components/menu/TerminalFeed";
import "./flicker.css";

const something: string[] = [
  ">This is a test message to ensure the menu is working as intended.",
  ">WARN: Much is under development, please excuse any links that route to 501 as we continue development!.",
  ">Eyes up pilot.",
  ">11! 11! 11! 11!",
  ">Remember, for some positioning manuevers there isnt a fixed amount of energy gain!",
];

const randomNum = Math.floor(Math.random() * something.length);

const bootLines: string[] = [
  "IUN COMMAND AND CONTROL SYSTEM INITIALIZING...",
  "GC Laboratories GCOS 8.4.92",
  "1.0.14 Gold Coast Laboratories // Government or Contractor use ONLY",
  "MSMK.DIV (R) GC.LABS (R) 8.0 (Build 08492)",
  "Connecting to IUN Databases",
  ">USERNAME: [*******]",
  ">PASSWORD: [************]",
  "Credentials verified. Welcome back Pilot.",
  "",
  "                     ##########                 ",
  "              ########    ########           ###",
  "          #####    ##########    #####     ## ##",
  "        ####  ####################  ######    # ",
  "      #### ############################       # ",
  "     ### ######################               # ",
  "    ##  ##################                   ## ",
  "   ##  ###############                       #  ",
  "  ##                                        ##  ",
  " ###  #####  #####    #####  #####    #### #### ",
  " ##   #####  #####    #####  ######   #### # ## ",
  " ##   #####  #####    #####  #######  ####   ## ",
  "### # #####  #####    #####  ######## #### # ###",
  "### # #####  #####    #####  #### ######## # ###",
  " ##   #####  #####    #####  ####  #######   ## ",
  " ##   #####  #############   ####   ######   ## ",
  " ###  #####   ###########    ####    #####  ### ",
  "  ##                                        ##  ",
  "   ##  ###          ###             #####  ##   ",
  "    ##  #        ###.              #####  ##    ",
  "     ###       ###               ###### ###     ",
  "     ##     ###               -###### -###      ",
  "   ##    ###               #######  ####        ",
  " ##  ####            #########   #####          ",
  " #####################     #######+             ",
  "                   ##########                ",
  "",
  something[randomNum],
  "",
  ">[IUNOS ::/] System Baked. Ready.",
];

function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-100), bootLines[index]]);

      index++;

      if (index >= bootLines.length) {
        clearInterval(interval);
        setIsBooting(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleHover = (path: string, description: string) => {
    if (isBooting) return;

    setLogs((prev) => [
      ...prev.slice(-40),
      `$ ${path}`,
      `>[IUNOS::/] ${description}`,
    ]);
  };

  return (
    <div className="w-full h-screen flex flex-col text-cyan-100">
      <div className="flex-1 overflow-hidden">
        <div className="relative z-10 h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {" "}
          <div className="flex flex-col h-full gap-3">
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
                title="AWACS"
                subtitle="AWACS Command and Control Systems"
                icon="✈"
                onHover={handleHover}
                link="/AWACS"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.3,
              }}
              className="flicker"
            >
              <TerminalPanel
                title="Character Manager"
                subtitle="Pilot Records"
                icon="❖"
                onHover={handleHover}
                link="/charactermanager"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.4,
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
                delay: 0.4,
              }}
              className="flicker"
            >
              <TerminalPanel
                title="Wiki"
                subtitle="Wikipedia References"
                icon="🗊"
                onHover={handleHover}
                link="https://sse.aceshigh.wiki/doku.php?id=start"
              />
            </motion.div>
          </div>
          <div className="h-full hidden md:block">
            <TerminalFeed logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerminalPage;
