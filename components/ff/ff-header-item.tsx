import { useSelector, useDispatch } from "react-redux";
import classes from "./ff-header-item.module.css";
import { useDrop } from "react-dnd";
import FFHeaderItems from "./ff-header-items";
import { useState, useCallback, memo } from "react";
import update from "immutability-helper";
import { useEffect } from "react";
import { factFindActions } from "../../store/fact-find";

// const crumbs = [
//   { id: 1, text: "Family", numSteps: 1 },
//   { id: 2, text: "Budget", numSteps: 1 },
//   { id: 3, text: "Balance Sheet", numSteps: 1 },
//   { id: 4, text: "Values", numSteps: 3 },
//   { id: 5, text: "Goals", numSteps: 2 },
//   { id: 6, text: "Risk Profile", numSteps: 1 },
//   { id: 7, text: "Contingency", numSteps: 1 },
//   { id: 8, text: "Authorities", numSteps: 1 },
//   { id: 9, text: "Checklist", numSteps: 1 },
// ];
// const steps = [
//   "Family",
//   "Budget",
//   "Balance Sheet",
//   "Values",
//   "Goals",
//   "Risk Profile",
//   "Contingency",
//   "Authorities",
//   "Checklist",
// ];

const generateStepsMap = (formSteps) => {
  let offset = 0;
  const stepsMap = {};
  //return steps.map((step) => {
  formSteps.map(({ id, text, numSteps }, idx) => {
    const result = [];
    //const currIndex = formSteps.findIndex((el) => el.text === step);
    result.push(idx + offset);
    for (let i = 1; i < formSteps[idx].numSteps; i++) {
      offset += 1;
      result.push(idx + offset);
    }
    stepsMap[text] = result;
    // return result;
  });
  return stepsMap;
};

export const FFHeaderItem: React.FC = memo(function FFHeaderItem() {
  const { formStep, formSteps } = useSelector((state) => state.factFind);
  const dispatch = useDispatch();
  const [cards, setCards] = useState(formSteps);
  let formStepMapper = generateStepsMap(formSteps);

  useEffect(() => {
    dispatch(
      factFindActions.updateState({
        formSteps: cards,
        formStepMapper: formStepMapper,
      })
    );
  }, []);

  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards]
  );

  useEffect(() => {
    formStepMapper = generateStepsMap(cards);
    console.log(formStepMapper);
    dispatch(
      factFindActions.updateState({
        formSteps: cards,
        formStepMapper: formStepMapper,
      })
    );
  }, [cards]);

  const [, drop] = useDrop(() => ({ accept: "card" }));

  const currFormStep = (text, idx) => {
    return formStepMapper[text] && formStepMapper[text].includes(formStep);
  };

  return (
    <ul ref={drop} className={`${classes.list} ${classes.my_breadcrumbs}`}>
      {cards.map(({ id, text, numSteps }, idx) => (
        <li
          className={classes.my_breadcrumbs_li}
          key={text}
          onClick={(e) =>
            dispatch(
              factFindActions.updateState({ formStep: formStepMapper[text][0] })
            )
          }
        >
          <a
            className={`${classes.my_breadcrumbs_a} ${
              currFormStep(text, idx) ? classes.current : ""
            }`}
          >
            <FFHeaderItems
              key={id}
              id={`${id}`}
              text={text}
              moveCard={moveCard}
              findCard={findCard}
            />
          </a>
        </li>
      ))}
    </ul>
  );
});

export default FFHeaderItem;
