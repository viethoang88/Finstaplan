import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useSelector, useDispatch } from "react-redux";
import { generateOptions } from "../user-info-form/risk-profile-form";
import { useEffect } from "react";
import { factFindActions } from "../../../store/fact-find";

const _questions = [
  //1
  {
    question: "Do you have a current will?",
    type: "select",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    selected: null,
  },
  //2 (ONLY if 1 is answered yes)
  {
    question: "Who is the executor of your will?",
    type: "text",
    selected: "",
  },
  //3 (ONLY if 1 is answered yes)
  {
    question: "Executor relationship to you?",
    type: "text",
    selected: "",
  },
  //4 (ONLY if 1 is answered yes)
  {
    question: "Does the executor know they are the executor?",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    selected: null,
  },
  //5 (ONLY if 1 is answered yes)
  {
    question: "Does the executor have a copy of the will? ",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    selected: null,
  },
  //6 (ONLY if 1 is answered yes)
  {
    question: "Does your will reflect your current wishes?",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    selected: null,
  },
  //7
  {
    question: "When was your will last reviewed?",
    type: "text",
    selected: "",
  },
  //8
  {
    question: "Where is your will currently located?",
    type: "text",
    selected: "",
  },
  //9
  {
    question: "Your current types of Power of Attorney",
    type: "multiselect",
    options: [
      // { label: "None", value: "none" },
      { label: "General", value: "general" },
      { label: "Enduring", value: "enduring" },
      { label: "Medical", value: "medical" },
    ],
    selected: [],
  },
  //10
  {
    question: "Who do you have as power of attorneys?",
    type: "text",
    selected: "",
  },
  //11
  {
    question: "Do you have existing guardianship arrangements?",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    selected: null,
  },
];

