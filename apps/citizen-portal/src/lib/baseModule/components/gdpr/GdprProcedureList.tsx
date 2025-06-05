/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import UnexpandedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ExpandedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  CircularProgress,
  Sheet,
  Stack,
  Typography,
  accordionSummaryClasses,
  styled,
} from "@mui/joy";
import { Suspense, useState } from "react";
import { isDefined } from "remeda";

import {
  ApiCitizenUsersGdprProcedure,
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
} from "@eshg/base-api";
import { formatDate } from "@eshg/lib-portal";

import { GdprProcedureDownloads } from "@/lib/baseModule/components/gdpr/GdprProcedureDownloads";
import { GdprProcedureStatusChip } from "@/lib/baseModule/components/gdpr/GdprProcedureStatusChip";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";

function isDetailsAvailable(procedure: ApiCitizenUsersGdprProcedure) {
  return (
    procedure.status === ApiGdprProcedureStatus.Aborted ||
    procedure.status === ApiGdprProcedureStatus.Closed
  );
}

export function GdprProcedureList({
  procedures,
}: Readonly<{
  procedures: ApiCitizenUsersGdprProcedure[];
}>) {
  const [focused, setFocused] = useState<string | undefined>();

  return (
    <Stack gap={2}>
      <AccordionGroup disableDivider data-testid="gdpr-procedure-results">
        {procedures.map((procedure) => (
          <StyledAccordion
            key={procedure.id}
            variant="soft"
            disabled={!isDetailsAvailable(procedure)}
            expanded={focused === procedure.id}
            onChange={(_, expanded) =>
              setFocused(expanded ? procedure.id : undefined)
            }
          >
            <AccordionSummary
              slots={{
                indicator: GdprSummaryIndicator,
              }}
              slotProps={{
                indicator: {
                  status: procedure.status,
                  expanded: focused === procedure.id,
                  enabled: isDetailsAvailable(procedure),
                },
              }}
            >
              <GdprProcedureSummary procedure={procedure} />
            </AccordionSummary>
            <AccordionDetails>
              <GdprProcedureDetails
                procedure={procedure}
                expanded={focused === procedure.id}
              />
            </AccordionDetails>
          </StyledAccordion>
        ))}
      </AccordionGroup>
    </Stack>
  );
}

function GdprSummaryIndicator({
  enabled,
  expanded,
  status,
}: {
  enabled: boolean;
  expanded: boolean;
  status: ApiGdprProcedureStatus;
}) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <GdprProcedureStatusChip status={status} />
      {expanded ? (
        <ExpandedIcon sx={{ opacity: enabled ? 1 : 0 }} />
      ) : (
        <UnexpandedIcon sx={{ opacity: enabled ? 1 : 0 }} />
      )}
    </Stack>
  );
}

function GdprProcedureSummary({
  procedure,
}: Readonly<{
  procedure: ApiCitizenUsersGdprProcedure;
}>) {
  const { t } = useTranslation("gdpr");
  return (
    <Stack
      direction={byBreakpoint({ mobile: "column", desktop: "row" })}
      flex={1}
    >
      <Typography
        level="title-md"
        sx={{
          flex: 1,
          maxWidth: "15rem",
        }}
      >
        {t(`gdpr_procedure_summary.type.${procedure.type}`)}
      </Typography>
      <Typography>{formatDate(procedure.createdAt)}</Typography>
    </Stack>
  );
}

function GdprProcedureDetails({
  procedure,
  expanded,
}: Readonly<{
  procedure: ApiCitizenUsersGdprProcedure;
  expanded: boolean;
}>) {
  const showDownloads =
    expanded &&
    procedure.hasDownloads &&
    procedure.status === ApiGdprProcedureStatus.Closed;

  const hasDescription =
    procedure.status === ApiGdprProcedureStatus.Closed ||
    procedure.status === ApiGdprProcedureStatus.Aborted;

  const { t } = useTranslation("gdpr");

  const isAccess = procedure.type === ApiGdprProcedureType.OfAccess;
  const isErasure = procedure.type === ApiGdprProcedureType.ToErasure;

  const descriptionKey = "gdpr_procedure_details.description";
  const descriptionParts = [`${procedure.status}`];

  if (isAccess) {
    descriptionParts.push(`hasDownloads.${procedure.hasDownloads}`);
  }
  if (isErasure) {
    descriptionParts.push("deleteHint");
  }

  const description = descriptionParts
    .map((key) => t(`${descriptionKey}.${key}`))
    .join(" ");

  return (
    <Stack gap={2} sx={{ paddingInline: 1 }}>
      {hasDescription && (
        <Typography
          sx={{
            textWrap: "pretty",
            hyphens: "auto",
            overflowWrap: "anywhere",
          }}
        >
          {description}
        </Typography>
      )}

      {isDefined(procedure.matterOfConcern) && (
        <Stack gap={1}>
          <Typography level="title-sm" noWrap>
            {t("gdpr_procedure_fields.matter_of_concern")}
          </Typography>
          <Typography sx={{ textWrap: "pretty", hyphens: "auto" }}>
            {procedure.matterOfConcern}
          </Typography>
        </Stack>
      )}
      <Suspense
        fallback={
          <Sheet>
            <Stack alignItems="center" gap={1}>
              <CircularProgress />
              <Typography level="title-md">
                {t("translation:common.loading")}
              </Typography>
            </Stack>
          </Sheet>
        }
      >
        {showDownloads && <GdprProcedureDownloads procedure={procedure} />}
      </Suspense>
    </Stack>
  );
}

const StyledAccordion = styled(Accordion)(({ theme, disabled }) => ({
  "--variant-plainDisabledColor": theme.palette.text.primary,
  borderRadius: 10,
  margin: theme.spacing(1),
  [`& .${accordionSummaryClasses.button}`]: {
    padding: theme.spacing(2),
    borderRadius: 10,
    alignItems: "start",
    [`@media (width < ${theme.breakpoints.values.xs}px)`]: {
      flexDirection: "column-reverse",
      ["& > *:last-child"]: {
        alignSelf: "flex-end",
      },
    },
  },
  [`& .${accordionSummaryClasses.indicator}`]: {
    opacity: disabled ? 0 : 1,
  },
}));
