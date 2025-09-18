/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { Formik } from "formik";

import { ButtonBar, FormStack } from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  SetFieldValueHelper,
  SubmitButton,
  TextareaField,
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiWaitingStatus,
} from "@eshg/official-medical-service-api";

import { usePatchWaitingRoom } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { WAITING_STATUS_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
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
            <FormStack aria-label="Wartezimmer" onSubmit={handleSubmit}>
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
                    sx={{ flexGrow: 1 }}
                    onClick={() => handleReset(setFieldValue)}
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
