import { useEffect, useRef } from "react";

interface TerminalFeedProps {
  logs: string[];
}

function TerminalFeed({ logs }: TerminalFeedProps) {
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={feedRef}
      className="
        h-full
        w-full
       bg-black/40
       text-cyan-100
       text-sm
       font-mono
       leading-none
        
       border border-cyan-500/30
       p-3
       overflow-y-auto
      "
    >
      {logs.map((log, i) => (
        <div key={i} className="whitespace-pre-wrap transition-all">
          {`>> ${log}`}
        </div>
      ))}
    </div>
  );
}

export default TerminalFeed;
