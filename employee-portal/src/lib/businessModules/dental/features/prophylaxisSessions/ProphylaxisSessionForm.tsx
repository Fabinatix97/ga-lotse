/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Institution } from "@eshg/dental";
import {
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack, Typography } from "@mui/joy";
import { useEffect } from "react";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { FluoridationField } from "@/lib/businessModules/dental/features/prophylaxisSessions/FluoridationField";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { PROPHYLAXIS_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import {
  AppointmentStaffField,
  StaffUser,
} from "@/lib/shared/components/appointmentBlocks/AppointmentStaffField";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";
import { getInstitutionOptionLabel } from "@/lib/shared/helpers/selectOptionMapper";

import { ScreeningField } from "./ScreeningField";

interface ProphylaxisSessionFormProps {
  values: ProphylaxisSessionValues;
  setFieldValue: (field: "groupName", value: "") => void;
  dentistOptions: StaffUser[];
  dentalAssistantOptions: StaffUser[];
  hasExaminationResults?: boolean;
}

export interface ProphylaxisSessionValues {
  dateAndTime: string;
  institution: OptionalFieldValue<Institution>;
  groupName: string;
  type: OptionalFieldValue<ApiProphylaxisType>;
  isScreening: boolean;
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  isFluoridation: boolean;
  fluoridationVarnish: OptionalFieldValue<ApiFluoridationVarnish>;
  dentistIds: string[];
  zfaIds: string[];
}

export function ProphylaxisSessionForm(props: ProphylaxisSessionFormProps) {
  const {
    values,
    setFieldValue,
    dentistOptions,
    dentalAssistantOptions,
    hasExaminationResults,
  } = props;

  const shouldClearGroupName = useHasChanged(values.institution);
  useEffect(() => {
    if (shouldClearGroupName) {
      void setFieldValue("groupName", "");
    }
  }, [shouldClearGroupName, setFieldValue, values]);

  return (
    <Stack gap={3}>
      {hasExaminationResults && (
        <Alert
          color="primary"
          message="Da es bereits Untersuchungsergebnisse zu dieser Prophylaxe gibt, können einige Daten nicht mehr geändert werden."
        />
      )}
      <DateTimeField
        name="dateAndTime"
        label="Datum und Uhrzeit"
        required="Bitte ein Datum mit Uhrzeit angeben."
      />
      <SelectContactField
        name="institution"
        label="Einrichtung"
        placeholder="Schule/Kita suchen"
        categories={SCHOOL_OR_DAYCARE}
        required="Bitte eine Schule/Kita angeben."
        getOptionLabel={(institution) =>
          institution ? getInstitutionOptionLabel(institution) : ""
        }
        disabled={hasExaminationResults}
      />
      <SearchGroupField
        name="groupName"
        label="Gruppe"
        institutionId={mapOptionalValue(values.institution)?.id ?? ""}
        disabled={hasExaminationResults}
      />
      <SelectField
        name="type"
        label="Typ"
        options={PROPHYLAXIS_TYPE_OPTIONS}
        required="Bitte den Typ der Prophylaxe angeben."
      />
      <ScreeningField screeningDisabled={hasExaminationResults} />
      <FluoridationField disabled={hasExaminationResults} />
      <Typography component="h3" level="title-sm">
        Durchführende Personen
      </Typography>
      <AppointmentStaffField
        name="dentistIds"
        options={dentistOptions}
        blockedStaff={[]}
        freeStaff={[]}
        label="Zahnarzt/-ärztin"
        required="Bitte mindestens eine/n Zahnarzt/-ärztin angeben."
      />
      <AppointmentStaffField
        name="zfaIds"
        options={dentalAssistantOptions}
        blockedStaff={[]}
        freeStaff={[]}
        label="ZFA"
        required="Bitte mindestens eine/n ZFA angeben."
      />
    </Stack>
  );
}

export function mapValues(values: ProphylaxisSessionValues) {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institution)?.id,
    groupName: mapRequiredValue(values.groupName),
    type: mapRequiredValue(values.type),
    isScreening: values.isScreening,
    dentitionType: values.isScreening
      ? mapRequiredValue(values.dentitionType)
      : undefined,
    fluoridationVarnish: values.isFluoridation
      ? mapRequiredValue(values.fluoridationVarnish)
      : undefined,
    dentistIds: values.dentistIds,
    zfaIds: values.zfaIds,
  };
}
