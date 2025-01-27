/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiStiProtectionProcedure,
  ApiWaitingRoom,
  ApiWaitingStatus,
  UpdateWaitingRoomDetailsRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, Sheet } from "@mui/joy";
import { Formik, useFormikContext } from "formik";

import { useUpdateWaitingRoomDetails } from "@/lib/businessModules/stiProtection/api/mutations/waitingRoomApi";
import { WAITING_STATUS_OPTIONS } from "@/lib/businessModules/stiProtection/features/procedures/translations";
import {
  createOnlyIfProcedureOpen,
  isProcedureOpen,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

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

  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);
  const isDisabled =
    !isProcedureOpen(procedure) || updateWaitingRoomDetails.isPending;

  return (
    <Sheet>
      <DetailsSection title="Wartezimmer">
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
              disabled={isDisabled}
              maxLength={ADDITIONAL_INFO_MAX_LENGTH}
            />
            <SelectField
              label="Status"
              name="status"
              disabled={isDisabled}
              options={WAITING_STATUS_OPTIONS}
            />
            {onlyIfOpen(
              <FormButtons isSubmitting={updateWaitingRoomDetails.isPending} />,
            )}
          </FormPlus>
        </Formik>
      </DetailsSection>
    </Sheet>
  );
}

function FormButtons({ isSubmitting }: { isSubmitting: boolean }) {
  const { setValues } = useFormikContext<WaitingRoomDetails>();
  return (
    <Row justifyContent="right">
      <Button
        variant="plain"
        onClick={() => setValues({ info: "", status: null })}
        aria-disabled={isSubmitting}
      >
        Zurücksetzen
      </Button>
      <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
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
