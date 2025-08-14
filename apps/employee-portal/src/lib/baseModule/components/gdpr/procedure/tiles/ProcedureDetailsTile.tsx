/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import EditIcon from "@mui/icons-material/EditOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useState, useTransition } from "react";
import { isDefined, isNullish } from "remeda";

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
  ApiGetGdprProcedureResponse,
} from "@eshg/base-api";
import {
  ButtonBar,
  DetailsItem,
  FormButtonBar,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  AlertSlot,
  BaseModal,
  DetailsList,
  FormPlus,
  InputField,
  formatDateTime,
  useAlert,
  useSnackbar,
} from "@eshg/lib-portal";

import QueryBoundary from "@/app/@modal/template";
import {
  useChangeProcedureStatus,
  useRefreshProcedureStatus,
} from "@/lib/baseModule/api/mutations/gdpr";
import { isGdprPerson } from "@/lib/baseModule/components/gdpr/helpers";
import {
  gdprProcedureTypeWithGdprArticle,
  statusTranslation,
  typeTranslation,
} from "@/lib/baseModule/components/gdpr/i18n";
import { DownloadReportButton } from "@/lib/baseModule/components/gdpr/procedure/DownloadReportButton";
import { MatterOfConcernDisplayField } from "@/lib/baseModule/components/gdpr/procedure/MatterOfConcernDisplayField";
import { useEditMatterOfConcernSidebar } from "@/lib/baseModule/components/gdpr/procedure/sidebars/EditMatterOfConcernSidebar";
import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";

function isMatterOfConcernRequired(type: ApiGdprProcedureType) {
  return (
    type === ApiGdprProcedureType.ToObject ||
    type === ApiGdprProcedureType.ToRectification
  );
}

type CloseModalMode = "cancel" | "close";

