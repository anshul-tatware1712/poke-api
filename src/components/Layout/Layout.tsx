import Header from "../Header";

const Layout = ({
  children,
}: {
  children: React.ReactNode;
  noFooter?: boolean;
}) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
