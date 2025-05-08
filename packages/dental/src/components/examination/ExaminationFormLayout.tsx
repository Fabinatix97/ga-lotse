/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { useEffect, useState } from "react";

import { ApiGender } from "@eshg/base-api";
import { ApiFluoridationConsent } from "@eshg/dental-api";
import { ProcedureLabel, useSidenav } from "@eshg/lib-employee-portal";

import { ExaminationResultWithDate } from "../../api/models/ExaminationResult";
import { FullDentitionFormSection } from "../fullDentition/FullDentitionFormSection";

import { AdditionalInformationFormSection } from "./AdditionalInformationFormSection";
import { AutomatedValuesSection } from "./AutomatedValuesSection";
import { ExaminationChildDetailsSection } from "./ExaminationChildDetailsSection";
import { NoteFormSection } from "./NoteFormSection";

interface ExaminedChild {
  gender?: ApiGender;
  dateOfBirth: Date;
  procedureLabels: ProcedureLabel[];
  allFluoridationConsents: ApiFluoridationConsent[];
}

interface ExaminationFormLayoutProps {
  isScreening: boolean;
  isFluoridation: boolean;
  isFluoridationConsentGiven?: boolean;
  dateAndTime: Date;
  institutionName?: string;
  groupName?: string;
  childId: string;
  child: ExaminedChild;
  previousExaminations: ExaminationResultWithDate[];
}

export function ExaminationFormLayout(props: ExaminationFormLayoutProps) {
  const {
    isScreening,
    isFluoridation,
    isFluoridationConsentGiven,
    dateAndTime,
    institutionName,
    groupName,
    childId,
    child,
    previousExaminations,
  } = props;

  const childDetails = (
    <ExaminationChildDetailsSection
      childId={childId}
      gender={child.gender}
      dateOfBirth={child.dateOfBirth}
      dateOfExamination={dateAndTime}
      groupName={groupName}
      institutionName={institutionName}
      procedureLabels={child.procedureLabels}
      allFluoridationConsents={child.allFluoridationConsents}
    />
  );
  const note = <NoteFormSection />;

  useCollapseSidenavOnMount();

  if (!(isScreening || isFluoridation)) {
    return (
      <Grid container columns={2} spacing={3}>
        <Grid xxs={1}>{note}</Grid>
        <Grid xxs={1}>{childDetails}</Grid>
      </Grid>
    );
  }

  const additionalInformation = (
    <AdditionalInformationFormSection
      isScreening={isScreening}
      isFluoridation={isFluoridation}
      isFluoridationConsentGiven={isFluoridationConsentGiven}
    />
  );

  if (isFluoridation && !isScreening) {
    return (
      <Grid container columns={2} spacing={3}>
        <Grid container xxs={1} columns={1}>
          <Grid xxs={1}>{additionalInformation}</Grid>
          <Grid xxs={1}>{note}</Grid>
        </Grid>
        <Grid xxs={1}>{childDetails}</Grid>
      </Grid>
    );
  }

  return (
    <Grid container columns={11} spacing={3}>
      <Grid xxs={11}>
        <FullDentitionFormSection />
      </Grid>
      <Grid container xxs={8} columns={8}>
        <Grid xxs={5}>{additionalInformation}</Grid>
        <Grid xxs={3}>{childDetails}</Grid>
        <Grid xxs={8}>{note}</Grid>
      </Grid>
      <Grid xxs={3}>
        <AutomatedValuesSection
          dateOfExamination={dateAndTime}
          participantDateOfBirth={child.dateOfBirth}
          previousExaminations={previousExaminations}
        />
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
