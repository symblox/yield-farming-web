const styles = theme => ({
  container: {
    position: "relative"
  },
  root: {
    position: "relative",
    borderRadius: "12px",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "20px",
    lineHeight: "28px",
    color: "#ACAEBC",
    boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
    height: "440px"
  },
  featuredRoot: {
    position: "relative",
    borderRadius: "12px",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "20px",
    lineHeight: "28px",
    color: "#ACAEBC",
    boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
    height: "380px"
    // color: "#FFFFFF",
    // background:
    //   "linear-gradient(124.56deg, #E71E85 -27.83%, #2148D3 55.48%, #2148D3)",
    // mixBlendMode: "normal",
  },
  featured: {
    filter: "blur(6px)",
    position: "absolute",
    top: "-2px",
    right: "-2px",
    bottom: "-2px",
    left: "-2px",
    background:
      "linear-gradient(45deg, rgb(255, 0, 0) 0%, rgb(255, 154, 0) 10%, rgb(208, 222, 33) 20%, rgb(79, 220, 74) 30%, rgb(63, 218, 216) 40%, rgb(47, 201, 226) 50%, rgb(28, 127, 238) 60%, rgb(95, 21, 242) 70%, rgb(186, 12, 248) 80%, rgb(251, 7, 217) 90%, rgb(255, 0, 0) 100%) 0% 0% / 300% 300%",
    animation: "2s linear 0s infinite normal none running bzhXFX",
    borderRadius: "16px"
  },
  icon: {
    width: "48px",
    height: "48px",
    position: "relative"
  },
  iconSecondary: {
    width: "51px",
    height: "24px",
    marginLeft: "8px"
  },
  title: {
    paddingTop: "17px",
    fontFamily: "Oswald",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "28px",
    lineHeight: "34px",
    opacity: "1 !important",
    color: "#1E304B",
    // color: (props) =>
    //   props.data && props.data.featured ? "#FFFFFF" : "#1E304B",
    "& span": {display: "inline-block", verticalAlign: "top"}
  },
  text: {
    fontStyle: "normal",
    fontSize: "20px",
    lineHeight: "20px",
    color: "#ACAEBC",
    opacity: "1 !important"
  },
  featuredText: {
    fontStyle: "normal",
    fontSize: "20px",
    lineHeight: "20px",
    color: "#ACAEBC",
    // color: "white",
    opacity: "1 !important"
  },
  textSecondary: {
    fontSize: "16px",
    paddingTop: "24px",
    textAlign: "left"
  },
  textThird: {
    fontSize: "16px",
    paddingTop: "8px",
    textAlign: "left"
  },
  textSecondaryColor: {
    color: "#36B685"
  },
  textThirdColor: {
    color: "#1E304B"
    // color: (props) =>
    //   props.data && props.data.featured ? "#FFFFFF" : "#1E304B",
  },
  tooltip: {
    fontSize: "16px",
    margin: "8px 0"
  },
  button: {
    background: "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
    borderRadius: "26px",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    color: "#FFFFFF",
    margin: "0px 24px 24px 24px",
    minWidth: "213px",
    "&:hover": {
      background: "linear-gradient(315deg, #4DB5FF 0%, #57E2FF 100%, #4DB5FF)"
    },
    "&.Mui-disabled": {
      background:
        "linear-gradient(135deg, rgb(66, 217, 254, 0.12) 0%, rgb(40, 114, 250,0.12) 100%, rgb(66, 217, 254, 0.12))",
      color: "#FFFFFF"
    }
  },
  buttonSecondary: {
    background: "linear-gradient(315deg, #FF3A33 0%, #FC06C6 100%, #FF3A33)",
    borderRadius: "26px",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    color: "#FFFFFF",
    margin: "0px 24px 24px 24px",
    minWidth: "80%",
    "&:hover": {
      background: "linear-gradient(315deg, #FF78E1 0%, #FF736E 100%, #FF78E1)"
    },
    "&.Mui-disabled": {
      background:
        "linear-gradient(135deg, rgb(255, 58, 51, 0.12) 0%, rgb(252, 6, 198, 0.12) 100%, rgb(255, 58, 51, 0.12))",
      color: "#FFFFFF"
    }
  },
  minButton: {
    margin: "12px 0",
    minWidth: "100%"
  },
  bar: {
    textAlign: "center",
    display: "block"
  }
});

export default styles;
