/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { NotificationFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/Notification";
import { useNotificationConfigApi } from "@/lib/shared/api/clients";

export function useUpdateNotificationConfig() {
  const snackbar = useSnackbar();
  const notificationConfigApi = useNotificationConfigApi();

  const mutation = useHandledMutation({
    mutationFn: (params: NotificationFormModel) => {
      return notificationConfigApi.updateNotificationConfig(params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
  return (model: NotificationFormModel) => {
    return mutation.mutateAsync(model);
  };
}
