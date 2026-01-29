/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import { ApiUser } from "@eshg/base-api";
import { SingleUserField } from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal";
import { ApiAppointmentBookingType } from "@eshg/prostitute-protection-api";

import { ADDITIONAL_DATA_FIELD_NAME } from "../../shared/constants";
import { EditProcedureDetailsDataForm } from "../procedures/details/sidebar/EditAdditionalDataSidebar";

interface ConsultantSelectFieldProps {
  name: string;
  required?: string;
  selfUser?: ApiUser;
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

  async function handleSelfAssign() {
    if (selfUser) {
      await setFieldValue("consultantId", selfUser.userId);
    }
  }

  const isAppointmentBlockSelected =
    values.appointmentBookingType ===
    ApiAppointmentBookingType.AppointmentBlock;

  const isSelfAssignButtonVisible =
    selfUser &&
    !(isAppointmentBlockSelected || values.consultantId === selfUser?.userId);

  useEffect(() => {
    if (isAppointmentBlockSelected) {
      void setFieldValue("consultantId", null);
    }
  }, [isAppointmentBlockSelected, setFieldValue]);

  return (
    <Stack gap={1} sx={{ justifyContent: "flex-start" }}>
      <SingleUserField
        name={name}
        label={ADDITIONAL_DATA_FIELD_NAME.consultant}
        options={options}
        placeholder={
          isAppointmentBlockSelected
            ? "Berater:in bei Terminblöcken nicht wählbar"
            : "auswählen"
        }
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
