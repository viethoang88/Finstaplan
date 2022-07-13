import {
  Dropdown,
  Menu,
  Breadcrumb,
  Icon,
  Step,
  Button,
  Container,
} from "semantic-ui-react";

import classes from "./ff-footer-nav.module.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCheck,
//   faThumbsUp,
//   faInfoCircle,
// } from "@fortawesome/free-solid-svg-icons";

const ffFooterNav = (props) => {
  return (
    <Container className={classes.footer} textAlign="center">
      <Button animated>
        <Button.Content visible>Previous</Button.Content>
        <Button.Content hidden>
          <Icon name="arrow left" />
        </Button.Content>
      </Button>
      <Step.Group>
        <Step>
          <Icon name="info" />
          {/* <FontAwesomeIcon size={"xs"} icon={faInfoCircle} /> */}
          &nbsp;&nbsp;
          <Step.Content>
            <Step.Title>Family</Step.Title>
            <Step.Description>
              Tell us about your family and
              <br /> financial situation
            </Step.Description>
          </Step.Content>
        </Step>

        <Step active>
          <Icon name="payment" />
          {/* <FontAwesomeIcon size={"xs"} icon={faThumbsUp} /> */}
          &nbsp;&nbsp;&nbsp;
          <Step.Content>
            <Step.Title>Values and Goals</Step.Title>
            <Step.Description>
              What do you value in life and
              <br />
              what are your short and long term goals?
            </Step.Description>
          </Step.Content>
        </Step>

        <Step disabled>
          <Icon name="info" />
          {/* <FontAwesomeIcon size={"xs"} icon={faCheck} /> */}
          &nbsp;&nbsp;&nbsp;
          <Step.Content>
            <Step.Title>Complete Consultation</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
      <Button animated>
        <Button.Content visible>Next</Button.Content>
        <Button.Content hidden>
          <Icon name="arrow right" />
        </Button.Content>
      </Button>
    </Container>
  );
};

export default ffFooterNav;
