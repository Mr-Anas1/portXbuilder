const Footer = ({ theme }) => {
  return (
    <footer
      className={`w-full py-4 text-center text-sm ${theme.subtext} ${theme.bg}`}
      id="footer"
    >
      © 2025 Mohamed Anas – All rights reserved.
    </footer>
  );
};

export default Footer;
