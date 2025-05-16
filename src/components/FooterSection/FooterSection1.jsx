import { usePortfolio } from "@/context/PortfolioContext";

const Footer = ({ theme }) => {
  const { portfolio, loading } = usePortfolio();

  return (
    <footer
      className={`w-full py-4 text-center text-sm ${theme.subtext} ${theme.bg}`}
      id="footer"
    >
      © {new Date().getFullYear()} {portfolio.name} – All rights reserved.
    </footer>
  );
};

export default Footer;
