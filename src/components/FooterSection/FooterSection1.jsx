import { usePortfolio } from "@/context/PortfolioContext";

const Footer = ({ theme, sectionRef }) => {
  const { portfolio, loading } = usePortfolio();

  return (
    <footer
      ref={sectionRef}
      className={`w-full max-w-7xl mx-auto py-4 text-center text-sm ${theme.subtext} ${theme.bg}`}
      id="footer"
    >
      © {new Date().getFullYear()} {portfolio?.name || ""} – All rights
      reserved.
    </footer>
  );
};

export default Footer;
