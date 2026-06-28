function InDevPage() {
  return (
    <div
      className="w-full min-h-screen"
    >
      <div className="py-30"></div>
      <div className="z-10 grid h-full place-items-center text-center text-white drop-shadow">
        <div className="  border-cyan-600 border-l-4 pl-1 text-xl bg-black/60 p-4">
          <span className="text-4xl">501</span>
          <br />
          <span className="text-sm">
            {" "}
            <span
              className="glitch-distort"
              style={{ animation: "distort-subtle 8s ease infinite" }}
            >
              IN DEVELOPMENT
            </span>
            : Current module is under development. Come back later!
          </span>
        </div>
      </div>
      <div className="py-20"></div>
    </div>
  );
}

export default InDevPage;