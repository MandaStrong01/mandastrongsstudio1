interface FooterProps {
  showDoxyCredit?: boolean;
}

export default function Footer({ showDoxyCredit = false }: FooterProps) {
  return (
    <footer className="w-full py-4 text-center">
      <p className="text-white/70 text-sm">
        MandaStrong1 2025{showDoxyCredit && ' ~ Author Of Doxy The School Bully'} ~ Also Find Fundraiser at{' '}
        <a
          href="https://MandaStrong1.Etsy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          MandaStrong1.Etsy.com
        </a>
      </p>
    </footer>
  );
}
