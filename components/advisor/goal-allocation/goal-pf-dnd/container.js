import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import React, { Component } from "react";
// import { colors } from "@atlaskit/theme";
import Column from "./column";
import reorder, { reorderQuoteMap } from "./reorder";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { authorQuoteMap } from "./data";
import { factFindActions } from "../../../../store/fact-find";
const updateGoalPrioritiesAndAssignedPortfolio =
  factFindActions.updateGoalPrioritiesAndAssignedPortfolio;

const unassignedGoalColumn = {
  id: "1",
  name: "Unassigned Goals",
  colors: {
    soft: "rgb(255, 250, 230)",
    hard: "rgb(255, 196, 0)",
  },
};

const getColumnElement = (companyName, idx, referenceNumber = "") => {
  const index = idx + 2;
  return {
    id: String(index),
    name: `${companyName}`,
    colors: {
      soft: "rgb(255, 250, 230)",
      hard: "rgb(255, 196, 0)",
    },
  };
};

const reshapeGoals = (goals, columnElements) => {
  if (goals === undefined) return;
  return goals
    .filter((g) => g.goalType === "monetary")
    .filter((goal) => goal?.[goal.when] !== undefined)
    .filter((g) => g.estimatedCost !== undefined && g.when !== undefined)
    .map((goal, idx) => {
      const requiredColElement = columnElements.find((el) => {
        return el.name === goal.assignedPortfolio;
      });
      return {
        id: String(idx),
        content: goal.goal,
        author:
          requiredColElement === undefined || requiredColElement === -1
            ? unassignedGoalColumn
            : requiredColElement,
      };
    });
};

const getByPortfolio = (portfolioName, items) =>
  items.filter((goal) => goal.author.name === portfolioName);

const portfolioToGoalMap = (portfolios, goals) => {
  return portfolios.reduce(
    (previous, portfolio) => ({
      ...previous,
      [portfolio.name]: getByPortfolio(portfolio.name, goals),
    }),
    {}
  );
};

const ParentContainer = styled.div`
  /* height: ${({ height }) => height}; */
  /* overflow-x: hidden;
  overflow-y: auto; */
`;

const Container = styled.div`
  /* background-color: rgb(76, 154, 255); */
  background-color: rgb(255, 255, 255);
  /* min-height: 100vh; */
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100%;
  display: inline-flex;
`;

class Board extends Component {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false,
  };

  // receives portfolios (primary.authorities, partner.authorities) and goals (factFind.goals)
  // TODO: move authorities to its own section.
  constructor(props) {
    super(props);
    this.state = {
      goals: undefined,
      columns: authorQuoteMap,
      ordered: Object.keys(authorQuoteMap),
    };
  }

  // state = {
  //   columns: authorQuoteMap,
  //   ordered: Object.keys(authorQuoteMap),
  // };

  // state = {
  //   columns: this.props.initial,
  //   ordered: Object.keys(this.props.initial),
  // };

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.portfolios !== props.portfolios) {
      console.log("--- SETTING COLS ON PROPS UPDATE ---");
      const columnElementsPortfolios = props.portfolios.map((pf, idx) => {
        return getColumnElement(pf.company, idx);
      });

      if (columnElementsPortfolios === undefined) return null;

      const allColElements = [
        unassignedGoalColumn,
        ...columnElementsPortfolios,
      ];
      console.log(allColElements);
      const reshapedGoals = reshapeGoals(props.goals, allColElements);
      if (reshapedGoals === undefined) return null;
      console.log(reshapedGoals);
      const portfolioGoalMap = portfolioToGoalMap(
        allColElements,
        reshapedGoals
      );
      if (portfolioGoalMap === undefined) return null;
      console.log("--- IN getDerivedStateFromProps WITH RESHAPED GOALS ---");
      console.log(portfolioGoalMap);
      return {
        goals: props.goals,
        columns: portfolioGoalMap,
        ordered: Object.keys(portfolioGoalMap),
        portfolios: props.portfolios,
      };
    }
    return null;
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.goals !== undefined) {
  // console.log("--- HELLO FROM BOARD ---");
  // console.log(this.props.goals);
  // console.log(this.props.portfolios);
  // console.log(this.props);
  // const columnElements = this.props.portfolios.map((pf, idx) => {
  //   return getColumnElement(pf.company, idx);
  // });
  // console.log("---- EYES HERE FOOL ------");
  // const allColElements = [unassignedGoalColumn, ...columnElements];
  // console.log(allColElements);
  // const reshapedGoals = reshapeGoals(this.props.goals, allColElements);
  // console.log("---- RESHAPED GOALS ----");
  // console.log(reshapedGoals);
  // console.log(authorQuoteMap);
  // console.log("--- IN COMPONENT DID UPDATE WITH PORTFOLIO TO GOAL MAP ---");
  // const portfolioGoalMap = portfolioToGoalMap(
  //   columnElementsPortfolios,
  //   reshapedGoals
  // );
  // console.log(portfolioGoalMap);
  //   }
  // }

  boardRef;

  onDragEnd = (result) => {
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow = [...this.state.ordered];
        shallow.splice(result.source.index, 1);
        this.setState({ ordered: shallow });
        return;
      }

      const column = this.state.columns[result.source.droppableId];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const columns = {
        ...this.state.columns,
        [result.source.droppableId]: withQuoteRemoved,
      };
      this.setState({ columns });
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const ordered = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      this.setState({
        ordered,
      });

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.columns,
      source,
      destination,
    });

    this.setState({
      columns: data.quoteMap,
    });

    if (this.props.goals !== undefined && this.props.goals?.length > 0) {
      this.props.dispatcher(
        updateGoalPrioritiesAndAssignedPortfolio({
          assignments: data.quoteMap,
          goals: this.props.goals,
        })
      );
      // this.props.updatePriorities(data.quoteMap, this.props.goals);
    }
  };

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const { containerHeight } = this.props;

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={this.props.isCombineEnabled}
      >
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key, index) => (
              <Column
                key={key}
                index={index}
                title={key}
                quotes={columns[key]}
                isScrollable={this.props.withScrollableColumns}
                isCombineEnabled={this.props.isCombineEnabled}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {containerHeight ? (
            <ParentContainer height={containerHeight}>{board}</ParentContainer>
          ) : (
            board
          )}
        </DragDropContext>
        <Global
          styles={css`
            body {
              background: rgb(38, 132, 255);
            }
          `}
        />
      </React.Fragment>
    );
  }
}

export default Board;
