import { usePortfolio } from "@/context/PortfolioContext";

const FooterSection2 = ({ theme }) => {
  const { portfolio } = usePortfolio();
  return (
    <footer
      className={`w-full py-6 px-4 text-center ${theme.bg} ${theme.text} `}
      id="footer"
    >
      <p className={`text-sm ${theme.subtext}`}>
        © {new Date().getFullYear()} {portfolio.name} – All rights reserved.
      </p>
      <p className={`text-xs mt-1 ${theme.subtext}`}>
        Striving for excellence in everything I do.
      </p>
    </footer>
  );
};

export default FooterSection2;
