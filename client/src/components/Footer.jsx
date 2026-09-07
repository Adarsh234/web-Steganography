import Image from 'next/image';
import Link from 'next/link';
import image1 from '../../assets/image/stegano1.jpg';
import image2 from '../../assets/image/stegano2.jpg';
import image3 from '../../assets/image/stegano3.jpg';

const resources = [
  {
    image: image1,
    title: "SecurityWeek",
    tag: "Threat Intel",
    href: "https://www.securityweek.com/",
    description: "Enterprise cyber threats & advanced steganographic attack surfaces."
  },
  {
    image: image2,
    title: "The Hacker News",
    tag: "Data Infiltration",
    href: "https://thehackernews.com/",
    description: "Global attack landscape, payload concealment, and exploit vectors."
  },
  {
    image: image3,
    title: "Security Ledger",
    tag: "Covert Channels",
    href: "https://securityledger.com/",
    description: "Deep dive into cybersecurity analysis, IoT security, and forensics."
  }
];

const Footer = () => {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#5A2E25]/15 text-[#5A2E25] mt-auto">
      {/* Editorial Content Cards Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-8 border-b border-[#5A2E25]/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#6F7F5F] font-bold">
              Research & Signals
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#5A2E25] tracking-tight font-display mt-1">
              Covert Channels & Threat Intel
            </h3>
          </div>
          <p className="text-xs text-[#5A2E25]/70 max-w-sm">
            Curated external security bulletins covering real-world LSB inspection, anti-forensics, and digital counter-measures.
          </p>
        </div>

        {/* 3-Column Editorial Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {resources.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between p-4 rounded-2xl bg-[#F0E6D8]/40 border border-[#5A2E25]/10 hover:border-[#B5543A]/40 transition-all duration-300"
            >
              <div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-[#5A2E25]/10 bg-[#5A2E25]/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#5A2E25]">
                    {item.tag}
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#5A2E25] flex items-center justify-between">
                  {item.title}
                  <span className="text-[#B5543A] text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </h4>
                <p className="text-xs text-[#5A2E25]/70 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#5A2E25]/10 text-[11px] font-semibold text-[#6F7F5F] uppercase tracking-wider">
                Visit Publication
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Masthead & Copyright Bar */}
      <div className="border-t border-[#5A2E25]/10 bg-[#FAF8F5]/60 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5A2E25]/75">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm font-display tracking-tight text-[#5A2E25]">
              zero<span className="text-[#B5543A]">~</span>trace
            </span>
            <span>•</span>
            <span>Client-side LSB Steganography Engine</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/encode" className="hover:text-[#B5543A] transition">
              Encode
            </Link>
            <Link href="/decode" className="hover:text-[#B5543A] transition">
              Decode
            </Link>
            <Link href="/upload-image" className="hover:text-[#B5543A] transition">
              Image Vault
            </Link>
          </div>

          <p className="text-[11px] text-[#5A2E25]/60">
            © {new Date().getFullYear()} zero~trace. In-memory Canvas Pixel Manipulation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;