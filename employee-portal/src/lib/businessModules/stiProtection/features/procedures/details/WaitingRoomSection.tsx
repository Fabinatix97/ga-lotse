/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DetailsSection } from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import {
  DisabledFormProvider,
  useIsFormDisabled,
} from "@eshg/lib-portal/components/form/DisabledFormContext";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiStiProtectionProcedure,
  ApiWaitingRoom,
  ApiWaitingStatus,
  UpdateWaitingRoomDetailsRequest,
} from "@eshg/sti-protection-api";
import { Button, Sheet } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useTransition } from "react";

import { useUpdateWaitingRoomDetails } from "@/lib/businessModules/stiProtection/api/mutations/waitingRoomApi";
import { WAITING_STATUS_OPTIONS } from "@/lib/businessModules/stiProtection/features/procedures/translations";
import {
  createOnlyIfProcedureOpen,
  isProcedureOpen,
} from "@/lib/businessModules/stiProtection/shared/helpers";

const ADDITIONAL_INFO_MAX_LENGTH = 60;

interface WaitingRoomDetails {
  info: string;
  status: ApiWaitingStatus | null;
}

function initialValues(val?: ApiWaitingRoom): WaitingRoomDetails {
  return {
    info: val?.info ?? "",
    status: val?.status ?? null,
  };
}

export function WaitingRoomSection({
  procedure,
}: {
  procedure: ApiStiProtectionProcedure;
}) {
  const snackbar = useSnackbar();
  const updateWaitingRoomDetails = useUpdateWaitingRoomDetails({
    onSuccess: () => {
      snackbar.confirmation("Wartezimmerdaten aktualisiert");
    },
  });
  const [isResetting, startReset] = useTransition();

  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);
  const isDisabled =
    !isProcedureOpen(procedure) ||
    updateWaitingRoomDetails.isPending ||
    isResetting;

  return (
    <Sheet>
      <DetailsSection title="Wartezimmer">
        <DisabledFormProvider disabled={isDisabled}>
          <Formik
            enableReinitialize
            initialValues={initialValues(procedure.waitingRoom)}
            onSubmit={(form) =>
              updateWaitingRoomDetails.mutate(transformToValid(form, procedure))
            }
          >
            <FormPlus sx={{ display: "contents" }}>
              <InputField
                label="Zusätzliche Info"
                name="info"
                maxLength={ADDITIONAL_INFO_MAX_LENGTH}
              />
              <SelectField
                label="Status"
                name="status"
                options={WAITING_STATUS_OPTIONS}
              />
              {onlyIfOpen(<FormButtons startReset={startReset} />)}
            </FormPlus>
          </Formik>
        </DisabledFormProvider>
      </DetailsSection>
    </Sheet>
  );
}

function FormButtons({
  startReset: startReset,
}: {
  startReset: (action: () => Promise<void>) => void;
}) {
  const { setValues } = useFormikContext<WaitingRoomDetails>();
  const disabled = useIsFormDisabled();

  function resetForm() {
    startReset(async () => {
      await setValues({ info: "", status: null });
    });
  }

  return (
    <Row justifyContent="right">
      <Button
        variant="plain"
        onClick={() => resetForm()}
        aria-disabled={disabled}
      >
        Zurücksetzen
      </Button>
      <SubmitButton submitting={disabled}>Speichern</SubmitButton>
    </Row>
  );
}

function transformToValid(
  details: WaitingRoomDetails,
  procedure: ApiStiProtectionProcedure,
): UpdateWaitingRoomDetailsRequest {
  return {
    procedureId: procedure.id,
    apiWaitingRoom: {
      info: details.info ? details.info : undefined,
      status: details.status ?? undefined,
    },
  };
}
