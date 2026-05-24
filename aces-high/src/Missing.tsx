function MissingPage() {
  return (
    <div
      className="bg-repeat bg-neutral-800 w-full min-h-screen"
    >
      <div className="py-50"></div>
      <div className="z-10 grid h-full place-items-center text-center text-white drop-shadow">
        <div className="font-mono border-orange-600 border-l-4 pl-1 text-xl bg-neutral-900/90">
          <span className="text-4xl">404</span>
          <br />
          <span className="text-sm">
            {" "}
            <span
              className="text-red-700"
            >
              ERROR
            </span>
            : Failed to find module. Please utilize standard navigation.
          </span>
        </div>
      </div>
    </div>
  );
}

export default MissingPage;