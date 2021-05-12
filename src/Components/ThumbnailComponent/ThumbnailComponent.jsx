import React from "react";
import styles from "./ThumbnailComponent.module.scss";

const ThumbnailComponent = ({ imgSrc }) => {
  return <img className={styles["thumbnail-img"]} src={imgSrc} />;
};

export default ThumbnailComponent;
