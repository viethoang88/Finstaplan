import { useSelector, useDispatch } from "react-redux";
import Sign from "../../../ui/sign";
import { generateOptions } from "../risk-profile-form";
import { useState } from "react";
import { useEffect } from "react";
import { fetchData } from "../../../../store/auth";
import { factFindActions } from "../../../../store/fact-find";
import SectionHeader from "./section-header";
import { debounce } from "lodash";

const ConfirmAcceptProfile = ({ scored, scoredTwo }) => {
  const hasPartner = useSelector((state) => state.factFind.hasPartner);
  const firstName = useSelector((state) => state.factFind.primary.firstName);
  const lastName = useSelector((state) => state.factFind.primary.lastName);
  let partnerFirstName;
  let partnerLastName;
  if (hasPartner) {
    partnerFirstName = useSelector((state) => state.factFind.partner.firstName);
    partnerLastName = useSelector((state) => state.factFind.partner.lastName);
  }

  return (
    <div>
      <SectionHeader text={"Investment Risk Profile Acceptance Declaration"} />
      {!scored &&
        `${firstName}, Please complete the risk profile questionnaire.`}
      {scored &&
        !scoredTwo &&
        hasPartner &&
        `${partnerFirstName}, Please complete the risk profile questionnaire.`}
      {!hasPartner && (
        <AcceptAndSign
          firstName={firstName}
          lastName={lastName}
          target={"primary_accept"}
        />
      )}
      {hasPartner && (
        <AcceptAndSign
          firstName={firstName}
          lastName={lastName}
          target={"primary_accept"}
        />
      )}
      {hasPartner && (
        <AcceptAndSign
          firstName={partnerFirstName}
          lastName={partnerLastName}
          target={"partner_accept"}
        />
      )}
    </div>
  );
};

export default ConfirmAcceptProfile;

const generateOptionsFromProfiles = (profiles) => {
  return profiles.map((p) => ({
    label: p.portfolioName,
    value: p.portfolioName,
  }));
};

const yesNoOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

import { EffectCallback, DependencyList, useCallback, useRef } from "react";

export function useLazyEffect(
  effect: EffectCallback,
  deps: DependencyList = [],
  wait = 300
) {
  const cleanUp = useRef<void | (() => void)>();
  const effectRef = useRef<EffectCallback>();
  const updatedEffect = useCallback(effect, deps);
  effectRef.current = updatedEffect;
  const lazyEffect = useCallback(
    debounce(() => {
      cleanUp.current = effectRef.current?.();
    }, wait),
    []
  );
  useEffect(lazyEffect, deps);
  useEffect(() => {
    return () => {
      cleanUp.current instanceof Function ? cleanUp.current() : undefined;
    };
  }, []);
}

const AcceptAndSign = ({ firstName, lastName, target }) => {
  const [agree, setAgree] = useState(null);
  const [reason, setReason] = useState("");
  const [selected, setSelected] = useState("");
  const profiles = useSelector((state) => state.auth.portfolios);
  const riskProfile = useSelector((state) => state.factFind.riskProfile);
  const dispatch = useDispatch();
  console.log("TARGET IS ", target);
  const _target = target === "primary_accept" ? "Client" : "Partner";
  const doYouAgree = firstName
    ? `${firstName}, Do you agree with this risk profile?`
    : `${_target}, Do you agree with this risk profile?`;

  useEffect(() => {
    if (profiles === undefined) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    const _agrees = riskProfile[target]?.agree;
    setAgree(_agrees === undefined ? null : _agrees);
    setReason(riskProfile[target]?.reason);
    setSelected(riskProfile[target]?.portfolioSelected);
  }, []);

  useEffect(() => {
    if (agree === null) return;
    dispatch(
      factFindActions.updateClientDataNestedObject({
        path: ["riskProfile", target],
        newValue: {
          agree,
          reason,
          portfolioSelected: selected,
          dateModified: new Date().toISOString(),
        },
      })
    );
  }, [agree, selected]);

  const lazyEffect: EffectCallback = () => {
    if (reason !== riskProfile[target]?.reason) {
      dispatch(
        factFindActions.updateClientDataNestedObject({
          path: ["riskProfile", target],
          newValue: {
            agree,
            reason,
            portfolioSelected: selected,
            dateModified: new Date().toISOString(),
          },
        })
      );
    }
  };

  useLazyEffect(lazyEffect, [reason], 3000);

  //   const signatureUpdateHandler = () => {
  //     do something for setting to target (primary || partner):
  //   };

  /* USAGE: export const generateOptions(
                            question,
                            options,
                            type,       "radio" || "text" || 
                            selected,
                            idx,
                            updaterFn)
  */
  return (
    <>
      {generateOptions(
        doYouAgree,
        yesNoOptions,
        "radio",
        agree,
        0,
        (idx, value) => {
          setAgree(value);
        }
      )}
      {!agree &&
        agree !== null &&
        agree !== undefined &&
        generateOptions(
          `If no, please state why`,
          [],
          "text",
          reason,
          0,
          (idx, value) => setReason(value)
        )}
      {!agree &&
        agree !== null &&
        agree !== undefined &&
        generateOptions(
          `If you disagreed with the outcome of your risk profile, please state which profile you believe would be more suitable`,
          generateOptionsFromProfiles(profiles),
          "radio",
          selected,
          0,
          (idx, value) => setSelected(value)
        )}
      {/* <div>
        <Sign
          firstName={firstName}
          lastName={lastName}
          signatureUpdateHandler={signatureUpdateHandler}
        />
      </div> */}
    </>
  );
};
