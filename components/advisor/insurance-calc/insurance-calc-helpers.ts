/* EXPECTED SHAPE:
  const DUMMY_DATA = [
    { category: "Income Requirements", life: 210106, tpd: 528294, trauma: 209683, ip: 64212 },
    { category: "Liabilities & Other Lump Sum", life: 70035, tpd: 176098, trauma: 69894, ip: 21404 },
    { category: "Offsets", life: 280142, tpd: 704391, trauma: 279578, ip: 85616 },
    { category: "Total Requirement", life: 280142, tpd: 704391, trauma: 279578, ip: 85616 },
    { category: "Minimum Requirement", life: 280142, tpd: 704391, trauma: 279578, ip: 85616 },
  ];
*/
const categories = [
  "Income Requirements",
  "Liabilities & Other Lump Sums",
  "Offsets",
  "Total Requirement",
  "Minimum Requirement",
];
export const shapeTotalRequirementsSummary = (
  expenses,
  liabilities,
  offsets,
  netRequirements,
  minimumRequirements
) => {
  console.log("-- SHAPING TOTAL REQUIREMENTS SUMMARY ---");
  console.log(expenses);
  console.log(liabilities);
  console.log(offsets);
  console.log(netRequirements);
  console.log(minimumRequirements);
  return categories.map((cat) => {
    if (cat === "Income Requirements") {
      return {
        category: cat,
        life: expenses?.life,
        tpd: expenses?.tpd,
        trauma: expenses?.trauma,
        ip: 0,
      };
    } else if (cat === "Liabilities & Other Lump Sums") {
      return {
        category: cat,
        life: liabilities?.life,
        tpd: liabilities?.tpd,
        trauma: liabilities?.trauma,
        ip: 0,
      };
    } else if (cat === "Offsets") {
      return {
        category: cat,
        life: offsets?.life,
        tpd: offsets?.tpd,
        trauma: offsets?.trauma,
        ip: 0,
      };
    } else if (cat === "Total Requirement") {
      return {
        category: cat,
        life: netRequirements?.life,
        tpd: netRequirements?.tpd,
        trauma: netRequirements?.trauma,
        ip: 0,
      };
    } else if (cat === "Minimum Requirement") {
      return {
        category: cat,
        life: minimumRequirements?.life,
        tpd: minimumRequirements?.tpd,
        trauma: minimumRequirements?.trauma,
        ip: 0,
      };
    }
  });
};

export const extractMinimumRequirements = (minReqObj) => {
  console.log("--- EXTRACTING MIN REQUIREMENTS ---");
  console.log(minReqObj);
  console.log(minReqObj === undefined);
  console.log(typeof minReqObj);
  if (minReqObj === undefined) return;
  console.log(Object.entries(minReqObj.length));
  console.log("--- WITH THIS MIN REQUIREMENTS OBJECT --- ");
  if (
    minReqObj === undefined ||
    typeof minReqObj !== "object" ||
    Object.entries(minReqObj).length === 0
  )
    return undefined;
  const reshapedObj = {};
  for (let [k, v] of Object.entries(minReqObj)) {
    console.log(k);
    console.log(v);
    console.log(Object.values(v));
    console.log(typeof v);
    console.log(Object.values(v)[0]);
    console.log(reshapedObj[k]);
    console.log(reshapedObj);
    reshapedObj[k] = Object.values(v)[0];
  }
  return reshapedObj;
};

export const sumCategories = (obj) => {
  if (obj === undefined || Object.entries(obj).length === 0) {
    return {
      life: 0,
      tpd: 0,
      trauma: 0,
    };
  } else {
    const sums = {
      life: 0,
      tpd: 0,
      trauma: 0,
    };
    for (let [category, json] of Object.entries(obj)) {
      const data = JSON.parse(json);
      sums.life += data.life["0"];
      sums.tpd += data.tpd["0"];
      sums.trauma += data.trauma["0"];
    }
    return sums;
  }
};

export const extractNetRequirements = ({ life, tpd, trauma }) => {
  if (!life || !tpd || !trauma) {
    return {
      life: 0,
      tpd: 0,
      trauma: 0,
    };
  }
  return {
    life: life["0"],
    tpd: tpd["0"],
    trauma: trauma["0"],
  };
};

export const calculateNetRequirements = ({
  expenses,
  offsets,
  initialLiabilities,
}) => {
  // const netRequirements = {
  //   life: {
  //     "0": initialLiabilities?.life || 0,
  //   },
  //   tpd: {
  //     "0": initialLiabilities?.tpd || 0,
  //   },
  //   trauma: {
  //     "0": initialLiabilities?.trauma || 0,
  //   },
  // };
  const netRequirements = {
    life: {
      "0": 0,
    },
    tpd: {
      "0": 0,
    },
    trauma: {
      "0": 0,
    },
  };
  const numYears = Object.entries(expenses["life"]).length;
  for (let i = 0; i < numYears; i++) {
    // if (i === 0) {
    netRequirements["life"][String(i)] =
      (initialLiabilities?.life || 0) +
      expenses["life"][String(i)] -
      offsets["life"][String(i)];

    netRequirements["tpd"][String(i)] =
      (initialLiabilities?.tpd || 0) +
      expenses["tpd"][String(i)] -
      offsets["tpd"][String(i)];

    netRequirements["trauma"][String(i)] =
      (initialLiabilities?.trauma || 0) +
      expenses["trauma"][String(i)] -
      offsets["trauma"][String(i)];
    // } else {
    //   netRequirements["life"][String(i)] =
    //     expenses["life"][String(i)] - offsets["life"][String(i)];
    //   netRequirements["tpd"][String(i)] =
    //     expenses["tpd"][String(i)] - offsets["tpd"][String(i)];
    //   netRequirements["trauma"][String(i)] =
    //     expenses["trauma"][String(i)] - offsets["trauma"][String(i)];
    // }
  }
  return netRequirements;
};

export const transformAggLiabilities = (aggLiabilitiesByCategory) => {
  const reshapedData = {
    life: {},
    tpd: {},
    trauma: {},
  };
  if (aggLiabilitiesByCategory === undefined) return reshapedData;

  const al = JSON.parse(aggLiabilitiesByCategory);

  const keys = Object.keys(al?.type);
  for (let key of keys) {
    reshapedData["life"][al?.type?.[key]] = al?.life?.[key] || 0;
    reshapedData["tpd"][al?.type?.[key]] = al?.tpd?.[key] || 0;
    reshapedData["trauma"][al?.type?.[key]] = al?.trauma?.[key] || 0;
  }
  return reshapedData;
};

export const transformsByCategorySumNpv = (categoryObject, _category = "") => {
  if (categoryObject === undefined) return;
  const reshapedData = {
    life: {},
    tpd: {},
    trauma: {},
  };
  const categories = ["life", "tpd", "trauma"];

  for (let category of Object.keys(categoryObject)) {
    const data = JSON.parse(categoryObject[category]);

    for (let c of categories) {
      const yearlyData = data[c];

      if (_category === "offsets") {
        reshapedData[c][category] = yearlyData["0"];
      } else {
        // const length = Object.keys(yearlyData).length;
        // let sum = 0;
        // for (let i = 0; i < length; i++) {
        //   sum += yearlyData[String(i)];
        // }
        // reshapedData[c][category] = sum;
        reshapedData[c][category] = yearlyData["0"];
      }
    }
  }
  return reshapedData;
};
