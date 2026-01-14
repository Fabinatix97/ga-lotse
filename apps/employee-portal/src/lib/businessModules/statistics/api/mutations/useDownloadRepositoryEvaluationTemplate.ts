/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";
import { routes } from "@/lib/businessModules/statistics/shared/routes";

export function useDownloadEvaluationTemplate(onSuccess?: () => void) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const centralRepositoryApi = useCentralRepositoryApi();
  const mutation = useHandledMutation({
    mutationFn: (props: { id: number; version: number }) =>
      centralRepositoryApi.downloadEvaluationTemplateFromRepository(
        props.id,
        props.version,
      ),
    onSuccess: () => {
      snackbar.confirmation("Auswertungsvorlage heruntergeladen", {
        action: {
          name: "Anzeigen",
          onClick: () => router.push(routes.evaluations.templates.index),
        },
      });
    },
  });

  return async (id: number, version: number) =>
    mutation.mutateAsync(
      {
        id,
        version,
      },
      {
        onSuccess,
      },
    );
}
