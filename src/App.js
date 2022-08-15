import React, { useCallback, useState } from "react";
import cuid from "cuid";
import Dropzone from "./components/Dropzone";
import ImageGrid from "./components/ImageGrid";
import "./index.css";
import "./App.css";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
// import { DotWave } from "@uiball/loaders";
import { baseUrl } from "./constants/urlConstants";
import PredictionResult from "./components/PredictionResult";
import { motion } from "framer-motion";

// import FormData from "form-data";
import axios from "axios";

function App() {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState();

  const [selected, setSelected] = useState(
    images.length > 0 && images[0].file.name
  );

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result, file: file },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const interpretPrediction = (response_body) => {
    // switch (response_body) {
    //   case "NORMAL":

    //     break;
    //   case "COVID":

    //     break;
    //   case "PNEUMONIA":

    //     break;

    //   default:
    //     break;

    return {
      value: response_body.data,
      message: response_body.data,
    };
  };

  const submitHandler = async () => {
    setOpen(true);
    console.log(images);

    // Make a rest call to the backend
    const errorMessage =
      "An internal error occurred. Please contact the support team.";
    try {
      const url = baseUrl + `/predict/images`;

      const formdata = new FormData();
      images.map((image) =>
        formdata.append("files", image.file, image.file.name)
      );

      let res = await axios({
        method: "post",
        url: url,
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);
      let responseJson = res.data;
      // let responseJson = res;
      if (res.status === 200) {
        console.log(responseJson);
        setPrediction(responseJson);
      } else {
        console.log("Some error occured");
        console.log(responseJson);
        setPrediction(errorMessage);
      }
    } catch (err) {
      console.log(err);
      setPrediction(errorMessage);
    }
    // sleep for 5 sec for testing loader
    // --await new Promise((resolve) => setTimeout(resolve, 5000));

    setOpen(false);
  };

  //TODO: customize this based on use-case
  const customPredictionResultStyle = {
    type: "binary",
    positive: prediction && prediction[selected] === "NORMAL",
  };

  return (
    <main className="App">
      {/* <h1 className="title">Chest x-ray diagnosis</h1> */}
      <div className="title">
        <motion.div animate={{ y: 40 }}>
          <h1>
            <span>
              Fast and inexpensive test that may potentially diagnose COVID-19
            </span>
            COVID-19 <em>diagnosis</em> from chest x-rays
          </h1>
        </motion.div>
      </div>
      <Dropzone onDrop={onDrop} accept={"image/*"} />
      <ImageGrid
        images={images}
        onSelectImage={setSelected}
        selectedImage={selected}
      />

      <motion.div
        className="box"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          default: {
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          },
          scale: {
            type: "spring",
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
      >
        <button className="btn btn-grad" onClick={submitHandler}>
          Submit
        </button>
      </motion.div>
      {prediction && (
        <PredictionResult {...customPredictionResultStyle}>
          {/* {console.log(prediction)}
          {console.log("predictoion result for :" + selected)}
          {console.log("result :" + prediction[selected])} */}
          {prediction[selected]}
        </PredictionResult>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
        {/* <DotWave size={47} speed={1} color="white" /> */}
      </Backdrop>
      {console.log(images)}
    </main>
  );
}

export default App;
