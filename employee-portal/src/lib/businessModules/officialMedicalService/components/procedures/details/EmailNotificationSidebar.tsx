/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiEmployeeOmsProcedureDetails } from "@eshg/official-medical-service-api";

import { usePatchEmailNotifications } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  EmailNotificationsForm,
  EmailNotificationsFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/EmailNotificationsForm";

export function useEmailNotificationSidebar(): UseSidebarWithFormRefResult<EmailNotificationSidebarProps> {
  return useSidebarWithFormRef({ component: EmailNotificationSidebar });
}

interface EmailNotificationSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiEmployeeOmsProcedureDetails;
}

function EmailNotificationSidebar(
  props: Readonly<EmailNotificationSidebarProps>,
) {
  const patchEmailNotifications = usePatchEmailNotifications(
    props.procedure.id,
  );

  async function handleSubmit(values: EmailNotificationsFormValues) {
    await patchEmailNotifications.mutateAsync(
      { sendEmailNotifications: values.sendEmailNotifications },
      {
        onSuccess: () => {
          props.onClose(true);
        },
      },
    );
  }

  return (
    <EmailNotificationsForm
      title={"E-Mail-Benachrichtigungen"}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
      formRef={props.formRef}
      initialValues={{
        sendEmailNotifications: props.procedure.sendEmailNotifications,
      }}
      submitLabel="Speichern"
    />
  );
}
