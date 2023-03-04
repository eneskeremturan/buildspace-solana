import "./App.css";
import React, { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { Buffer } from "buffer";
import kp from "./keypair.json";
import { Button, Grid, Paper, Typography } from "@mui/material";
import fightButton from "../src/assets/fightButton.png";
// import idlemor from "../src/assets/idlemor.gif";
// import kosma from "../src/assets/kosma-mor.gif";
// import atack from "../src/assets/ATACK-Mor-Sakal.gif";
import back1 from "../src/assets/back1.jpg";
import back2 from "../src/assets/back2.webp";
import winner from "../src/assets/121212.png";
import back3 from "../src/assets/back3.png";
import backbut from "../src/assets/123123.png";

import Header from "./components/Header";
import { Box, height } from "@mui/system";

window.Buffer = Buffer;
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// // Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey("CJ9gp6GkxwseDmEQ1fA5BLN2frsciAzUC5TtQvU4idwf");

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};
// SystemProgram is a reference to the Solana runtime!

// Constants
const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);
  const [fight, setFight] = useState(false);
  const [warrior, setWarrior] = useState(1);
  const [winLose, setWinLose] = useState(0);

  const atack =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/ATACK-Mor-Sakal.gif";
  const idlemor =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/idlemor.gif";
  const kosma =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/kosma-mor.gif";
  const atack2 =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/kaptan-disko-atak.gif";
  const idlemors =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/IDLE-1-Kaptan-Disko-(1).gif";
  const kosma2 =
    "https://gamerarenamobile.s3.eu-central-1.amazonaws.com/gamePics/kaptan-disko-(2).gif";

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };
  const getProgram = async () => {
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(programID, getProvider());
    // Create a program that you can call
    return new Program(idl, programID, getProvider());
  };
  const getGifList = async () => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!");
      return;
    }
    setInputValue("");
    console.log("Gif link:", inputValue);
    try {
      const provider = getProvider();
      const program = await getProgram();

      await program.rpc.addGif(inputValue, "another value", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue);

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  };
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();

      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    // We're using optional chaining (question mark) to check if the object is null
    if (window?.solana?.isPhantom) {
      console.log("Phantom wallet found!");
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log("Connected :", response.publicKey.toString());
      //users public address
      setWalletAddress(response.publicKey.toString());
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  };
  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't been initialized.
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return (
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input
              type="text"
              placeholder="Enter gif link!"
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            {/* We use index as the key instead, also, the src is now item.gifLink */}
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img className="img" src={item.gifLink} />
                <p className="sub-text-small">{item.userAddress.toString()}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // Call Solana program here.
      getGifList();
      // Set state
      //setGifList(TEST_GIFS);
    }
  }, [walletAddress]);
  useEffect(() => {
    if (warrior !== 4) {
      setTimeout(() => {
        setWarrior((prev) => prev + 1);
      }, 5000);
    }
  }, [warrior]);

  return (
    <Paper
      sx={{
        // background: "linear-gradient(to right bottom, #9945FF, #15F195)",
        backgroundImage: `url(${back1})`,
        width: "100%",
        height: "100vh",
        backgroundSize: "100% 100%",
        border: "1px solid black",
      }}
    >
      {walletAddress ? (
        <Grid container display="flex" height="100vh">
          {fight ? (
            <>
              {/* --------------------1. USER ------------------------ */}
              <Grid
                item
                xs={6}
                alignItems="center"
                display="center"
                justifyContent="end"
              >
                {warrior === 4 && (
                  <Grid
                    style={{
                      paddingRight: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${winner})`,
                        width: "360px",
                        height: "116px",
                      }}
                    />
                    <Box
                      sx={{
                        backgroundImage: `url(${idlemor})`,
                        width: "140px",
                        height: "120px",
                        webkitTransform: "scaleX(-1)",
                        transform: "scaleX(-1)",
                      }}
                    />
                  </Grid>
                )}
                {warrior === 1 && (
                  <Grid
                    style={{
                      paddingRight: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${idlemor})`,
                        width: "140px",
                        height: "120px",
                        webkitTransform: "scaleX(-1)",
                        transform: "scaleX(-1)",
                      }}
                    />
                  </Grid>
                )}
                {warrior === 2 && (
                  <Grid
                    style={{
                      paddingRight: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${kosma})`,
                        width: "81px",
                        height: "75px",
                        webkitTransform: "scaleX(-1)",
                        transform: "scaleX(-1)",
                        position: "relative",
                        animationName: "example1",
                        animationDuration: "5s",
                        animationDirection: "alternate",
                        "@keyframes example1": {
                          "0%": { left: "0px" },
                          "5%": { left: "10px" },
                          "10%": { left: "20px" },
                          "15%": { left: "30px" },
                          "20%": { left: "40px" },
                          "25%": { left: "50px" },
                          "30%": { left: "60px" },
                          "35%": { left: "70px" },
                          "40%": { left: "80px" },
                          "45%": { left: "90px" },
                          "50%": { left: "100px" },
                          "55%": { left: "110px" },
                          "60%": { left: "120px" },
                          "65%": { left: "130px" },
                          "70%": { left: "140px" },
                          "75%": { left: "150px" },
                          "80%": { left: "160px" },
                          "85%": { left: "170px" },
                          "90%": { left: "180px" },
                          "95%": { left: "190px" },
                          "100%": { left: "200px" },
                        },
                      }}
                    />
                  </Grid>
                )}
                {warrior === 3 && (
                  <Box
                    sx={{
                      backgroundImage: `url(${atack})`,
                      width: "103px",
                      height: "80px",
                      webkitTransform: "scaleX(-1)",
                      transform: "scaleX(-1)",
                      position: "absolute",
                      bottom: 88,
                    }}
                  />
                )}
              </Grid>
              {/* -------------------------------------------- */}
              {/* ---------------2. USER----------------------------- */}
              <Grid
                item
                xs={6}
                alignItems="center"
                display="center"
                justifyContent="start"
              >
                {warrior === 4 && (
                  <Grid
                    style={{
                      paddingRight: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${winner})`,
                        width: "360px",
                        height: "116px",
                      }}
                    />
                    <img src={idlemors} alt="Atack" />
                  </Grid>
                )}
                {warrior === 1 && (
                  <Grid
                    style={{
                      paddingLeft: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <img src={idlemors} alt="Atack" />
                    {/* <Box
                      sx={{
                        backgroundImage: `url(${idlemors})`,
                        width: "99px",
                        height: "60px",
                      }}
                    /> */}
                  </Grid>
                )}
                {warrior === 2 && (
                  <Grid
                    style={{
                      paddingLeft: "200px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${kosma2})`,
                        width: "60px",
                        height: "62px",
                        position: "relative",
                        animationName: "example",
                        animationDuration: "5s",
                        // animationIterationCount: 1,
                        animationDirection: "alternate",
                        "@keyframes example": {
                          "0%": { right: "0px" },
                          "5%": { right: "10px" },
                          "10%": { right: "20px" },
                          "15%": { right: "30px" },
                          "20%": { right: "40px" },
                          "25%": { right: "50px" },
                          "30%": { right: "60px" },
                          "35%": { right: "70px" },
                          "40%": { right: "80px" },
                          "45%": { right: "90px" },
                          "50%": { right: "100px" },
                          "55%": { right: "110px" },
                          "60%": { right: "120px" },
                          "65%": { right: "130px" },
                          "70%": { right: "140px" },
                          "75%": { right: "150px" },
                          "80%": { right: "160px" },
                          "85%": { right: "170px" },
                          "90%": { right: "180px" },
                          "95%": { right: "190px" },
                          "100%": { right: "200px" },
                        },
                      }}
                    />
                    <img
                      src={kosma2}
                      alt="Atack"
                      style={{
                        backgroundImage: `url(${kosma2})`,
                        width: "60px",
                        height: "62px",
                        position: "relative",
                        animationName: "example",
                        animationDuration: "5s",
                        // animationIterationCount: 1,
                        animationDirection: "alternate",
                        "@keyframes example": {
                          "0%": { right: "0px" },
                          "5%": { right: "10px" },
                          "10%": { right: "20px" },
                          "15%": { right: "30px" },
                          "20%": { right: "40px" },
                          "25%": { right: "50px" },
                          "30%": { right: "60px" },
                          "35%": { right: "70px" },
                          "40%": { right: "80px" },
                          "45%": { right: "90px" },
                          "50%": { right: "100px" },
                          "55%": { right: "110px" },
                          "60%": { right: "120px" },
                          "65%": { right: "130px" },
                          "70%": { right: "140px" },
                          "75%": { right: "150px" },
                          "80%": { right: "160px" },
                          "85%": { right: "170px" },
                          "90%": { right: "180px" },
                          "95%": { right: "190px" },
                          "100%": { right: "200px" },
                        },
                      }}
                    />
                  </Grid>
                )}
                {warrior === 3 && (
                  <Box
                    sx={{
                      backgroundImage: `url(${atack2})`,
                      width: "120px",
                      height: "60px",
                      position: "absolute",
                      bottom: 88,
                    }}
                  />
                )}
              </Grid>
              {/* -------------------------------------------- */}
            </>
          ) : (
            <>
              <Grid
                item
                xs={12}
                justifyContent="center"
                alignItems="center"
                display="center"
              >
                <Button onClick={() => setFight(true)}>
                  <Box
                    sx={{
                      backgroundImage: `url(${fightButton})`,
                      width: "200px",
                      height: "200px",
                    }}
                  />
                </Button>
              </Grid>
            </>
          )}

          {/* {walletAddress && renderConnectedContainer()} */}
        </Grid>
      ) : (
        <Grid
          container
          alignItems="center"
          display="center"
          justifyContent="center"
        >
          <Box
            sx={{
              backgroundImage: `url(${back3})`,
              width: "100%",
              height: "300px",
              backgroundSize: "100% 100%",
            }}
          />
          <Button onClick={connectWallet}>
            <Box
              sx={{
                backgroundImage: `url(${backbut})`,
                width: "460px",
                height: "164px",
              }}
            />
          </Button>
          {/* {renderNotConnectedContainer()} */}
        </Grid>
      )}
    </Paper>
  );
};

export default App;