export function ProcedureDetailsTile({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const editMatterOfConcernSidebar = useEditMatterOfConcernSidebar();

  const [closeModalMode, setCloseModalMode] = useState<
    CloseModalMode | undefined
  >();

  const isBroadcast =
    procedure.type === ApiGdprProcedureType.OfAccess ||
    procedure.type === ApiGdprProcedureType.ToErasure;
  const requiresMatterOfConcern = !isBroadcast;

  const isEditable =
    procedure.status === ApiGdprProcedureStatus.Draft ||
    procedure.status === ApiGdprProcedureStatus.InProgress;
  const isCancellable = isEditable && !isBroadcast;
  const isClosable =
    !isBroadcast && procedure.status === ApiGdprProcedureStatus.InProgress;

  const showButtons =
    procedure.status !== ApiGdprProcedureStatus.Aborted &&
    procedure.status !== ApiGdprProcedureStatus.Closed;

  const canDownloadReport =
    procedure.type === ApiGdprProcedureType.ToObject &&
    (procedure.status === ApiGdprProcedureStatus.InProgress ||
      procedure.status === ApiGdprProcedureStatus.Closed);

  return (
    <DetailsList>
      <SectionTile id="procedure-details">
        <SectionTitle id="procedure-details">
          <Stack
            component="span"
            direction="row"
            justifyContent="space-between"
          >
            <Typography component="span">Zusatzinfos</Typography>
            {requiresMatterOfConcern && isEditable && (
              <IconButton
                size="sm"
                color="primary"
                variant="outlined"
                aria-label="Editieren"
                onClick={() => editMatterOfConcernSidebar.open({ procedure })}
              >
                <EditIcon />
              </IconButton>
            )}
          </Stack>
        </SectionTitle>

        <AlertSlot />

        <DetailsItem
          label="Erstellt"
          value={formatDateTime(procedure.createdAt)}
        />
        <DetailsItem
          label="Vorgangsart"
          value={
            isGdprPerson(procedure.identificationData)
              ? gdprProcedureTypeWithGdprArticle[procedure.type]
              : typeTranslation[procedure.type]
          }
          avoidWrap
        />
        <DetailsItem
          label="Status"
          value={statusTranslation[procedure.status]}
        />
        <DetailsItem
          label={
            procedure.status === ApiGdprProcedureStatus.Closed
              ? "Ergebnis"
              : procedure.status === ApiGdprProcedureStatus.Aborted
                ? "Begründung"
                : "Interne Bemerkung"
          }
          value={procedure.internalNote}
        />
        {requiresMatterOfConcern && (
          <MatterOfConcernDisplayField
            value={procedure.matterOfConcern}
            editable={isEditable}
          />
        )}

        {showButtons && (
          <>
            <Divider />
            <ButtonBar
              right={
                <>
                  {isCancellable && (
                    <Button
                      variant="plain"
                      onClick={() => setCloseModalMode("cancel")}
                    >
                      Abbrechen
                    </Button>
                  )}
                  <StartProcedureButton procedure={procedure} />

                  {isClosable && (
                    <Button onClick={() => setCloseModalMode("close")}>
                      Abschließen
                    </Button>
                  )}

                  <RefreshStatusButton procedure={procedure} />
                </>
              }
            />
          </>
        )}
      </SectionTile>

      {canDownloadReport && <DownloadReportButton procedure={procedure} />}

      <QueryBoundary>
        <CompleteProcedureDialog
          key={closeModalMode}
          procedure={procedure}
          mode={closeModalMode}
          onClose={() => setCloseModalMode(undefined)}
        />
      </QueryBoundary>
    </DetailsList>
  );
}

function RefreshStatusButton({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const [isPending, startTransition] = useTransition();
  const refreshStatus = useRefreshProcedureStatus(procedure.id);

  const isVisible =
    procedure.status === ApiGdprProcedureStatus.InProgress &&
    (procedure.type === ApiGdprProcedureType.OfAccess ||
      procedure.type === ApiGdprProcedureType.ToErasure);

  return (
    isVisible && (
      <Button
        loading={isPending}
        loadingPosition="start"
        startDecorator={<RefreshIcon />}
        onClick={() =>
          startTransition(async () => {
            try {
              await refreshStatus.mutateAsync();
            } catch {}
          })
        }
      >
        Status prüfen
      </Button>
    )
  );
}

function StartProcedureButton({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const alert = useAlert();
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();
  const changeProcedureStatus = useChangeProcedureStatus(
    procedure.id,
    procedure.version,
  );

  const isVisible = procedure.status === ApiGdprProcedureStatus.Draft;
  const requiresMatterOfConcern = isMatterOfConcernRequired(procedure.type);

  function startProcedure() {
    if (isNullish(procedure.matterOfConcern) && requiresMatterOfConcern) {
      alert.warning({
        message: "Sie müssen ein Anliegen angeben.",
        closeable: true,
      });
    } else {
      alert.close();
      openConfirmationDialog({
        title: "Wollen Sie den Vorgang starten?",
        description:
          "Nachdem der Vorgang gestartet ist, können Sie keine weiteren Datensätze mehr hinzufügen.",
        confirmLabel: "Vorgang starten",
        onConfirm: () =>
          changeProcedureStatus.mutate(
            { type: "start" },
            {
              onSuccess: () => snackbar.confirmation("Vorgang gestartet"),
            },
          ),
      });
    }
  }

  return isVisible && <Button onClick={() => startProcedure()}>Starten</Button>;
}

function CompleteProcedureDialog({
  procedure,
  onClose,
  mode,
}: {
  procedure: ApiGetGdprProcedureResponse;
  onClose: () => void;
  mode: CloseModalMode | undefined;
}) {
  const snackbar = useSnackbar();
  const changeProcedureStatus = useChangeProcedureStatus(
    procedure.id,
    procedure.version,
  );

  async function handleSubmit(values: { internalNote: string }) {
    await changeProcedureStatus.mutateAsync(
      {
        type: mode!,
        internalNote: values.internalNote,
      },
      {
        onSuccess: () => {
          snackbar.confirmation(
            mode === "close" ? "Vorgang abgeschlossen" : "Vorgang abgebrochen",
          );
          onClose();
        },
      },
    );
  }

  return (
    <BaseModal
      color={mode === "cancel" ? "danger" : "primary"}
      modalTitle={
        mode === "cancel" ? "Vorgang abbrechen" : "Vorgang abschließen"
      }
      open={isDefined(mode)}
      onClose={onClose}
    >
      <Formik
        initialValues={{ internalNote: "" }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormPlus>
            <Stack gap={2}>
              {mode === "cancel" ? (
                <>
                  <Typography>
                    Bitte geben Sie einen Grund an, warum dieser Vorgang
                    abgebrochen wird.
                  </Typography>
                  <InputField
                    name="internalNote"
                    label="Begründung"
                    required="Bitte eine Begründung angeben."
                    hint="Die Begründung ist nur für Mitarbeiter sichtbar."
                  />
                </>
              ) : (
                <>
                  <Typography>
                    Mit dem Abschließen eines Vorgangs, bestätigen Sie, dass das
                    Anliegen abgeschlossen ist.
                  </Typography>
                  <InputField
                    name="internalNote"
                    label="Ergebnis"
                    hint="Das Ergebnis ist nur für Mitarbeiter sichtbar."
                    required="Bitte das Ergebnis des Vorgangs angeben."
                  />
                </>
              )}
              <FormButtonBar
                submitLabel="Bestätigen"
                submitting={isSubmitting}
                onCancel={onClose}
              />
            </Stack>
          </FormPlus>
        )}
      </Formik>
    </BaseModal>
  );
}
