import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../../flicker.css";

interface TerminalPanelProps {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  onHover?: (path: string, subtitle: string) => void;
}

function TerminalPanel({
  title,
  subtitle,
  icon,
  onHover,
  link,
}: TerminalPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.1,
      }}
      className="flicker"
    >
      <Link to={link}>
        <div
          onMouseEnter={() => {
            if (onHover) {
              onHover(`/access/${title.toLowerCase()}`, subtitle);
            }
          }}
          className="
          group
          relative
          overflow-hidden
          border-b border-cyan-400/40
          transition-all duration-200
          hover:border-cyan-400/70
          hover:bg-cyan-200/9
          hover:border-l-4
          hover:animate-pulse
          cursor-pointer
          mb-3
          pt-2
        "
        >
          {/* Content */}
          <div className="relative z-10 p-5 font-mono">
            {/* Header */}
            <div className="">
              <div className="flex items-center gap-3">
                {icon && (
                  <span
                    className="
                  text-cyan-300
                  text-2xl
                  font-bold
                "
                  >
                    {icon}
                  </span>
                )}

                <h1
                  className="
                  text-lg
                  md:text-2xl
                  font-semibold
                  uppercase
                  text-cyan-100
                "
                >
                  {title}
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className="
              text-xs
              tracking-[0.2em]
              uppercase
              text-cyan-200/70
            "
            >
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default TerminalPanel;
