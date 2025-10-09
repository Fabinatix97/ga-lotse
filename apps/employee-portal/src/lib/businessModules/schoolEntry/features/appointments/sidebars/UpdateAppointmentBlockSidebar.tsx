/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { Formik, FormikErrors } from "formik";
import { Ref } from "react";
import { isEmpty } from "remeda";

import { ApiUser } from "@eshg/base-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarForm,
  SidebarFormHandle,
  UpdateAppointmentBlockSidebarContent,
  UpdateAppointmentBlockValues,
  formatTimeInput,
  mapFormValuesToApiValues,
} from "@eshg/lib-employee-portal";
import { ApiAppointmentBlock } from "@eshg/school-entry-api";

import {
  useAppointmentBlockApi,
  useAppointmentStandardDurationsApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/mapAppointmentBlockApi";
import { useUpdateAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";

interface UpdateAppointmentBlockProps {
  appointmentBlock: ApiAppointmentBlock;
  allPhysicians: ApiUser[];
  allMfas: ApiUser[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onClose: (force?: boolean) => void;
  refetchEvents: () => void;
}

export function UpdateAppointmentBlockSidebar(
  props: UpdateAppointmentBlockProps,
) {
  const { appointmentBlock, onCancel } = props;
  const updateAppointmentBlock = useUpdateAppointmentBlock();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const { data: standardDurations } = useSuspenseQuery(
    useGetAppointmentStandardDurationsQuery(standardDurationApi),
  );

  function handleValidate(values: UpdateAppointmentBlockValues) {
    const errors: FormikErrors<UpdateAppointmentBlockValues> = {};

    if (isEmpty(values.physicians ?? []) && isEmpty(values.mfas ?? [])) {
      const msg =
        "Es muss mindestens ein Arzt/eine Ärztin oder ein:e MFA ausgewählt sein.";
      errors.physicians = msg;
      errors.mfas = msg;
    }

    return errors;
  }

  async function handleUpdate(values: UpdateAppointmentBlockValues) {
    await updateAppointmentBlock.mutateAsync(
      mapFormValuesToApiValues(appointmentBlock, values),
    );

    props.onClose(true);
    props.refetchEvents();
  }

  return (
    <Formik
      initialValues={{
        startTime: formatTimeInput(appointmentBlock.start),
        endTime: formatTimeInput(appointmentBlock.end),
        parallelExaminations: appointmentBlock.parallelExaminations,
        physicians: appointmentBlock.physicians,
        mfas: appointmentBlock.mfas,
      }}
      validate={handleValidate}
      onSubmit={handleUpdate}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <UpdateAppointmentBlockSidebarContent
            appointmentBlock={appointmentBlock}
            appointmentTypes={appointmentBlock.types}
            appointmentBlockApi={mapAppointmentBlockApi(appointmentBlockApi)}
            appointmentBlockApiQueryKey={appointmentBlockApiQueryKey}
            physicians={props.allPhysicians}
            mfas={props.allMfas}
            standardDurations={standardDurations}
            formValues={values}
          />
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
