const styles = {
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  height: "100vh",
  width: "100vw",
  zIndex: "1000",
};
const BlurOverlay = () => {
  return <div style={styles}></div>;
};

export default BlurOverlay;
