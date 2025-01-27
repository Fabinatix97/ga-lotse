/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { ApiWaitingRoom, ApiWaitingStatus } from "@eshg/school-entry-api";
import { Button } from "@mui/joy";
import { Formik } from "formik";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { WaitingRoom } from "@/lib/businessModules/schoolEntry/api/models/WaitingRoom";
import { useUpdateWaitingRoomDetails } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { WAITING_STATUS_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";
import { FormStack } from "@/lib/shared/components/form/FormStack";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

interface WaitingRoomValues {
  description: OptionalFieldValue<string>;
  status: OptionalFieldValue<ApiWaitingStatus>;
}

export function WaitingRoomPanel(props: { procedure: ProcedureDetails }) {
  const updateWaitingRoomDetails = useUpdateWaitingRoomDetails(
    props.procedure.id,
  );

  async function handleSubmit(values: WaitingRoomValues) {
    await updateWaitingRoomDetails.mutateAsync(
      mapToRequest(values, props.procedure.waitingRoom.version),
    );
  }

  async function handleReset(setFieldValue: SetFieldValueHelper) {
    void setFieldValue("description", "");
    void setFieldValue("status", "");

    await handleSubmit({ description: "", status: "" });
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>Wartezimmer</ContentPanelTitle>
      <Formik
        onSubmit={handleSubmit}
        initialValues={mapToFormValues(props.procedure.waitingRoom)}
      >
        {({ isSubmitting, handleSubmit, setFieldValue }) => {
          return (
            <FormStack dense onSubmit={handleSubmit}>
              <TextareaField
                name="description"
                label="z.B. Raum, MTA, Arzt:in"
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
                      onClick={() => handleReset(setFieldValue)}
                    >
                      Zurücksetzen
                    </Button>
                    <SubmitButton submitting={isSubmitting}>
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

function mapToFormValues(apiWaitingRoom: WaitingRoom): WaitingRoomValues {
  return {
    description: parseOptionalValue(apiWaitingRoom.description),
    status: parseOptionalValue(apiWaitingRoom.status),
  };
}
