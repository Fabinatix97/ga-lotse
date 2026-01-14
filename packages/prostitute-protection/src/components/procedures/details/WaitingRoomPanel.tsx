/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  ContentPanel,
  ContentPanelTitle,
  FormStack,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  SetFieldValueHelper,
  SubmitButton,
  TextareaField,
  mapOptionalValue,
  parseOptionalValue,
  useValidateLength,
} from "@eshg/lib-portal";
import {
  ApiProcedureDetails,
  ApiWaitingRoom,
  ApiWaitingStatus,
} from "@eshg/prostitute-protection-api";

import { useUpdateWaitingRoom } from "../../../api/mutations/procedures";
import { WAITING_STATUS_OPTIONS } from "../../../shared/constants";
import { isProcedureFinalized } from "../../../shared/helpers";

interface WaitingRoomValues {
  description: OptionalFieldValue<string>;
  status: OptionalFieldValue<ApiWaitingStatus>;
}

export function WaitingRoomPanel({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  const validateLength = useValidateLength();
  const updateWaitingRoomDetails = useUpdateWaitingRoom(procedure.id);

  if (isProcedureFinalized(procedure)) {
    return null;
  }

  async function handleSubmit(values: WaitingRoomValues) {
    await updateWaitingRoomDetails.mutateAsync(
      mapToRequest(values, procedure.waitingRoom.version),
    );
  }

  async function handleReset(setFieldValue: SetFieldValueHelper) {
    void setFieldValue("description", "");
    void setFieldValue("status", "");

    await handleSubmit({ description: "", status: "" });
  }

  return (
    <ContentPanel role="form" ariaLabel="Wartezimmer">
      <ContentPanelTitle component="h2">Wartezimmer</ContentPanelTitle>
      <Formik
        initialValues={mapToFormValues(procedure.waitingRoom)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit, setFieldValue }) => {
          return (
            <FormStack dense onSubmit={handleSubmit}>
              <TextareaField
                name="description"
                label="z.B. Raum, Berater:in"
                sxTextarea={{ maxHeight: "37px" }}
                validate={validateLength(0, 60)}
              />
              <SelectField
                label="Status"
                name="status"
                options={WAITING_STATUS_OPTIONS}
              />
              <ButtonBar
                right={
                  <>
                    <Button
                      variant="outlined"
                      aria-label="Wartezimmer zurücksetzen"
                      onClick={() => handleReset(setFieldValue)}
                    >
                      Zurücksetzen
                    </Button>
                    <SubmitButton
                      submitting={isSubmitting}
                      aria-label="Wartezimmer speichern"
                    >
                      Speichern
                    </SubmitButton>
                  </>
                }
              />
            </FormStack>
          );
        }}
      </Formik>
    </ContentPanel>
  );
}

function mapToRequest(
  formValues: WaitingRoomValues,
  version: number,
): ApiWaitingRoom {
  return {
    version,
    description: mapOptionalValue(formValues.description),
    status: mapOptionalValue(formValues.status),
  };
}

function mapToFormValues(apiWaitingRoom: ApiWaitingRoom): WaitingRoomValues {
  return {
    description: parseOptionalValue(apiWaitingRoom.description),
    status: parseOptionalValue(apiWaitingRoom.status),
  };
}
