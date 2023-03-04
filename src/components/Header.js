import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import bckgrnd from "../assets/backgrnd.png";
import logo from "../assets/12344.gif";
import { Box } from "@mui/system";
const Header = () => {
  return (
    <Container maxWidth="xl" sx={{ backgroundImage: `url(${bckgrnd})` }}>
      <Toolbar disableGutters>
        <Box
          sx={{
            backgroundImage: `url(${logo})`,
            width: "80px",
            height: "80px",
          }}
        ></Box>
        {/* <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO
        </Typography> */}
      </Toolbar>
    </Container>
  );
};

export default Header;
