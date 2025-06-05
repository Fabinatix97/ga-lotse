/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNewOutlined } from "@mui/icons-material";
import { Divider, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { ApiGender } from "@eshg/base-api";
import { ApiFluoridationConsent } from "@eshg/dental-api";
import {
  DetailsItem,
  DetailsRow,
  EditButton,
  ProcedureLabel,
  ProcedureLabelChip,
} from "@eshg/lib-employee-portal";
import {
  ExternalLinkButton,
  GENDER_VALUES,
  OPTIONAL_FALLBACK_VALUE,
  calculateAge,
  formatDate,
  formatOptionalKey,
} from "@eshg/lib-portal";

import { Institution } from "../../api/models/Institution";
import { routes } from "../../config/routes";
import { ParticipantDetails } from "../../features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
import { useProphylaxisSessionStore } from "../../features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import { FluoridationConsentInformationSection } from "../fluoridationConsent/FluoridationConsentInformationSection";

import {
  ExaminationSection,
  ExaminationSectionHeader,
  ExaminationSectionTitle,
  ExaminationTitleProps,
} from "./ExaminationSection";
import { useUpdateParticipantDetailsSidebar } from "./UpdateParticipantDetailsSidebar";

interface ExaminationChildDetailsSectionProps {
  childId: string;
  childVersion: number;
  firstName: string;
  lastName: string;
  gender?: ApiGender;
  dateOfBirth: Date;
  dateOfExamination: Date;
  institution?: Institution;
  groupName?: string;
  procedureLabels: ProcedureLabel[];
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function ExaminationChildDetailsSection(
  props: ExaminationChildDetailsSectionProps,
) {
  const age = calculateAge(props.dateOfBirth, props.dateOfExamination);

  return (
    <ExaminationSection
      title="Details zum Kind"
      titleComponent={(titleProps) => (
        <DetailsSectionHeader
          {...titleProps}
          participantDetails={{
            id: props.childId,
            version: props.childVersion,
            firstName: props.firstName,
            lastName: props.lastName,
            gender: props.gender,
            dateOfBirth: props.dateOfBirth,
            groupName: props.groupName,
            procedureLabels: props.procedureLabels,
            currentFluoridationConsent: props.allFluoridationConsents[0],
          }}
        />
      )}
    >
      <DetailsRow>
        <DetailsItem
          label="Einrichtung"
          value={props.institution?.name ?? OPTIONAL_FALLBACK_VALUE}
        />
        <DetailsItem
          label="Gruppe"
          value={props.groupName ?? OPTIONAL_FALLBACK_VALUE}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsItem
          label="Geschlecht"
          value={formatOptionalKey(props.gender, GENDER_VALUES)}
        />
        <DetailsItem label="Geburtstag" value={formatDate(props.dateOfBirth)} />
        <DetailsItem label="Alter bei Untersuchung" value={`${age} Jahre`} />
      </DetailsRow>
      <DetailsItem
        label="Kennungen"
        value={renderProcedureLabels(props.procedureLabels)}
      />
      <Divider />
      <FluoridationConsentInformationSection
        allFluoridationConsents={props.allFluoridationConsents}
      />
    </ExaminationSection>
  );
}

interface DetailsSectionHeaderProps extends ExaminationTitleProps {
  institution?: Institution;
  participantDetails: ParticipantDetails;
}

function DetailsSectionHeader(props: DetailsSectionHeaderProps) {
  const updateParticipantDetailsSidebar = useUpdateParticipantDetailsSidebar();
  const setParticipantDetails = useProphylaxisSessionStore(
    (store) => store.setParticipantDetails,
  );

  return (
    <ExaminationSectionHeader>
      <ExaminationSectionTitle titleId={props.titleId}>
        {props.children}
      </ExaminationSectionTitle>
      <Stack direction="row" gap={2}>
        <ExternalLinkButton
          color="primary"
          variant="outlined"
          href={routes.children.byId(props.participantDetails.id).details}
          openInNewTab
          endDecorator={<OpenInNewOutlined />}
        >
          Profil
        </ExternalLinkButton>
        <EditButton
          onClick={() =>
            updateParticipantDetailsSidebar.open({
              institution: props.institution,
              participantDetails: props.participantDetails,
              setParticipantDetails,
            })
          }
        />
      </Stack>
    </ExaminationSectionHeader>
  );
}

function renderProcedureLabels(
  procedureLabels: ProcedureLabel[],
): ReactNode | undefined {
  if (procedureLabels.length === 0) {
    return OPTIONAL_FALLBACK_VALUE;
  }

  return (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {procedureLabels.map((procedureLabel) => (
        <ProcedureLabelChip key={procedureLabel.id} value={procedureLabel} />
      ))}
    </Stack>
  );
}
