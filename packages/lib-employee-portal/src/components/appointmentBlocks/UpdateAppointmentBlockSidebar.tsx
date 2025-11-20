/**
 * Copyright 2025 cronn GmbH
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
import { ApiAppointmentType } from "./types";

export function useUpdateAppointmentBlockSidebar(): UseSidebarWithFormRefResult<UpdateAppointmentBlockProps> {
  return useSidebarWithFormRef({ component: UpdateAppointmentBlockSidebar });
}

interface UpdateAppointmentBlockProps extends SidebarWithFormRefProps {
  appointmentBlockId: string;
  appointmentTypes: ApiAppointmentType[];
  withTeam: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  formRef: Ref<SidebarFormHandle>;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  standardDurations: Partial<Record<ApiAppointmentType, number>>;
}

export interface UpdateAppointmentBlockValues {
  startTime: string;
  endTime: string;
  parallelExaminations?: number;
  physicians?: string[];
  mfas?: string[];
  consultants?: string[];
  room: string;
}

function UpdateAppointmentBlockSidebar(props: UpdateAppointmentBlockProps) {
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

    props.onClose(true);
  }

  function handleValidate(values: UpdateAppointmentBlockValues) {
    if (!props.withTeam) {
      return;
    }
    const errors: FormikErrors<UpdateAppointmentBlockValues> = {};
    const missing: string[] = [];
    const physiciansEmpty = isEmpty(values.physicians ?? []);
    const mfasEmpty = isEmpty(values.mfas ?? []);
    const consultantsEmpty = isEmpty(values.consultants ?? []);

    if (isDefined(props.physicians) && physiciansEmpty) {
      missing.push("einen Arzt/eine Ärztin");
    }
    if (isDefined(props.mfas) && mfasEmpty) {
      missing.push("ein:e MFA");
    }
    if (isDefined(props.consultants) && consultantsEmpty) {
      missing.push("ein:e Berater:in");
    }

    if (physiciansEmpty && mfasEmpty && consultantsEmpty) {
      const msg = `Es muss mindestens ${missing.join(" oder ")} ausgewählt sein.`;
      errors.physicians = msg;
      errors.mfas = msg;
      errors.consultants = msg;
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
        room: parseOptionalValue(appointmentBlock.room),
      }}
      validate={handleValidate}
      onSubmit={handleUpdate}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <UpdateAppointmentBlockSidebarContent
            formValues={values}
            appointmentBlock={appointmentBlock}
            appointmentTypes={props.appointmentTypes}
            withTeam={props.withTeam}
            physicians={props.physicians}
            mfas={props.mfas}
            consultants={props.consultants}
            appointmentBlockApi={props.appointmentBlockApi}
            appointmentBlockApiQueryKey={props.appointmentBlockApiQueryKey}
            standardDurations={props.standardDurations}
          />
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => props.onClose(true)}
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
      room: mapOptionalValue(values.room),
    },
  };
}
