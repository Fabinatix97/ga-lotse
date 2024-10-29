/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
  ApiGetGdprProcedureResponse,
} from "@eshg/employee-portal-api/base";
import {
  AlertSlot,
  useAlert,
} from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import EditIcon from "@mui/icons-material/EditOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { isNullish } from "remeda";

import { useChangeProcedureStatus } from "@/lib/baseModule/api/mutations/gdpr";
import {
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
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

export function ProcedureDetailsTile({
  procedure,
}: {
  procedure: ApiGetGdprProcedureResponse;
}) {
  const alert = useAlert();

  const editMatterOfConcernSidebar = useEditMatterOfConcernSidebar();

  const changeProcedureStatus = useChangeProcedureStatus(
    procedure.id,
    procedure.version,
  );

  async function startProcedure() {
    if (isNullish(procedure.matterOfConcern)) {
      alert.warning({
        message: "Sie müssen ein Anliegen angeben.",
        closeable: true,
      });
    } else {
      alert.close();
      await changeProcedureStatus
        .mutateAsync(ApiGdprProcedureStatus.InProgress)
        .catch();
    }
  }

  const isObjection = procedure.type === ApiGdprProcedureType.ToObject;
  const isDraft = procedure.status === ApiGdprProcedureStatus.Draft;
  const isEditable =
    procedure.status === ApiGdprProcedureStatus.Draft ||
    procedure.status === ApiGdprProcedureStatus.InProgress;

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
            {isObjection && isEditable && (
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
          value={typeTranslation[procedure.type]}
          avoidWrap
        />
        <DetailsCell
          name={"status"}
          label={"Status"}
          value={statusTranslation[procedure.status]}
        />
        {isObjection && (
          <DetailsCell
            name={"matterOfConcern"}
            label={"Anliegen"}
            value={
              procedure.matterOfConcern ?? (
                <Typography
                  startDecorator={<InfoIcon color={"danger"} size={"md"} />}
                >
                  Bitte Anliegen eintragen.
                </Typography>
              )
            }
            valueSx={{
              ...multiLineEllipsis(3),
              maxWidth: "100%",
            }}
          />
        )}

        <Divider />
        <ButtonBar
          right={
            <>
              <Button variant={"plain"} disabled>
                Abbrechen
              </Button>
              {isDraft && (
                <Button onClick={() => startProcedure()}>Starten</Button>
              )}
            </>
          }
        />
      </SectionTile>

      {isObjection && procedure.status !== ApiGdprProcedureStatus.Draft && (
        <DownloadReportButton procedure={procedure} />
      )}
    </>
  );
}
