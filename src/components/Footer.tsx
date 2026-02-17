interface FooterProps {
  showDoxyCredit?: boolean;
}

export default function Footer({ showDoxyCredit = false }: FooterProps) {
  return (
    <footer className="w-full py-6 px-4 text-center bg-[#4c1d95]/20 border-t border-[#6d28d9]/30">
      <p className="text-white/80 text-xs sm:text-sm break-words leading-relaxed">
        MandaStrong1 2025{showDoxyCredit && ' ~ Author Of Doxy The School Bully'} ~ Fundraiser:{' '}
        <span className="font-semibold">Educational Program on Bullying Prevention & Social Skills</span> ~{' '}
        All Etsy Store Proceeds Benefit Veterans Mental Health Services ~{' '}
        <a
          href="https://MandaStrong1.Etsy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#a78bfa] hover:text-[#a78bfa] underline font-semibold transition-colors"
        >
          MandaStrong1.Etsy.com
        </a>
      </p>
    </footer>
  );
}
