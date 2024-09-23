/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useDeleteProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { BaseModal, BaseModalProps } from "@/lib/shared/components/BaseModal";

interface DeleteProcedureModalProps extends Omit<BaseModalProps, "children"> {
  procedure: ProcedureDetails;
}

export function DeleteProcedureModal(props: DeleteProcedureModalProps) {
  const deleteProcedure = useDeleteProcedure();
  const router = useRouter();

  async function handleSubmit() {
    await deleteProcedure
      .mutateAsync({
        procedureId: props.procedure.id,
        apiDeleteProcedureRequest: {
          version: props.procedure.version,
        },
      })
      .catch();
    props.onClose();
    router.push(routes.procedures.overview);
  }

  return (
    <BaseModal modalTitle="Vorgang löschen?" {...props}>
      <Typography level="body-md" marginBottom={3}>
        Der Vorgang wird gelöscht und kann nicht mehr wiederhergestellt werden.
      </Typography>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button variant="outlined" color="neutral" onClick={props.onClose}>
          Abbrechen
        </Button>

        <Button color="danger" onClick={handleSubmit}>
          Löschen
        </Button>
      </Stack>
    </BaseModal>
  );
}
