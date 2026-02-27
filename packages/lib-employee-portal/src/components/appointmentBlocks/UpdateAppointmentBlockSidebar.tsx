/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formik, FormikErrors } from "formik";
import { Ref } from "react";
import { isDefined, isEmpty } from "remeda";

import {
  QueryKeyFactory,
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal";

import {
  AppointmentBlockApi,
  UpdateAppointmentBlockRequest,
} from "../../api/AppointmentBlockApi";
import { User } from "../../api/models/User";
import { useUpdateAppointmentBlock } from "../../api/mutations/appointmentBlock";
import { useGetAppointmentBlock } from "../../api/queries/appointmentBlock";
import { SidebarActions } from "../../features/drawer/components/SidebarActions";
import { SidebarForm } from "../../features/drawer/components/SidebarForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "../../features/drawer/hooks/useSidebarWithFormRef";
import { SidebarFormHandle } from "../../features/drawer/types/sidebar";
import {
  formatDateInput,
  formatTimeInput,
  toLocalDateTime,
} from "../../utils/dateTime";
import { FormButtonBar } from "../form/FormButtonBar";

import { AppointmentBlock } from "./AppointmentBlockGroup";
import { UpdateAppointmentBlockSidebarContent } from "./UpdateAppointmentBlockSidebarContent";
import { ApiAppointmentType, AppointmentStandardDurations } from "./types";

export function useUpdateAppointmentBlockSidebar(): UseSidebarWithFormRefResult<UpdateAppointmentBlockProps> {
  return useSidebarWithFormRef({ component: UpdateAppointmentBlockSidebar });
}

interface UpdateAppointmentBlockProps extends SidebarWithFormRefProps {
  appointmentBlockId: string;
  appointmentTypes?: ApiAppointmentType[];
  withTeam: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  sopasss?: User[];
  formRef: Ref<SidebarFormHandle>;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  standardDurations: AppointmentStandardDurations;
  refetchEvents?: () => void;
  onCancel?: () => void;
}

export interface UpdateAppointmentBlockValues {
  startTime: string;
  endTime: string;
  parallelExaminations?: number;
  physicians?: string[];
  mfas?: string[];
  consultants?: string[];
  sopasss?: string[];
  room: string;
  availableForCitizen?: boolean;
  availableForBulkBooking?: boolean;
}

export function UpdateAppointmentBlockSidebar(
  props: UpdateAppointmentBlockProps,
) {
  const { appointmentBlockApi, appointmentBlockId } = props;
  const { data: appointmentBlock } = useGetAppointmentBlock(
    appointmentBlockId,
    appointmentBlockApi,
    props.appointmentBlockApiQueryKey,
  );

  const updateMutations = useUpdateAppointmentBlock(appointmentBlockApi);

  async function handleUpdate(values: UpdateAppointmentBlockValues) {
    await updateMutations.mutateAsync(
      mapFormValuesToApiValues(appointmentBlock, values),
    );
    props.refetchEvents?.();
    props.onClose(true);
  }

  // special logic for school-entry: when appointment blocks with extra length use sopass instead of physicians and MFAs
  const physicianOptions =
    appointmentBlock.extraLength && props.sopasss
      ? undefined
      : props.physicians;
  const medicalAssistantOptions =
    appointmentBlock.extraLength && props.sopasss ? undefined : props.mfas;
  const consultantOptions = props.consultants;
  const sopassOptions = appointmentBlock.extraLength
    ? props.sopasss
    : undefined;

  function handleValidate(values: UpdateAppointmentBlockValues) {
    if (!props.withTeam) {
      return;
    }
    const errors: FormikErrors<UpdateAppointmentBlockValues> = {};
    const missing: string[] = [];
    const physiciansEmpty = isEmpty(values.physicians ?? []);
    const mfasEmpty = isEmpty(values.mfas ?? []);
    const consultantsEmpty = isEmpty(values.consultants ?? []);
    const sopasssEmpty = isEmpty(values.sopasss ?? []);

    if (isDefined(physicianOptions) && physiciansEmpty) {
      missing.push("ein Arzt/eine Ärztin");
    }
    if (isDefined(medicalAssistantOptions) && mfasEmpty) {
      missing.push("ein:e MFA");
    }
    if (isDefined(consultantOptions) && consultantsEmpty) {
      missing.push("ein:e Berater:in");
    }
    if (isDefined(sopassOptions) && sopasssEmpty) {
      missing.push("ein:e SOPASS qualifizierte:r MFA");
    }

    if (physiciansEmpty && mfasEmpty && consultantsEmpty && sopasssEmpty) {
      const msg = `Es muss mindestens ${missing.join(" oder ")} ausgewählt sein.`;
      errors.physicians = msg;
      errors.mfas = msg;
      errors.consultants = msg;
      errors.sopasss = msg;
    }

    return errors;
  }

  return (
    <Formik
      initialValues={{
        startTime: formatTimeInput(appointmentBlock.start),
        endTime: formatTimeInput(appointmentBlock.end),
        parallelExaminations: appointmentBlock.parallelExaminations,
        mfas: appointmentBlock.mfas,
        physicians: appointmentBlock.physicians,
        consultants: appointmentBlock.consultants,
        sopasss: appointmentBlock.sopasss,
        room: parseOptionalValue(appointmentBlock.room),
        availableForCitizen: appointmentBlock.availableForCitizen,
        availableForBulkBooking: appointmentBlock.availableForBulkBooking,
      }}
      validate={handleValidate}
      onSubmit={handleUpdate}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <UpdateAppointmentBlockSidebarContent
            formValues={values}
            appointmentBlock={appointmentBlock}
            appointmentTypes={
              props.appointmentTypes ?? appointmentBlock.types ?? []
            }
            withTeam={props.withTeam}
            physicians={physicianOptions}
            mfas={medicalAssistantOptions}
            consultants={consultantOptions}
            sopasss={sopassOptions}
            appointmentBlockApi={props.appointmentBlockApi}
            appointmentBlockApiQueryKey={props.appointmentBlockApiQueryKey}
            standardDurations={props.standardDurations}
          />
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() =>
                props.onCancel ? props.onCancel() : props.onClose(true)
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

export function mapFormValuesToApiValues(
  appointmentBlock: AppointmentBlock,
  values: UpdateAppointmentBlockValues,
): UpdateAppointmentBlockRequest {
  return {
    appointmentBlockId: appointmentBlock.id,
    apiUpdateAppointmentBlockRequest: {
      start: toLocalDateTime(
        formatDateInput(appointmentBlock.start),
        values.startTime,
      ),
      end: toLocalDateTime(
        formatDateInput(appointmentBlock.end),
        values.endTime,
      ),
      parallelExaminations: values.parallelExaminations ?? 1,
      mfas: values.mfas ?? [],
      physicians: values.physicians ?? [],
      consultants: values.consultants ?? [],
      sopasss: values.sopasss ?? [],
      room: mapOptionalValue(values.room),
      availableForCitizen: values.availableForCitizen,
      availableForBulkBooking: values.availableForBulkBooking,
    },
  };
}
