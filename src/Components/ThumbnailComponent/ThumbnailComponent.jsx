import React from "react";
import styles from "./ThumbnailComponent.module.scss";

const ThumbnailComponent = ({ imgSrc }) => {
  return <img className={styles["img"]} src={imgSrc} />;
};

export default ThumbnailComponent;
