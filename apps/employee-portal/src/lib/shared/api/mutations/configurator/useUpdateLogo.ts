/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileType, useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { LogoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/Logo";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdateLogo() {
  const snackbar = useSnackbar();
  const configApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: (params: LogoFormModel) => {
      const { logo } = params;
      if (logo instanceof File) {
        return configApi.updateLogoSvg(
          new File([logo], logo.name, { type: FileType.Svg.mimeType }),
        );
      }
      return Promise.resolve();
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: LogoFormModel) => {
    return mutation.mutateAsync(model);
  };
}
