import React from "react";
import { withRouter } from "react-router-dom";

import { Header } from "../components/header/header";
import Footer from "../components/footer/footer";
import ExchangeSyx from "../components/ExchangeSyx";

const ExchangeSyxPage = () => {
  return (
    <>
      <Header />
      <ExchangeSyx />
      <Footer />
    </>
  );
};

export default withRouter(ExchangeSyxPage);
