function MissingPage() {
  return (
    <div
      className="w-full min-h-screen"
    >
      <div className="py-30"></div>
      <div className="z-10 grid h-full place-items-center text-center text-white drop-shadow">
        <div className="font-mono border-cyan-600 border-l-4 pl-1 text-xl bg-black/60">
          <span className="text-4xl">404</span>
          <br />
          <span className="text-sm">
            {" "}
            <span
              className="glitch-distort"
              style={{ animation: "distort-subtle 8s ease infinite" }}
            >
              ERROR
            </span>
            : Failed to find module. Please utilize standard navigation.
          </span>
        </div>
      </div>
      <div className="py-20"></div>
    </div>
  );
}

export default MissingPage;