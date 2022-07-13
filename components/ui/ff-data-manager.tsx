import { useDispatch, useSelector } from "react-redux";
import { updateExistingClient } from "../../store/auth";
import {
  updateExistingClientProperty,
  updateExistingClientProperties,
} from "../../store/auth/update-client";
import { useLazyEffect } from "../ff/user-info-form/risk-profile-results/confirm-accept-profile";
import { EffectCallback } from "react";

// updateExistingClient = (clientId, clientData)
const FFDataManager = () => {
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.factFind);

  // const lazyEffect: EffectCallback = () => {
  //   console.log("client data changed");
  //   console.log(clientData);
  //   dispatch(updateExistingClient(clientId, clientData));
  // };

  // useLazyEffect(lazyEffect, [clientData], 5000);

  // primary
  const primaryLazy: EffectCallback = () => {
    if (clientData.primary === undefined) return;
    dispatch(
      updateExistingClientProperty(clientData.id, clientData.primary, "primary")
    );
  };
  useLazyEffect(primaryLazy, [clientData.primary], 2000);

  // partner
  const partnerLazy: EffectCallback = () => {
    if (clientData.partner === undefined) return;
    dispatch(
      updateExistingClientProperty(clientData.id, clientData.partner, "partner")
    );
  };
  useLazyEffect(partnerLazy, [clientData.partner], 2000);

  // joint:
  const jointLazy: EffectCallback = () => {
    if (clientData.joint === undefined) return;
    dispatch(
      updateExistingClientProperty(clientData.id, clientData.joint, "joint")
    );
  };
  useLazyEffect(jointLazy, [clientData.joint], 2000);

  // id: ID!
  // advisorID: ID!
  // advisor: Advisor @connection(fields: ["advisorID"])

  // hasPartner: Boolean
  // hasDependents: Boolean
  // hasChildren: Boolean
  // hasJointDependents: Boolean
  // hasPartnerDependents: Boolean
  const hasBoolsLazy: EffectCallback = () => {
    dispatch(
      updateExistingClientProperties(clientData.id, {
        hasPartner: clientData.hasPartner,
        hasDependents: clientData.hasDependents,
        hasChildren: clientData.hasChildren,
        hasJointDependents: clientData.hasJointDependents,
        hasPartnerDependents: clientData.hasPartnerDependents,
      })
    );
  };
  useLazyEffect(
    hasBoolsLazy,
    [
      clientData.hasPartner,
      clientData.hasDependents,
      clientData.hasChildren,
      clientData.hasJointDependents,
      clientData.hasPartnerDependents,
    ],
    2000
  );

  // goals: AWSJSON
  const goalsLazy: EffectCallback = () => {
    if (clientData.goals === undefined) return;
    dispatch(
      updateExistingClientProperty(clientData.id, clientData.goals, "goals")
    );
  };
  useLazyEffect(goalsLazy, [clientData.goals], 2000);

  // values: AWSJSON
  const valuesLazy: EffectCallback = () => {
    if (clientData.values === undefined) return;
    dispatch(
      updateExistingClientProperty(clientData.id, clientData.values, "values")
    );
  };
  useLazyEffect(valuesLazy, [clientData.values], 2000);

  // insuranceInfo: AWSJSON
  // riskProfile: AWSJSON
  const riskProfileLazy: EffectCallback = () => {
    if (clientData.riskProfile === undefined || clientData.riskProfile === null)
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.riskProfile,
        "riskProfile"
      )
    );
  };
  useLazyEffect(riskProfileLazy, [clientData.riskProfile], 2000);

  // riskProfileScores: AWSJSON
  const riskProfileScoresLazy: EffectCallback = () => {
    if (
      clientData.riskProfileScores === undefined ||
      clientData.riskProfileScores === null
    )
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.riskProfileScores,
        "riskProfileScores"
      )
    );
  };
  useLazyEffect(riskProfileScoresLazy, [clientData.riskProfileScores], 2000);

  // advisors: AWSJSON (IS THIS otherAdvisors??)

  // children: [Dependent]
  const childrenLazy: EffectCallback = () => {
    if (clientData.children === undefined) return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.children,
        "children"
      )
    );
  };
  useLazyEffect(childrenLazy, [clientData.children], 2000);

  // dependents: [Dependent]
  const dependentsLazy: EffectCallback = () => {
    if (
      clientData.dependents === undefined ||
      clientData?.dependents?.length === 0
    )
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.dependents,
        "dependents"
      )
    );
  };
  useLazyEffect(dependentsLazy, [clientData.dependents], 2000);

  // partnerDependents: [Dependent]
  const partnerDependentsLazy: EffectCallback = () => {
    if (
      clientData.partnerDependents === undefined ||
      clientData?.partnerDependents?.length === 0
    )
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.partnerDependents,
        "partnerDependents"
      )
    );
  };
  useLazyEffect(partnerDependentsLazy, [clientData.partnerDependents], 2000);

  // jointDependents: [Dependent]
  const jointDependentsLazy: EffectCallback = () => {
    if (
      clientData.jointDependents === undefined ||
      clientData.jointDependents?.length === 0
    )
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.jointDependents,
        "jointDependents"
      )
    );
  };
  useLazyEffect(jointDependentsLazy, [clientData.jointDependents], 2000);

  // authoritiesData: AWSJSON
  const authoritiesDataLazy: EffectCallback = () => {
    if (
      clientData.authoritiesData === undefined ||
      clientData.authoritiesData === null
    )
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.authoritiesData,
        "authoritiesData"
      )
    );
  };
  useLazyEffect(authoritiesDataLazy, [clientData.authoritiesData], 2000);

  // healthInfo: AWSJSON
  const healthInfoLazy: EffectCallback = () => {
    if (clientData.healthInfo === undefined || clientData.healthInfo === null)
      return;
    dispatch(
      updateExistingClientProperty(
        clientData.id,
        clientData.healthInfo,
        "healthInfo"
      )
    );
  };
  useLazyEffect(healthInfoLazy, [clientData.healthInfo], 2000);

  // existingStructureDetails: AWSJSON

  return <></>;
};

export default FFDataManager;
