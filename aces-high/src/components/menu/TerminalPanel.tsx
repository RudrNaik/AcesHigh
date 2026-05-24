import { Link } from "react-router-dom";

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
    <div>
      <Link to={link}>
        <div
          onMouseEnter={() =>
            {if(onHover){onHover(`/access/${title.toLowerCase()}`, subtitle)}}
          }
          className="
            relative
            p-4 pl-6 pr-10
            border border-blue-500/80
            rounded-md
            bg-neutral-900
            bg-[radial-gradient(circle,rgba(255,100,0,0.06)_1px,transparent_1px)]
            bg-size-[8px_8px]
            hover:bg-blue-500/80
            hover:shadow-inner
            transition duration-200
            group cursor-pointer
          "
        >
          <h1 className="text-2xl font-bold tracking-wider flex items-center gap-3 p-2">
            <span className="text-blue-400">{icon}</span>
            {title}
          </h1>

          <p className="text-xs text-gray-300 tracking-wider flex items-center">
            &gt; {subtitle}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default TerminalPanel;