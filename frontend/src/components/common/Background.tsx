function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-(--ah-bg)">
      {/* Base */}
      <div
        className="
          absolute inset-0
          bg-linear-to-b
          from-(--ah-bg)
          via-(--ah-bg-mid)
          to-(--ah-bg)
        "
      />

      {/* Dot Matrix */}
      <div
        className="
          absolute inset-0
          opacity-[0.4]
          bg-[radial-gradient(var(--ah-dots)_1px,transparent_1px)]
          bg-size-[22px_22px]
          animate-[gridMove_20s_linear_infinite]
        "
      />

      {/* Glow */}
      <div
        className="
          absolute
          top-[-20%]
          left-[-10%]
          w-225
          h-225
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      {/* Vignette */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.75)_100%)]
        "
      />
    </div>
  );
}

export default Background;