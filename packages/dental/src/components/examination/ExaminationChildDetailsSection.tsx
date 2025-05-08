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
  ProcedureLabel,
  ProcedureLabelChip,
} from "@eshg/lib-employee-portal";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  OPTIONAL_FALLBACK_VALUE,
  formatOptionalKey,
} from "@eshg/lib-portal/formatters/optional";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";

import { routes } from "../../config/routes";
import { FluoridationConsentInformationSection } from "../fluoridationConsent/FluoridationConsentInformationSection";

import {
  ExaminationSection,
  ExaminationSectionHeader,
  ExaminationSectionTitle,
  ExaminationTitleProps,
} from "./ExaminationSection";

interface ExaminationChildDetailsSectionProps {
  childId: string;
  gender?: ApiGender;
  dateOfBirth: Date;
  dateOfExamination: Date;
  institutionName?: string;
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
        <DetailsSectionHeader {...titleProps} childId={props.childId} />
      )}
    >
      <DetailsRow>
        <DetailsItem
          label="Einrichtung"
          value={props.institutionName ?? OPTIONAL_FALLBACK_VALUE}
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
  childId: string;
}

function DetailsSectionHeader(props: DetailsSectionHeaderProps) {
  return (
    <ExaminationSectionHeader>
      <ExaminationSectionTitle titleId={props.titleId}>
        {props.children}
      </ExaminationSectionTitle>
      <InternalLinkButton
        color="primary"
        variant="outlined"
        href={routes.children.byId(props.childId).details}
        target="_blank"
        endDecorator={<OpenInNewOutlined />}
      >
        Profil
      </InternalLinkButton>
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
