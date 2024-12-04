/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
  ApiGetGdprProcedureResponse,
} from "@eshg/employee-portal-api/base";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  AlertSlot,
  useAlert,
} from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import EditIcon from "@mui/icons-material/EditOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useState, useTransition } from "react";
import { isDefined, isNullish } from "remeda";

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
import { useEditMatterOfConcernSidebar } from "@/lib/baseModule/components/gdpr/procedure/sidebars/EditMatterOfConcernSidebar";
import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";

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

  const isRectification =
    procedure.type === ApiGdprProcedureType.ToRectification;
  const isObjection = procedure.type === ApiGdprProcedureType.ToObject;

  const requiresMatterOfConcern = isObjection || isRectification;

  const isEditable =
    procedure.status === ApiGdprProcedureStatus.Draft ||
    procedure.status === ApiGdprProcedureStatus.InProgress;
  const isCancellable =
    isObjection &&
    (procedure.status === ApiGdprProcedureStatus.InProgress ||
      procedure.status === ApiGdprProcedureStatus.Draft);
  const isClosable =
    isObjection && procedure.status === ApiGdprProcedureStatus.InProgress;

  const showButtons =
    procedure.status !== ApiGdprProcedureStatus.Aborted &&
    procedure.status !== ApiGdprProcedureStatus.Closed;

  const canDownloadReport =
    isObjection &&
    (procedure.status === ApiGdprProcedureStatus.InProgress ||
      procedure.status === ApiGdprProcedureStatus.Closed);

  return (
    <>
      <SectionTile id={"procedure-details"}>
        <SectionTitle id={"procedure-details"}>
          <Stack
            component={"span"}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Typography component={"span"}>Zusatzinfos</Typography>
            {requiresMatterOfConcern && isEditable && (
              <IconButton
                size={"sm"}
                color={"primary"}
                variant={"outlined"}
                aria-label={"Editieren"}
                onClick={() => editMatterOfConcernSidebar.open({ procedure })}
              >
                <EditIcon />
              </IconButton>
            )}
          </Stack>
        </SectionTitle>

        <AlertSlot />

        <DetailsCell
          name={"createdAt"}
          label={"Erstellt"}
          value={formatDateTime(procedure.createdAt)}
        />
        <DetailsCell
          name={"type"}
          label={"Vorgangsart"}
          value={
            isGdprPerson(procedure.identificationData)
              ? gdprProcedureTypeWithGdprArticle[procedure.type]
              : typeTranslation[procedure.type]
          }
          avoidWrap
        />
        <DetailsCell
          name={"status"}
          label={"Status"}
          value={statusTranslation[procedure.status]}
        />
        <DetailsCell
          name="internalNote"
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
          <DetailsCell
            name="matterOfConcern"
            label="Anliegen"
            value={
              procedure.matterOfConcern ??
              (isEditable ? (
                <Typography
                  startDecorator={<InfoIcon color="danger" size="md" />}
                >
                  Bitte Anliegen eintragen.
                </Typography>
              ) : (
                ""
              ))
            }
            valueSx={{
              ...multiLineEllipsis(3),
              maxWidth: "100%",
            }}
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
          procedure={procedure}
          mode={closeModalMode}
          key={closeModalMode}
          onClose={() => setCloseModalMode(undefined)}
        />
      </QueryBoundary>
    </>
  );
}

function RefreshStatusButton({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const [isPending, startTransition] = useTransition();
  const snackbar = useSnackbar();
  const refreshStatus = useRefreshProcedureStatus(procedure.id);

  const isVisible =
    procedure.status === ApiGdprProcedureStatus.InProgress &&
    procedure.type === ApiGdprProcedureType.OfAccess;

  return (
    isVisible && (
      <Button
        loading={isPending}
        loadingPosition={"start"}
        startDecorator={<RefreshIcon />}
        onClick={() =>
          startTransition(async () => {
            await refreshStatus.mutateAsync(undefined, {
              onSuccess: (response) => {
                if (response.status === ApiGdprProcedureStatus.Closed) {
                  snackbar.confirmation("Vorgang ist abgeschlossen.");
                }
              },
            });
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
        onSubmit={handleSubmit}
        enableReinitialize
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
