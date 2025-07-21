/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  BottomToolbar,
  ButtonBar,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";
import { useGenerateSchoolInfoLetterPdf } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

import { LeaveDirtyConfirmationDialogProps } from "./LeaveDirtyConfirmationDialogProps";

export function SchoolInfoPageBottomBar(props: {
  onNavigate: () => void;
  procedureId: string;
}) {
  const { handleReset, dirty, isSubmitting, submitForm } =
    useFormikContext<SchoolInfoLetter>();

  const { openCancelDialog, openConfirmationDialog } = useConfirmationDialog();
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
                      props.onNavigate,
                    ),
                  );
                } else {
                  props.onNavigate();
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
                props.onNavigate();
              }}
            >
              PDF generieren
            </Button>,
          ]}
        />
      </BottomToolbar>
    </StickyBottomBox>
  );
}
