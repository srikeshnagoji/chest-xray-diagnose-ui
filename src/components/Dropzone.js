import React from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";
import { motion } from "framer-motion";

function Dropzone({ onDrop, accept, open }) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept,
      onDrop,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <motion.div
      className="box"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div
        className="input-container"
        {...getRootProps({ className: "dropzone" })}
      >
        <input className="input-zone" {...getInputProps()} />
        <div className="desc">
          {isDragActive ? (
            <p className="dropzone-content">Release to drop the files here</p>
          ) : (
            <p className="dropzone-content">
              <strong>Drag 'n' drop</strong> chest x-ray images here, or click
              here to select images.
            </p>
          )}
        </div>
        <motion.div
          className="box"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <button type="button" onClick={open} className="btn">
            Click to select files
          </button>
        </motion.div>
      </div>
      <p className="helper_text">
        Note: Please upload only chest x-ray images.
      </p>
    </motion.div>
  );
}

export default Dropzone;
