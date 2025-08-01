/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  BottomToolbar,
  ButtonBar,
  OverlayBoundary,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { BaseConfirmationDialog } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";
import {
  useCloseProcedure,
  useGenerateSchoolInfoLetterPdf,
} from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

import { LeaveDirtyConfirmationDialogProps } from "./LeaveDirtyConfirmationDialogProps";

export function SchoolInfoLetterPageBottomBar(props: {
  procedureId: string;
  navigateToEyeExamination: () => void;
}) {
  const { handleReset, dirty, isSubmitting, submitForm } =
    useFormikContext<SchoolInfoLetter>();

  const { openCancelDialog, openConfirmationDialog } = useConfirmationDialog();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const { download } = useGenerateSchoolInfoLetterPdf(props.procedureId);

  function handleResetWhenDirty() {
    openCancelDialog({
      title: "Änderungen zurücksetzen?",
      description:
        "Der Schulinfobrief wird auf den Ausgangspunkt zurückgesetzt. Alle Änderungen gehen dabei verloren.",
      confirmLabel: "Ja, zurücksetzen",
      onConfirm: () => {
        return handleReset();
      },
    });
  }

  return (
    <StickyBottomBox
      sx={{
        marginInline: `-${theme.spacing(3)}`,
      }}
    >
      <BottomToolbar>
        <ButtonBar
          left={
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                if (dirty) {
                  openConfirmationDialog(
                    LeaveDirtyConfirmationDialogProps(
                      submitForm,
                      props.navigateToEyeExamination,
                    ),
                  );
                } else {
                  props.navigateToEyeExamination();
                }
              }}
            >
              Zurück zur Untersuchung
            </Button>
          }
          right={[
            <Button
              key="reset"
              color="danger"
              variant="plain"
              onClick={() => {
                if (dirty) {
                  handleResetWhenDirty();
                }
              }}
            >
              Alles zurücksetzen
            </Button>,
            <Button
              key="save"
              variant="plain"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Speichern
            </Button>,
            <Button
              key="pdf-generate"
              onClick={async () => {
                await submitForm();
                await download();
                setCloseDialogOpen(true);
              }}
            >
              PDF generieren
            </Button>,
          ]}
        />
      </BottomToolbar>
      <OverlayBoundary>
        <CloseProcedureModal
          procedureId={props.procedureId}
          closeDialogOpen={closeDialogOpen}
          setCloseDialogOpen={setCloseDialogOpen}
          navigateToEyeExamination={props.navigateToEyeExamination}
        />
      </OverlayBoundary>
    </StickyBottomBox>
  );
}

interface CloseProcedureModalProps {
  procedureId: string;
  closeDialogOpen: boolean;
  setCloseDialogOpen: (
    value: ((prevState: boolean) => boolean) | boolean,
  ) => void;
  navigateToEyeExamination: () => void;
}

function CloseProcedureModal(props: CloseProcedureModalProps) {
  const { data: procedure } = useGetProcedure(props.procedureId);
  const closeProcedure = useCloseProcedure(props.procedureId);
  const router = useRouter();

  async function handleCloseProcedure() {
    await closeProcedure.mutateAsync({ version: procedure.version });
    props.setCloseDialogOpen(false);
    router.push(routes.procedures.byId(props.procedureId).details);
  }

  return (
    <BaseConfirmationDialog
      title="Vorgang abschließen"
      description="Durch das Erstellen des Schulinfobriefs kann der Vorgang geschlossen werden. Möchten Sie den Vorgang jetzt abschließen?"
      confirmLabel="Abschließen"
      open={props.closeDialogOpen}
      cancelLabel="Vorgang nicht abschließen"
      onConfirm={handleCloseProcedure}
      onCancel={() => {
        props.setCloseDialogOpen(false);
        props.navigateToEyeExamination();
      }}
      onClose={() => {
        props.setCloseDialogOpen(false);
      }}
    />
  );
}
