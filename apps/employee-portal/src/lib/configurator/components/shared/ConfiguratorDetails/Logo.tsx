/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { FileType } from "@eshg/lib-portal";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useUpdateLogo } from "@/lib/shared/api/mutations/configurator/useUpdateLogo";
import { useGetLogoInfo } from "@/lib/shared/api/queries/configurator/logo";

enum FormNames {
  LOGO = "logo",
}

export interface LogoFormModel extends FormikValues {
  [FormNames.LOGO]: ConfigFile;
}

const UPLOAD_FIELD_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName = "LOGO_CONFIG";

export function Logo(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <LogoConfiguratorForm module={props.module} />;
}

function LogoConfiguratorForm(props: { module: ConfiguratorModuleName }) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const result = useGetLogoInfo();

  const updateLogo = useUpdateLogo();

  async function onSubmit(model: LogoFormModel) {
    await updateLogo(model);
  }

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Logo des Gesundheitsamts",
          description: "Das Logo wird im Website-Header angezeigt.",
          sections: [
            {
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "upload",
                        name: FormNames.LOGO,
                        label: "Upload (SVG-Datei)",
                        required: "Upload erforderlich",
                        accept: FileType.Svg,
                        width: { width: UPLOAD_FIELD_WIDTH },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}
