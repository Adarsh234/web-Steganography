import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#5A2E25] selection:bg-[#F0E6D8] selection:text-[#5A2E25] flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md text-center">
        
        {/* Header / Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#5A2E25] font-display mb-2">
            zero<span className="text-[#B5543A]">~</span>trace
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
            Secure Steganography Workspace
          </p>
        </div>

        {/* 404 Card */}
        <div className="bg-[#F0E6D8]/30 border border-[#5A2E25]/15 rounded-3xl p-8 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center min-h-[250px]">
          
          <div className="text-7xl font-black text-[#B5543A] font-display leading-none mb-4">
            404
          </div>
          
          <h2 className="text-lg font-bold text-[#5A2E25] uppercase tracking-wider mb-2">
            Vector Not Found
          </h2>
          
          <p className="text-xs text-[#5A2E25]/70 font-mono leading-relaxed max-w-[250px] mb-8">
            The requested payload directory does not exist, has been redacted, or was never generated.
          </p>

          <Link 
            href="/"
            className="px-8 py-3 rounded-full bg-[#5A2E25] text-[#FAF8F5] text-xs font-bold tracking-wider uppercase hover:bg-[#5A2E25]/90 transition-all shadow-sm active:scale-[0.98]"
          >
            Return to Root
          </Link>
          
        </div>
      </div>
    </div>
  );
}