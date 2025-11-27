/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { MutationPassThrough, useSnackbar } from "@eshg/lib-portal";

import { ConsultationRequestData } from "../../components/procedures/consultation/ConsultationForm";
import { proceduresQueryKey } from "../queries/apiQueryKeys";

interface UpsertConsultationParams {
  consultation: ConsultationRequestData;
}

export function useUpsertConsultationOptions({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertConsultationParams, void>;
}): MutationOptions<void, Error, UpsertConsultationParams> {
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ consultation }: UpsertConsultationParams) =>
      new Promise((resolve) => {
        setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log(consultation);
          resolve();
        }, 1000);
      }),
    mutationKey: proceduresQueryKey([procedureId, "consultation"]),
    ...(passThrough ?? {
      onSuccess: () => {
        snackbar.confirmation(
          "Die Konsultation wurde erfolgreich gespeichert.",
        );
      },
      onError: () => {
        snackbar.error("Die Konsultation konnte nicht gespeichert werden.");
      },
    }),
  };
}

export function useUpsertConsultation({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertConsultationParams, void>;
}) {
  const options = useUpsertConsultationOptions({ procedureId, passThrough });

  return useMutation(options);
}
