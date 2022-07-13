import RiskProfileResults from "./risk-profile-results";
import RiskProfileFirm from "./risk-profile-firm-info";

const Results = ({
  clientName,
  partnerName,
  shouldScoreTwice,
  scored,
  scoredTwo,
  generatePieData,
  riskScore,
  riskScoreTwo,
  getIncompleteQuestions,
  getIncompleteQuestionsTwo,
  assignXFromScore,
}) => {
  return (
    <>
      <RiskProfileResults
        clientName={clientName}
        partnerName={partnerName}
        shouldScoreTwice={shouldScoreTwice}
        scored={scored}
        scoredTwo={scoredTwo}
        generatePieData={generatePieData}
        riskScore={riskScore}
        riskScoreTwo={riskScoreTwo}
        getIncompleteQuestions={getIncompleteQuestions}
        getIncompleteQuestionsTwo={getIncompleteQuestionsTwo}
        assignXFromScore={assignXFromScore}
      />
      <RiskProfileFirm />
    </>
  );
};

export default Results;
