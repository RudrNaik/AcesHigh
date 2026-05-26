function Background() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#020611]">
      {/* Base */}
      <div
        className="
          absolute inset-0
          bg-linear-to-b
          from-[#020611]
          via-[#06141f]
          to-[#020611]
        "
      />

      {/* Dot Matrix */}
      <div
        className="
          absolute inset-0
          opacity-[0.4]
          bg-[radial-gradient(rgba(180,220,255,0.35)_1px,transparent_1px)]
          bg-size-[22px_22px]
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