/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { BaseModal, BaseModalPropsRequiredClose } from "@eshg/lib-portal";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useDeleteProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface DeleteProcedureModalProps
  extends Omit<BaseModalPropsRequiredClose, "children" | "modalTitle"> {
  procedure: ProcedureDetails;
}

export function DeleteProcedureModal(props: DeleteProcedureModalProps) {
  const deleteProcedure = useDeleteProcedure();
  const router = useRouter();

  async function handleSubmit() {
    await deleteProcedure.mutateAsync({
      procedureId: props.procedure.id,
      apiDeleteProcedureRequest: {
        version: props.procedure.version,
      },
    });
    // TODO: ISSUE-6052: move onClose and router.push into onSuccess(?)
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
