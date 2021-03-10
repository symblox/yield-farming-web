import React from "react";
import { withRouter } from "react-router-dom";

import { Header } from "../components/header/header";
import Footer from "../components/footer/footer";
import ExchangeSVLX from "../components/ExchangeSVLX";

const ExchangeSVLXPage = () => {
  return (
    <>
      <Header />
      <ExchangeSVLX />
      <Footer />
    </>
  );
};

export default withRouter(ExchangeSVLXPage);
