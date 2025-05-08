/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { useEffect } from "react";

import {
  ApiCreateProphylaxisSessionRequest,
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisType,
  ApiUpdateProphylaxisSessionRequest,
} from "@eshg/dental-api";
import {
  DateTimeField,
  NamedUser,
  SelectContactField,
  UserField,
  formatInstitutionNameWithCategoryShort,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { useHasChanged } from "@eshg/lib-portal/hooks/useHasChanged";
import {
  NullableFieldValue,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";

import { Institution } from "../../../../api/models/Institution";
import { SearchGroupField } from "../../../../components/group/SearchGroupField";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { PROPHYLAXIS_TYPE_OPTIONS } from "../../../../config/prophylaxisSession";

import { FluoridationField } from "./FluoridationField";
import { ScreeningField } from "./ScreeningField";

export interface ProphylaxisSessionFormValues {
  dateAndTime: string;
  institution: NullableFieldValue<Institution>;
  groupName: OptionalFieldValue<string>;
  type: OptionalFieldValue<ApiProphylaxisType>;
  isScreening: boolean;
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  isFluoridation: boolean;
  fluoridationVarnish: OptionalFieldValue<ApiFluoridationVarnish>;
  dentistIds: string[];
  zfaIds: string[];
}

interface ProphylaxisSessionFormProps {
  values: ProphylaxisSessionFormValues;
  setFieldValue: (field: "groupName", value: "") => void;
  dentistOptions: NamedUser[];
  dentalAssistantOptions: NamedUser[];
  hasExaminationResults?: boolean;
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
        categories={SCHOOL_OR_DAYCARE_CONTACT}
        required="Bitte eine Schule/Kita angeben."
        getOptionLabel={(institution) =>
          institution ? formatInstitutionNameWithCategoryShort(institution) : ""
        }
        disabled={hasExaminationResults}
      />
      <SearchGroupField
        name="groupName"
        label="Gruppe"
        institution={values.institution}
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
      <UserField
        name="dentistIds"
        options={dentistOptions}
        blockedStaff={[]}
        freeStaff={[]}
        label="Zahnarzt/-ärztin"
        required="Bitte mindestens eine/n Zahnarzt/-ärztin angeben."
      />
      <UserField
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

export function mapProphylaxisSessionFormValuesToRequest(
  values: ProphylaxisSessionFormValues,
): ApiCreateProphylaxisSessionRequest | ApiUpdateProphylaxisSessionRequest {
  return {
    dateAndTime: new Date(values.dateAndTime),
    institutionId: mapRequiredValue(values.institution)?.id,
    groupName: mapOptionalValue(values.groupName) ?? undefined,
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
