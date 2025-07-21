/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { memo, useEffect, useState } from "react";

import { ApiGender } from "@eshg/base-api";
import { ApiFluoridationConsent } from "@eshg/dental-api";
import { ProcedureLabel, useSidenav } from "@eshg/lib-employee-portal";
import { useIsBreakpointDown } from "@eshg/lib-portal";

import { ScreeningExaminationResultWithDate } from "../../api/models/ExaminationResult";
import { Institution } from "../../api/models/Institution";
import { FullDentitionFormSection } from "../fullDentition/FullDentitionFormSection";

import { AdditionalInformationFormSection } from "./AdditionalInformationFormSection";
import { AutomatedValuesSection } from "./AutomatedValuesSection";
import { ExaminationChildDetailsSection } from "./ExaminationChildDetailsSection";
import { InstructionValuesSection } from "./InstructionValuesSection";
import { NoteFormSection } from "./NoteFormSection";

// memoize components without Formik fields to avoid rerendering on every form validation
const MemoizedFullDentitionFormSection = memo(FullDentitionFormSection);
const MemoizedExaminationChildDetailsSection = memo(
  ExaminationChildDetailsSection,
);
const MemoizedAutomatedValuesSection = memo(AutomatedValuesSection);

interface ExaminedChild {
  id: string;
  version: number;
  gender?: ApiGender;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  procedureLabels: ProcedureLabel[];
  allFluoridationConsents: ApiFluoridationConsent[];
}

interface ExaminationFormLayoutProps {
  isScreening: boolean;
  isFluoridation: boolean;
  isFluoridationConsentGiven?: boolean;
  dateAndTime: Date;
  institution?: Institution;
  groupName?: string;
  child: ExaminedChild;
  previousExaminations: ScreeningExaminationResultWithDate[];
  showChildDetails?: boolean;
}

export function ExaminationFormLayout(props: ExaminationFormLayoutProps) {
  const {
    isScreening,
    isFluoridation,
    isFluoridationConsentGiven,
    dateAndTime,
    institution,
    groupName,
    child,
    previousExaminations,
    showChildDetails = false,
  } = props;

  const childDetails = showChildDetails ? (
    <MemoizedExaminationChildDetailsSection
      childId={child.id}
      childVersion={child.version}
      firstName={child.firstName}
      lastName={child.lastName}
      gender={child.gender}
      dateOfBirth={child.dateOfBirth}
      dateOfExamination={dateAndTime}
      groupName={groupName}
      institution={institution}
      procedureLabels={child.procedureLabels}
      allFluoridationConsents={child.allFluoridationConsents}
    />
  ) : undefined;
  const note = <NoteFormSection />;

  const isLowerResolution = useIsBreakpointDown("xl");
  useCollapseSidenavOnMount();

  if (!(isScreening || isFluoridation)) {
    return (
      <Grid container columns={1}>
        <Grid xxs={1}>{note}</Grid>
      </Grid>
    );
  }

  const additionalInformation = (
    <AdditionalInformationFormSection
      isScreening={isScreening}
      isFluoridation={isFluoridation}
      isFluoridationConsentGiven={isFluoridationConsentGiven}
      columns={showChildDetails ? 2 : 3}
    />
  );

  if (isFluoridation && !isScreening) {
    return (
      <Grid container columns={showChildDetails ? 2 : 1} spacing={3}>
        <Grid container xxs={1} columns={showChildDetails ? 1 : 2}>
          <Grid xxs={1}>{additionalInformation}</Grid>
          <Grid xxs={1}>{note}</Grid>
        </Grid>
        {showChildDetails && <Grid xxs={1}>{childDetails}</Grid>}
      </Grid>
    );
  }

  const automatedValues = (
    <MemoizedAutomatedValuesSection
      dateOfExamination={dateAndTime}
      participantDateOfBirth={child.dateOfBirth}
      previousExaminations={previousExaminations}
    />
  );
  const instructionValues = <InstructionValuesSection />;

  if (isLowerResolution) {
    return (
      <Grid container columns={9} spacing={3}>
        <Grid xxs={9}>
          <MemoizedFullDentitionFormSection />
        </Grid>
        <Grid xxs={showChildDetails ? 5.5 : 9}>{additionalInformation}</Grid>
        {showChildDetails && <Grid xxs={3.5}>{childDetails}</Grid>}
        <Grid container xxs={4.5} columns={1}>
          <Grid xxs={1}>{automatedValues}</Grid>
          <Grid xxs={1}>{note}</Grid>
        </Grid>
        <Grid xxs={4.5}>{instructionValues}</Grid>
      </Grid>
    );
  }

  return (
    <Grid container columns={11} spacing={3}>
      <Grid xxs={11}>
        <MemoizedFullDentitionFormSection />
      </Grid>
      <Grid container xxs={8} columns={8}>
        <Grid xxs={showChildDetails ? 5 : 8}>{additionalInformation}</Grid>
        {showChildDetails && <Grid xxs={3}>{childDetails}</Grid>}
        <Grid xxs={8}>{note}</Grid>
      </Grid>
      <Grid container xxs={3} columns={1}>
        <Grid xxs={1}>{automatedValues}</Grid>
        <Grid xxs={1}>{instructionValues}</Grid>
      </Grid>
    </Grid>
  );
}

function useCollapseSidenavOnMount(): void {
  const { isCollapsed, collapse } = useSidenav();
  const [didCollapse, setDidCollapse] = useState(false);

  const shouldCollapse = !(isCollapsed || didCollapse);
  useEffect(() => {
    if (shouldCollapse) {
      collapse();
      setDidCollapse(true);
    }
  }, [shouldCollapse, collapse]);
}