const EstatePlanning = () => {
  const hasPartner = useSelector((state) => state.factFind?.hasPartner);
  const primaryName = useSelector(
    (state) => state.factFind?.primary?.firstName
  );
  const partnerName = useSelector(
    (state) => state.factFind?.partner?.firstName
  );
  const { estatePlanning } = useSelector(
    (state) => state.factFind.insuranceInfo
  );

  console.log("LOADING FROM REDUX STORE");
  console.log(estatePlanning);

  const [questions, setQuestions] = useState([]);
  const [questionsPartner, setQuestionsPartner] = useState([]);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   return () => {
  //     console.log("DISPATCH PARTNER");
  //     dispatch(
  //       factFindActions.updateClientDataNested({
  //         action: "UPDATE",
  //         path: ["insuranceInfo", "estatePlanning", "partner"],
  //         newValue: questionsPartner,
  //       })
  //     );
  //   };
  // }, [questionsPartner]);

  // useEffect(() => {
  //   return () => {
  //     console.log("DISPATCH PRIMARY");
  //     dispatch(
  //       factFindActions.updateClientDataNested({
  //         action: "UPDATE",
  //         path: ["insuranceInfo", "estatePlanning", "primary"],
  //         newValue: questions,
  //       })
  //     );
  //   };
  // }, [questions]);

  useEffect(() => {
    const questionsStr = JSON.stringify(_questions);
    setQuestions(JSON.parse(questionsStr));
    setQuestionsPartner(JSON.parse(questionsStr));
    if (estatePlanning) {
      if (estatePlanning.primary) {
        console.log("IN HERE WITH", estatePlanning.primary);
        // setQuestions(JSON.parse(JSON.stringify(estatePlanning.primary)));
      }
      if (estatePlanning.partner) {
        console.log("IN HERE WITH", estatePlanning.partner);
        // setQuestionsPartner(JSON.parse(JSON.stringify(estatePlanning.partner)));
      }
    }
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const updateQuestionValue = (idx, value) => {
    setQuestions((prevState) => {
      const newQuestions = [...prevState];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      return newQuestions;
    });
  };
  const updateQuestionValuePartner = (idx, value) => {
    setQuestionsPartner((prevState) => {
      const newQuestions = [...prevState];
      const newQuestion = { ...newQuestions[idx] };
      newQuestion.selected = value;
      newQuestions[idx] = newQuestion;
      return newQuestions;
    });
  };

  const filterQuestions = () => {
    if (questions.length === 0)
      return { partnerQuestions: [], primaryQuestions: [] };
    // FILTER OUT QUESTIONS THAT DO NOT NEED TO BE ASKED FOR PRIMARY & PARTNER:
    // replace question with false if ! question // if (question) test.
    const hasWill = questions[0].selected || questions[0].selected === "Yes";
    const partnerHasWill = questionsPartner[0].selected;
    const hasPowerOfAttorney = questions[8].selected.length > 0;
    const partnerHasPowerOfAttorney = questionsPartner[8].selected.length > 0;

    // qs 2-8 (idx 1-7) if not will - hide (for partner and primary)
    // qs 10 (idx 9) if not ["some"] power of attorney - hide (for partner and primary)
    const questionsWithWill = [1, 2, 3, 4, 5, 6, 7];
    let primaryQuestions = hasWill
      ? questions
      : questions.map((q, idx) => {
          if (questionsWithWill.includes(idx)) return { ...q, question: false };
          if (idx === 9)
            return { ...q, question: hasPowerOfAttorney ? q.question : false };
          return q;
        });
    let partnerQuestions = partnerHasWill
      ? questionsPartner
      : questionsPartner.map((q, idx) => {
          if (questionsWithWill.includes(idx)) return { ...q, question: false };
          if (idx === 9)
            return {
              ...q,
              question: partnerHasPowerOfAttorney ? q.question : false,
            };

          return q;
        });

    return { primaryQuestions, partnerQuestions };
  };

  const { primaryQuestions, partnerQuestions } = filterQuestions();

  return (
    <div className="p-datatable p-component p-datatable-auto-layout p-datatable-hoverable-rows editable-cells-table">
      <div className="p-datatable-header">
        <div className="table-header">
          <h5 className="p-m-0">Estate Planning Details</h5>
        </div>
      </div>
      <div className="p-datatable-wrapper">
        <table role="grid">
          <thead className="p-datatable-thead">
            <tr role="row">
              <th
                role="columnheader"
                className="p-sortable-disabled"
                style={{ width: "27rem" }}
              >
                <span className="p-column-title"></span>
              </th>
              <th role="columnheader" className="p-sortable-disabled">
                <span className="p-column-title">
                  For {primaryName ? primaryName : "you"}
                </span>
              </th>
              {hasPartner && (
                <th
                  role="columnheader"
                  className="p-sortable-disabled"
                  style={{ width: "35rem" }}
                >
                  <span className="p-column-title">
                    For {partnerName ? partnerName : "your partner"}
                  </span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="p-datatable-tbody">
            {primaryQuestions.map(
              ({ question, type, selected, options }, idx) => {
                const partnerQuestion =
                  hasPartner && partnerQuestions[idx].question;
                const askQuestion = question || partnerQuestion;
                const questionText = question
                  ? question
                  : partnerQuestions[idx].question;
                return (
                  <>
                    {askQuestion && (
                      <tr key={idx} role="row">
                        <td role="cell" className="p-selection-column">
                          <a className="p-cell-editor-key-helper">
                            {questionText}
                          </a>
                        </td>
                        <td role="cell" className="p-selection-column">
                          {question &&
                            generateOptions(
                              "",
                              options,
                              type,
                              selected,
                              idx,
                              updateQuestionValue
                            )}
                        </td>
                        {hasPartner && (
                          <td role="cell" className="p-selection-column">
                            {partnerQuestion &&
                              generateOptions(
                                "",
                                questionsPartner[idx].options,
                                questionsPartner[idx].type,
                                questionsPartner[idx].selected,
                                idx,
                                updateQuestionValuePartner
                              )}
                          </td>
                        )}
                      </tr>
                    )}
                  </>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstatePlanning;
/* USAGE:
export const generateOptions = (
  question,
  options,
  type,
  selected,
  idx,
  updaterFn,
) => {
*/
