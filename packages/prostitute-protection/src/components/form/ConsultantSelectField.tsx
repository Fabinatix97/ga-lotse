/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import { ApiUser } from "@eshg/base-api";
import {
  ButtonLink,
  SelectObjectField,
  formatUserName,
} from "@eshg/lib-portal";
import { ApiAppointmentBookingType } from "@eshg/prostitute-protection-api";

import { ADDITIONAL_DATA_FIELD_NAME } from "../../shared/constants";
import { EditProcedureDetailsDataForm } from "../procedures/details/sidebar/EditAdditionalDataSidebar";

interface ConsultantSelectFieldProps {
  name: string;
  required?: string;
  selfUser: ApiUser;
  options: ApiUser[];
}

export function ConsultantSelectField({
  name,
  required,
  selfUser,
  options,
}: Readonly<ConsultantSelectFieldProps>) {
  const { setFieldValue, values } =
    useFormikContext<EditProcedureDetailsDataForm>();

  const usersOptions = options.map((option) => ({
    value: option.userId,
    label: formatUserName(option),
  }));

  async function handleSelfAssign() {
    await setFieldValue("consultant", {
      value: selfUser.userId,
      label: formatUserName(selfUser),
    });
  }

  const isAppointmentBlockSelected =
    values.appointmentBookingType ===
    ApiAppointmentBookingType.AppointmentBlock;

  const isSelfAssignButtonVisible = !(
    isAppointmentBlockSelected || values.consultant?.value === selfUser.userId
  );

  useEffect(() => {
    if (isAppointmentBlockSelected) {
      void setFieldValue("consultant", {
        value: "",
        label: "",
      });
    }
  }, [isAppointmentBlockSelected, setFieldValue]);

  return (
    <Stack gap={1} sx={{ justifyContent: "flex-start" }}>
      <SelectObjectField
        name={name}
        label={ADDITIONAL_DATA_FIELD_NAME.consultant}
        placeholder={
          isAppointmentBlockSelected
            ? "Berater:in bei Terminblöcken nicht wählbar"
            : "auswählen"
        }
        getOptionLabel={({ label }) => label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        options={usersOptions}
        required={required}
        disabled={isAppointmentBlockSelected}
      />
      {isSelfAssignButtonVisible && (
        <ButtonLink sx={{ alignSelf: "flex-start" }} onClick={handleSelfAssign}>
          Mir zuweisen
        </ButtonLink>
      )}
    </Stack>
  );
}
