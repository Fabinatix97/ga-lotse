/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { useValidateEmail } from "@eshg/lib-portal";

import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useUpdateNotificationConfig } from "@/lib/shared/api/mutations/configurator/useUpdateNotification";
import { useGetNotificationConfig } from "@/lib/shared/api/queries/configurator/notification";

enum FormNames {
  FROM_ADDRESS = "fromAddress",
  GREETING = "greeting",
}

export interface NotificationFormModel extends FormikValues {
  [FormNames.FROM_ADDRESS]: string;
  [FormNames.GREETING]: string;
}

const endpointName: ConfiguratorEndpointName = "NOTIFICATION";

export function Notification(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <NotificationConfiguratorForm module={props.module} />;
}

function NotificationConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const initialValues = useGetNotificationConfig();
  const onSubmit = useUpdateNotificationConfig();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const validateEmail = useValidateEmail();
  function getSections() {
    return [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.FROM_ADDRESS,
                  label: "Absender E-Mail-Adresse",
                  required: "Bitte eine Absender E-Mail-Adresse angeben",
                  validate: validateEmail,
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.GREETING,
                  label: "Grußformel",
                  placeholder: "z.B. Ihr Gesundheitsamt Frankfurt am Main",
                  required: "Bitte eine Grußformel angeben",
                },
              ],
            },
          ],
        },
      },
    ] satisfies FormSection[];
  }

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Kontaktmöglichkeit per E-Mail",
          description:
            "Definieren Sie, welcher Absender und welche Grußformel Bürger:innen in E-Mail-Benachrichtigungen angezeigt werden.",
          sections: getSections(),
        },
      ]}
      initialValues={initialValues}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}
