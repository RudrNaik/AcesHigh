import info from "./data/DevInfo.json";

function About() {
  return (
    <div className="w-full min-h-screen">
      <div className="z-10 grid h-full place-items-center text-cyan-50 drop-shadow gap-2 py-10">
        <div className="text-cyan-100 text-2xl">
          People Involved
        </div>
        {info.map((dev) => {
          return (
            <div
              key={dev.id}
              className="border-cyan-600 border-l-4 pl-1 text-xl bg-(--ah-bgop60) p-4 max-w-9/10 min-w-8/10"
            >
              <span className="text-4xl">{dev.name}</span>
              <br />
              <span className="text-sm"> {dev.role}</span>
              <br/>
              <span className="text-xs"> {dev.desc} </span>
              <br/>
              <span className="text-sm flex flex-row gap-2">
                {dev.links.map((link) => (
                  <a href={link[1]} className="italic underline">
                    {link[0]}
                  </a>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      <div className="py-20"></div>
    </div>
  );
}

export default About;
