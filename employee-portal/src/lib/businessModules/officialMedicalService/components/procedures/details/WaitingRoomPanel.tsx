/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonBar, TextareaField } from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiWaitingStatus,
} from "@eshg/official-medical-service-api";
import { Button } from "@mui/joy";
import { Formik } from "formik";

import { usePatchWaitingRoom } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { WAITING_STATUS_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface WaitingRoomValues {
  info: OptionalFieldValue<string>;
  status: OptionalFieldValue<ApiWaitingStatus>;
}

export function WaitingRoomPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const patchWaitingRoom = usePatchWaitingRoom();

  async function handleSubmit(values: WaitingRoomValues) {
    await patchWaitingRoom.mutateAsync({
      id: procedure.id,
      apiWaitingRoom: {
        info: mapOptionalValue(values.info),
        status: mapOptionalValue(values.status),
      },
    });
  }

  async function handleReset(setFieldValue: SetFieldValueHelper) {
    void setFieldValue("info", "");
    void setFieldValue("status", "");

    await handleSubmit({ info: "", status: "" });
  }

  return (
    <InfoTile data-testid="waiting-room" name="waitingRoom" title="Wartezimmer">
      <Formik
        initialValues={{
          info: parseOptionalValue(procedure.waitingRoom.info),
          status: parseOptionalValue(procedure.waitingRoom.status),
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit, setFieldValue }) => {
          return (
            <FormStack onSubmit={handleSubmit}>
              <TextareaField
                name="info"
                label="Zusätzliche Info"
                sxTextarea={{ maxHeight: "37px" }}
              />
              <SelectField
                label="Status"
                name="status"
                options={WAITING_STATUS_OPTIONS}
              />
              <ButtonBar
                left={
                  <Button
                    variant="outlined"
                    onClick={() => handleReset(setFieldValue)}
                    sx={{ flexGrow: 1 }}
                  >
                    Zurücksetzen
                  </Button>
                }
                right={
                  <SubmitButton submitting={isSubmitting} sx={{ flexGrow: 1 }}>
                    Speichern
                  </SubmitButton>
                }
              />
            </FormStack>
          );
        }}
      </Formik>
    </InfoTile>
  );
}
