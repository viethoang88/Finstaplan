import { useDispatch, useSelector } from "react-redux";
import { updateExistingClient } from "../../store/auth";
import { useLazyEffect } from "../ff/user-info-form/risk-profile-results/confirm-accept-profile";
import { EffectCallback } from "react";
import {
  updateExistingAdvisor,
  updateExistingAdvisorProperty,
} from "../../store/auth/update-advisor";
import { initialState } from "../../store/fact-find";
import { initialState as initialStateAdvisor } from "../../store/auth";
const AdvisorDataManager = ({ advisorId }) => {
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.factFind);
  const advisorData = useSelector((state) => state.auth);

  // MOVED to  ff-data-manager:
  // const lazyEffect: EffectCallback = () => {
  //   console.log("--- HI FROM ADVISOR DATA MANAGER && Client Changed---");
  //   console.log(clientData.id);

  //   if (
  //     JSON.stringify(clientData) !== JSON.stringify(initialState) &&
  //     clientData.id !== undefined
  //   ) {
  //     console.log("client data changed");
  //     console.log(clientData);
  //     dispatch(updateExistingClient(clientData.id, clientData));
  //   }
  // };
  // useLazyEffect(lazyEffect, [clientData], 2000);

  // REPLACED BY BELOW:
  // const lazyAdvisorEffect: EffectCallback = () => {
  //   console.log("--- HI FROM ADVISOR DATA MANAGER && Advisor Changed ---");
  //   console.log(advisorData.sub);

  //   if (
  //     JSON.stringify(advisorData) !== JSON.stringify(initialStateAdvisor) &&
  //     advisorData.sub !== undefined
  //   ) {
  //     console.log("advisor data changed");
  //     console.log(advisorData);
  //     dispatch(updateExistingAdvisor(advisorData.sub, advisorData));
  //   }
  // };
  // useLazyEffect(lazyAdvisorEffect, [advisorData], 2000);

  // advisorProfile:
  const advisorProfileLazy: EffectCallback = () => {
    if (advisorData.advisorProfile === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.advisorProfile,
        "advisorProfile"
      )
    );
  };
  useLazyEffect(advisorProfileLazy, [advisorData.advisorProfile], 2000);

  // Assumptions:
  const assumptionsLazy: EffectCallback = () => {
    if (
      advisorData?.assumptions?.length === undefined ||
      advisorData.assumptions.length === 0
    )
      return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.assumptions,
        "assumptions"
      )
    );
  };
  useLazyEffect(assumptionsLazy, [advisorData.assumptions], 2000);

  // benchmarkingProfile:
  const benchmarkingProfileLazy: EffectCallback = () => {
    if (advisorData?.benchmarkingProfile === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.benchmarkingProfile,
        "benchmarkingProfile"
      )
    );
  };
  useLazyEffect(
    benchmarkingProfileLazy,
    [advisorData.benchmarkingProfile],
    2000
  );

  // benchmarkingWeightings:
  const benchmarkingWeightingsLazy: EffectCallback = () => {
    if (advisorData?.benchmarkingWeightings === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.benchmarkingWeightings,
        "benchmarkingWeightings"
      )
    );
  };
  useLazyEffect(
    benchmarkingWeightingsLazy,
    [advisorData.benchmarkingWeightings],
    2000
  );

  // fixedBands
  const fixedBandsLazy: EffectCallback = () => {
    if (advisorData?.fixedBands === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.fixedBands,
        "fixedBands"
      )
    );
  };
  useLazyEffect(fixedBandsLazy, [advisorData.fixedBands], 2000);

  // funds
  const fundsLazy: EffectCallback = () => {
    if (advisorData?.funds === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(advisorData.sub, advisorData.funds, "funds")
    );
  };
  useLazyEffect(fundsLazy, [advisorData.funds], 2000);

  // licenseeAllocations
  const licenseeAllocationsLazy: EffectCallback = () => {
    if (
      advisorData?.licenseeAllocations?.length === undefined ||
      advisorData.licenseeAllocations.length === 0
    )
      return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.licenseeAllocations,
        "licenseeAllocations"
      )
    );
  };
  useLazyEffect(
    licenseeAllocationsLazy,
    [advisorData.licenseeAllocations],
    2000
  );

  // philosophies
  const philosophiesLazy: EffectCallback = () => {
    console.log("philosophies changed lazy -- UPDATING WITH ");
    console.log(advisorData.sub);
    console.log(advisorData.philosophies);
    if (advisorData?.philosophies === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.philosophies,
        "philosophies"
      )
    );
  };
  useLazyEffect(philosophiesLazy, [advisorData.philosophies], 2000);

  // portfolios
  const portfoliosLazy: EffectCallback = () => {
    if (advisorData?.portfolios === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.portfolios,
        "portfolios"
      )
    );
  };
  useLazyEffect(portfoliosLazy, [advisorData.portfolios], 2000);

  // underwriters
  const underwritersLazy: EffectCallback = () => {
    if (advisorData?.underwriters === undefined) return;
    dispatch(
      updateExistingAdvisorProperty(
        advisorData.sub,
        advisorData.underwriters,
        "underwriters"
      )
    );
  };
  useLazyEffect(underwritersLazy, [advisorData.underwriters], 2000);

  return <></>;
};

export default AdvisorDataManager;
