import React from "react";
import "./PredictionResult.css";
const PredictionResult = (props) => {
  let cardColorClassName = "card-3";
  if (props.type.toLowerCase() === "binary") {
    cardColorClassName = props.positive ? "card-1" : "card-2";
  }
  return (
    <div>
      <div className="heading">
        <h1 className="heading__title">Prediction</h1>
      </div>
      <div className="cards">
        <div className={`card ${cardColorClassName}`}>
          <h1 className="card__title">
            {props.children ? props.children : "Not yet predicted"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
