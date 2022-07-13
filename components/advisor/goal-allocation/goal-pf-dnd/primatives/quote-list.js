import React from "react";
import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import QuoteItem from "./quote-item";
import { grid } from "../constants";
import Title from "./title";

const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) {
    return "rgb(255, 235, 230)";
  }
  if (isDraggingFrom) {
    return "rgb(230, 252, 255)";
  }
  return "rgb(235, 236, 240)";
};

const Wrapper = styled.div`
  background-color: ${(props) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : "inherit")};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

class InnerQuoteList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.quotes !== this.props.quotes) {
      return true;
    }

    return false;
  }

  render() {
    return this.props.quotes.map((quote, index) => (
      <Draggable
        key={quote.id}
        draggableId={quote.id}
        index={index}
        shouldRespectForceTouch={false}
      >
        {(dragProvided, dragSnapshot) => (
          <QuoteItem
            idx={index}
            key={quote.id}
            quote={quote}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
        )}
      </Draggable>
    ));
  }
}

class InnerList extends React.Component {
  render() {
    const { quotes, dropProvided } = this.props;
    const title = this.props.title ? <Title>{this.props.title}</Title> : null;

    return (
      <Container>
        {title}
        <DropZone ref={dropProvided.innerRef}>
          <InnerQuoteList quotes={quotes} />
          {dropProvided.placeholder}
        </DropZone>
      </Container>
    );
  }
}

export default class QuoteList extends React.Component {
  static defaultProps = {
    listId: "LIST",
  };
  render() {
    const {
      ignoreContainerClipping,
      internalScroll,
      scrollContainerStyle,
      isDropDisabled,
      isCombineEnabled,
      listId,
      listType,
      style,
      quotes,
      title,
    } = this.props;

    return (
      <Droppable
        droppableId={listId}
        type={listType}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
        isCombineEnabled={isCombineEnabled}
      >
        {(dropProvided, dropSnapshot) => (
          <Wrapper
            style={style}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
            isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
            {...dropProvided.droppableProps}
          >
            {internalScroll ? (
              <ScrollContainer style={scrollContainerStyle}>
                <InnerList
                  quotes={quotes}
                  title={title}
                  dropProvided={dropProvided}
                />
              </ScrollContainer>
            ) : (
              <InnerList
                quotes={quotes}
                title={title}
                dropProvided={dropProvided}
              />
            )}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}
