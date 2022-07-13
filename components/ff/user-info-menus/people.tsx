// import Image from "next/image";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import MenuItem from "./menu-item";
import { MenuItemTypes } from "./menu-item-types";
import classes from "./people.module.css";
import { Box } from "grommet";
import { tagRender } from "../user-info-form/controlled-input";
import { Space, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { factFindActions } from "../../../store/fact-find";
import { useEffect, useState } from "react";

// when you drag an item, a plain JS object describing it is being dragged.
// types let you specify which drag sources and drop targets are compatible.
// receiving components use monitors to listen for a drag event and then merge the results into their state
// connectors let you assign one of the predefined roles:
// - drag source, drag preview or drop target
// In the component's rendermethod, we are then able to access both the data obtained from the monitor, and the function obtained from the connector

// const responsive = {
//   superLargeDesktop: {
//     // the naming can be any, depends on you.
//     breakpoint: { max: 4000, min: 3000 },
//     items: 5
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 3
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1
//   }
// };

const getImageHeight = (type) => {
  const maxHeight = 68;
  if (["man", "woman", "grandfather", "grandmother"].includes(type))
    return maxHeight;
  else if (["daughter", "son"].includes(type)) return maxHeight * 0.85;
  else if (["boy", "girl"].includes(type)) return maxHeight * 0.6;
  else if (type === "infant") return maxHeight * 0.55;
  else if (type === "baby") return maxHeight * 0.45;
  else return maxHeight;
};

const getImageWidth = (type) => {
  const maxWidth = 62;
  if (["man", "woman", "grandfather", "grandmother"].includes(type))
    return maxWidth;
  else if (["daughter", "son"].includes(type)) return maxWidth * 0.85;
  else if (["boy", "girl"].includes(type)) return maxWidth * 0.6;
  else if (type === "infant") return maxWidth * 0.55;
  else if (type === "baby") return maxWidth * 0.45;
  else return maxWidth;
};

const imageLinks = [
  [
    "man",
    "/assets/images/6-man.svg", //"/assets/images/6 man.png",
    getImageHeight("man"),
    getImageWidth("man"),
    "parent",
    MenuItemTypes.ADULT,
    "male",
    0,
  ],
  [
    "woman",
    "/assets/images/7-woman.svg", //"/assets/images/7 woman.png",
    getImageHeight("woman"),
    getImageWidth("woman"),
    "parent",
    MenuItemTypes.ADULT,
    "female",
    0,
  ],
  [
    "non-binary",
    "/assets/images/12-neutral.svg",
    getImageHeight("woman"),
    getImageWidth("woman"),
    "parent",
    MenuItemTypes.ADULT,
    "other",
    0,
  ],
  [
    "baby",
    "/assets/images/0-baby.svg", //"/assets/images/0 baby.png",
    getImageHeight("baby"),
    getImageWidth("baby"),
    "child",
    MenuItemTypes.CHILD,
    "",
    "2rem",
  ],
  [
    "infant",
    "/assets/images/1-infant.svg", //"/assets/images/1 infant.png",
    getImageHeight("infant"),
    getImageWidth("infant"),
    "child",
    MenuItemTypes.CHILD,
    "",
    "1.8rem",
  ],
  [
    "boy",
    "/assets/images/2-boy.svg", //"/assets/images/2 boy.png",
    getImageHeight("boy"),
    getImageWidth("boy"),
    "child",
    MenuItemTypes.CHILD,
    "male",
    "1.6rem",
  ],
  [
    "girl",
    "/assets/images/3-girl.svg", //"/assets/images/3 girl.png",
    getImageHeight("girl"),
    getImageWidth("girl"),
    "child",
    MenuItemTypes.CHILD,
    "female",
    "1.6rem",
  ],
  [
    "daughter",
    "/assets/images/4-daughter.svg", //"/assets/images/4 daughter.png",
    getImageHeight("daughter"),
    getImageWidth("daughter"),
    "child",
    MenuItemTypes.CHILD,
    "female",
    ".65rem",
  ],
  [
    "son",
    "/assets/images/5-son.svg", //"/assets/images/5 son.png",
    getImageHeight("son"),
    getImageWidth("son"),
    "child",
    MenuItemTypes.CHILD,
    "male",
    ".65rem",
  ],
  [
    "grandfather",
    "/assets/images/8-grandfather.svg", //"/assets/images/8 grandfather.png",
    getImageHeight("grandfather"),
    getImageWidth("grandfather"),
    "grandparent",
    MenuItemTypes.GRANDPARENT,
    "male",
    0,
  ],
  [
    "grandmother",
    "/assets/images/9-grandmother.svg", //"/assets/images/9 grandmother.png",
    getImageHeight("grandmother"),
    getImageWidth("grandmother"),
    "grandparent",
    MenuItemTypes.GRANDPARENT,
    "female",
    0,
  ],
  [
    "dog",
    "/assets/images/11-dog.svg", //"/assets/images/9 grandmother.png",
    getImageHeight("boy"),
    getImageWidth("boy"),
    "pet",
    MenuItemTypes.PET,
    "",
    "1.6rem",
  ],
  [
    "cat",
    "/assets/images/10-cat.svg", //"/assets/images/9 grandmother.png",
    getImageHeight("baby"),
    getImageWidth("baby"),
    "pet",
    MenuItemTypes.PET,
    "",
    "2.1rem",
  ],
  // [
  //   "education",
  //   "/assets/images/education.svg", //"/assets/images/education.png",
  //   getImageHeight("education"),
  //   getImageWidth("education"),
  //   "expense",
  //   MenuItemTypes.EXPENSE,
  // ],

  // [
  //   "travel",
  //   "/assets/images/travel.svg", //"/assets/images/travel.png",
  //   getImageHeight("travel"),
  //   getImageWidth("travel"),
  //   "expense",
  //   MenuItemTypes.EXPENSE,
  // ],
  // [
  //   "work",
  //   "/assets/images/work.svg", //"/assets/images/work.png",
  //   getImageHeight("work"),
  //   getImageWidth("work"),
  //   "income",
  //   MenuItemTypes.INCOME,
  // ],
];

//import image from "../../../assets/images/6 man.png";

const menuItems = imageLinks.map(
  ([title, link, height, width, role, type, gender, paddingTop], idx) => (
    <Box
      key={idx}
      align="center"
      alignContent="center"
      justifyContent="flex-end"
      alignSelf="center"
      basis="auto"
      margin="small"
      pad="medium"
      gap="xsmall"
      round="small"
      border={true}
      background="white"
      elevation="xlarge"
      // flex="grow"
      animation={{
        type: "zoomIn",
        delay: 0,
        duration: 1000,
        size: "xlarge",
      }}
      height={{
        min: "6rem",
        max: "6rem",
      }}
      width={{
        min: "1.2rem",
        max: "4.5rem",
      }}
      style={{ zIndex: "1501" }}
    >
      <MenuItem
        key={`${role}_${idx}`}
        name={title}
        type={type}
        src={link}
        width={width}
        height={height}
        role={role}
        gender={gender}
        paddingTop={paddingTop}
      />
    </Box>
  )
);

const _peopleOptions = [
  { value: "hasPartner", label: "Partner" },
  { value: "hasChildren", label: "Our Children" },
  { value: "hasJointDependents", label: "Joint Dependents" },
  { value: "hasDependents", label: "Your Dependents" },
  { value: "hasPartnerDependents", label: "Partners Dependents" },
];

const _peopleOptionsNoPartner = [
  { value: "hasPartner", label: "Partner" },
  { value: "hasChildren", label: "Children" },
  { value: "hasDependents", label: "Your Dependents" },
];

const getActiveOptions = (defaultActiveOptions) => {
  const activeOptions = defaultActiveOptions.reduce((acc, bool, _idx) => {
    if (bool) {
      const value = _peopleOptions[_idx].value;
      acc.push(value);
    }
    return acc;
  }, []);
  return activeOptions;
};

const PeopleMenu = ({ defaultActiveOptions = [], hasPartner }) => {
  const [activeOptions, setActiveOptions] = useState(
    getActiveOptions(defaultActiveOptions)
  );

  let peopleOptions = _peopleOptions;
  if (!hasPartner) peopleOptions = _peopleOptionsNoPartner;

  let primaryName = "";
  let partnerName = "";
  try {
    primaryName = useSelector((state) => state.factFind.primary.firstName);
    partnerName = useSelector((state) => state.factFind.partner.firstName);
    if (primaryName !== "" && primaryName !== undefined)
      _peopleOptions[3].label = `${primaryName}'s Dependents`;
    if (partnerName !== "" && partnerName !== undefined)
      _peopleOptions[4].label = `${partnerName}'s Dependents`;
  } catch {
    console.log("no data available yet");
  }

  const dispatch = useDispatch();

  useEffect(() => {
    setActiveOptions(getActiveOptions(defaultActiveOptions));
  }, [defaultActiveOptions]);

  return (
    <div className={classes.container}>
      <Box direction="row">
        <Box
          width={{
            max: "21rem",
          }}
          background="neutral-4"
        >
          <ul className={classes.dock}>{menuItems}</ul>
        </Box>
        <Box>
          <ul className={`${classes.dock} ${classes.dock_selector}`}>
            <Space direction="vertical" size={18} width={300}>
              <Select
                mode="multiple"
                defaultValue={activeOptions.length > 0 ? activeOptions : []}
                value={activeOptions}
                showArrow
                allowClear
                tagRender={tagRender}
                placeholder="Add relations"
                style={{
                  width: "100%",
                  minWidth: "15rem",
                  minHeight: "10rem",
                  fontSize: "1.6rem",
                }}
                options={peopleOptions}
                onChange={(values) => {
                  const updatedVals = _peopleOptions.reduce(
                    (acc, { value }) => {
                      acc[value] = values.includes(value);
                      return acc;
                    },
                    {}
                  );
                  if (updatedVals?.hasPartner === false) {
                    updatedVals["partner"] = {};
                    updatedVals["hasJointDependents"] = false;
                    updatedVals["jointDependents"] = [];
                  }
                  // if (updatedVals?.hasJointDependents === false) {
                  //    updatedVals["jointDependents"] = [];
                  // }
                  if (updatedVals?.hasChildren === false) {
                    updatedVals["children"] = [];
                  }
                  if (updatedVals?.hasDependents === false) {
                    updatedVals["dependents"] = [];
                  }
                  console.log(updatedVals);
                  dispatch(factFindActions.updateState(updatedVals));
                }}
              />
            </Space>
          </ul>
        </Box>
      </Box>
    </div>
    // <div className={classes.container}>
    //   <ul className={classes.dock}>{menuItems}</ul>
    // </div>
  );
};

export default PeopleMenu;
//     id={id}
//     flex={shouldFlex}
//     align="center"
//     alignContent="center"
//     alignSelf="center"
//     basis="auto"
//     margin="small"
//     pad="medium"
//     gap="xsmall"
//     round="small"
//     border={true}
//     background="neutral-1"
//     elevation="xlarge"
//     // flex="grow"
//     animation={{
//       type: "zoomIn",
//       delay: 0,
//       duration: 1000,
//       size: "xlarge",
//     }}
//     height={{
//       min: "24rem",
//     }}
//     {...rest}

// style={{
// marginLeft: "30%",
// marginRight: "30%",
// display: "flex",
// flexDirection: "row",
// backgroundColor: "rgba(127, 63, 191, 0.05)",
// borderRadius: "25px",
// padding: "1",
// justifyContent: "flex-start",
// cursor: "pointer",
// transition: "width 1.5s, height 1.5s, font-size 2s, text-shadow 2s",
// }}
//>
/* <Carousel responsive={responsive}>{menuItems}</Carousel> */

// <Carousel
//   additionalTransfrom={0}
//   arrows
//   autoPlaySpeed={3000}
//   centerMode
//   className=""
//   containerClass="container"
//   dotListClass=""
//   draggable
//   focusOnSelect={false}
//   infinite
//   itemClass=""
//   keyBoardControl
//   minimumTouchDrag={80}
//   renderButtonGroupOutside={false}
//   renderDotsOutside={false}
//   responsive={{
//     desktop: {
//       breakpoint: {
//         max: 3000,
//         min: 1024,
//       },
//       items: 6,
//       partialVisibilityGutter: 40,
//     },
//     mobile: {
//       breakpoint: {
//         max: 464,
//         min: 0,
//       },
//       items: 5,
//       partialVisibilityGutter: 30,
//     },
//     tablet: {
//       breakpoint: {
//         max: 1024,
//         min: 464,
//       },
//       items: 5,
//       partialVisibilityGutter: 30,
//     },
//   }}
//   showDots={false}
//   sliderClass=""
//   slidesToSlide={1}
//   swipeable
// >
//   {/* {menuItems} */}
//   <div>1</div>
//   <div>2</div>
//   <div>3</div>
// </Carousel>
