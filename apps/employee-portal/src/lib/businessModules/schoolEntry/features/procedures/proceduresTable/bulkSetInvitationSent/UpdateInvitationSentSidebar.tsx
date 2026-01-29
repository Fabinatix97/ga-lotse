/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { isDefined, isEmpty, partition } from "remeda";

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UpdateResultSummary,
  UseSidebarWithFormRefResult,
  useSidebarFormHandle,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiUpdateProceduresBulkResponse } from "@eshg/school-entry-api";

import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { useUpdateProcedureInvitationIsSentInBulk } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { ProcedureIdVersion } from "@/lib/businessModules/schoolEntry/shared/types";

interface UpdateProceduresInvitationSentSidebarProps extends SidebarWithFormRefProps {
  procedures: Procedure[];
}

export function useUpdateProceduresInvitationSentSidebar(): UseSidebarWithFormRefResult<UpdateProceduresInvitationSentSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateProceduresInvitationSentSidebar,
  });
}

function UpdateProceduresInvitationSentSidebar(
  props: UpdateProceduresInvitationSentSidebarProps,
) {
  const { mutateAsync, data, isSuccess } =
    useUpdateProcedureInvitationIsSentInBulk();

  const [proceduresWithAppointment, proceduresWithoutAppointment] = partition(
    props.procedures,
    (p) => isDefined(p.appointmentStart),
  );
  const procedureIdsAndVersion: ProcedureIdVersion = Object.fromEntries(
    proceduresWithAppointment.map((p) => [p.id, p.version]),
  );

  async function handleSubmit() {
    await mutateAsync({
      procedureIdsAndVersion,
    });
  }

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      <EmbeddedSidebarForm
        {...props}
        proceduresWithAppointment={proceduresWithAppointment}
        proceduresWithoutAppointment={proceduresWithoutAppointment}
        isSuccess={isSuccess}
        data={data}
      />
    </Formik>
  );
}

interface EmbeddedSidebarFormProps extends UpdateProceduresInvitationSentSidebarProps {
  isSuccess: boolean;
  data: ApiUpdateProceduresBulkResponse | undefined;
  proceduresWithAppointment: Procedure[];
  proceduresWithoutAppointment: Procedure[];
}

function EmbeddedSidebarForm(props: EmbeddedSidebarFormProps) {
  const {
    onClose,
    formRef,
    isSuccess,
    data,
    proceduresWithAppointment,
    proceduresWithoutAppointment,
  } = props;
  const { isSubmitting, dirty, resetForm } = useFormikContext();
  useSidebarFormHandle(formRef, {
    dirty: isSuccess ? false : dirty,
    resetForm,
  });

  return (
    <SidebarForm ref={formRef}>
      <SidebarContent title="Einladungen als versandt markieren">
        {isSuccess && isDefined(data) ? (
          <UpdateResultSummary
            items={[
              {
                type: "success",
                value: `${data.numUpdated} erfolgreich geändert`,
              },
              {
                type: "warning",
                value: `${data.numUnmodified} nicht geändert`,
              },
              {
                type: "error",
                value: `${data.numError} fehlgeschlagen`,
              },
            ]}
          />
        ) : (
          <Stack gap={2}>
            <ProceduresWithoutAppointmentInfo
              procedures={proceduresWithoutAppointment}
            />
            <ProceduresWithAppointmentInfo
              procedures={proceduresWithAppointment}
            />
          </Stack>
        )}
      </SidebarContent>
      <SidebarActions>
        <FormButtonBar
          submitting={isSubmitting}
          submitDisabled={isEmpty(proceduresWithAppointment)}
          submitLabel="Bestätigen"
          onCancel={isSuccess ? undefined : onClose}
          onFinish={isSuccess ? onClose : undefined}
        />
      </SidebarActions>
    </SidebarForm>
  );
}

function ProceduresWithoutAppointmentInfo(props: { procedures: Procedure[] }) {
  switch (props.procedures.length) {
    case 0:
      return null;
    case 1:
      return (
        <Stack>
          <Typography>Ein Vorgang ohne Termin selektiert.</Typography>
          <Typography level="body-sm" textColor="neutral.700">
            Einladungen von Vorgängen ohne Termin können nicht als versandt
            markiert werden.
          </Typography>
        </Stack>
      );
    default:
      return (
        <Stack>
          <Typography>
            {props.procedures.length} Vorgänge ohne Termin selektiert.
          </Typography>
          <Typography level="body-sm" textColor="neutral.700">
            Einladungen von Vorgängen ohne Termin können nicht als versandt
            markiert werden.
          </Typography>
        </Stack>
      );
  }
}

function ProceduresWithAppointmentInfo(props: { procedures: Procedure[] }) {
  switch (props.procedures.length) {
    case 0:
      return <Typography>Kein Vorgang mit Termin selektiert.</Typography>;
    case 1:
      return (
        <Typography>
          Ein Vorgang mit Termin selektiert.
          <br />
          Einladung als versandt markieren?
        </Typography>
      );
    default:
      return (
        <Typography>
          {props.procedures.length} Vorgänge mit Termin selektiert.
          <br />
          Einladungen als versandt markieren?
        </Typography>
      );
  }
}
