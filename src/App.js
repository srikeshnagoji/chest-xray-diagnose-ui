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
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
    setSelected(images[0].file.name);
    setOpen(false);
  };

  //TODO: customize this based on use-case
  const customPredictionResultStyle = {
    type: "binary",
    positive: prediction && prediction[selected] === "NORMAL",
  };

  return (
    <>
      <div className="contact">
        <LinkedInIcon className="linkedin_icon" />
        <a
          href="https://www.linkedin.com/in/srikesh-nagoji-a98625145"
          target="_blank"
        >
          Srikesh Nagoji
        </a>
      </div>
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
          {images.length > 0 && (
            <button
              className="btn btn-grad"
              onClick={submitHandler}
              disabled={images.length === 0}
            >
              Submit
            </button>
          )}
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
        <div className="info_content">
          <p>
            <strong>Purpose: </strong> Chest x-rays are a fast and inexpensive
            test that may potentially diagnose COVID-19, the disease caused by
            the novel coronavirus. However, chest imaging is not a first-line
            test for COVID-19 due to low diagnostic accuracy and confounding
            with other viral pneumonias. Recent research using deep learning may
            help overcome this issue as convolutional neural networks (CNNs)
            have demonstrated high accuracy of COVID-19 diagnosis at an early
            stage.
          </p>
          <p>
            <strong>Methods: </strong> I used the COVIDx CXR-3 Dataset, which
            contains x-ray images of COVID-19, other viral pneumonia, and normal
            lungs. I developed a CNN in which we added a dense layer on top of a
            pre-trained baseline CNN (DenseNet121), and I trained, validated,
            and tested the model on 36,240 X-ray images. I used data
            augmentation to avoid overfitting and address class imbalance; I
            used fine-tuning to improve the model's performance. From the
            external test dataset, I calculated the model's accuracy,
            sensitivity, specificity, positive predictive value, negative
            predictive value, and F1-score.
          </p>
          <p>
            <strong>Results: </strong> The model differentiated COVID-19 from
            normal lungs with 98% accuracy with f1-score of 0.98.
          </p>
          <p>
            <strong>Conclusions: </strong> The Convolutional Neural Network
            shows that it is possible to differentiate COVID-19 from other viral
            pneumonia and normal lungs on x-ray images with high accuracy. This
            method may assist clinicians with making more accurate diagnostic
            decisions and support chest X-rays as a valuable screening tool for
            the early, rapid diagnosis of COVID-19.
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
