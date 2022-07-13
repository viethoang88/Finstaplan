const BudgetPerson = ({ gender, height, width, name, role, src, type }) => {
  return (
    <>
      <img
        src={src}
        style={{
          minHeight: height * 1.75,
          maxHeight: height * 1.75,
          minWidth: width * 1.25,
          maxWidth: width * 1.25,
        }}
      />
    </>
  );
};

export default BudgetPerson;
