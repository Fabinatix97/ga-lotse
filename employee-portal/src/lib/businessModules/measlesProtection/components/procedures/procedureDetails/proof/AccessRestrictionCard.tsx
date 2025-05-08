/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/joy";

import { DetailsItem } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAccessRestriction,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

import { ACCESS_RESTRICTION_FIELDS } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AccessRestrictionSidebar";
import { EDIT_ACCESS_RESTRICTION_SEARCH_PARAM } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/EditAccessRestrictionSidebar";
import {
  formatName,
  getPersonByIdFromProcedure,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { ProofTabEntry } from "./ProofTabEntry";
import { ProofTabFileCard } from "./ProofTabFileCard";

const fields = ACCESS_RESTRICTION_FIELDS;

interface AccessRestrictionCardProps {
  procedure: ApiMeaslesProtectionProcedure;
  accessRestriction?: ApiAccessRestriction;
  onClick: () => void;
  onClickAddLetter: () => void;
  procedureClosed: boolean;
}

export function AccessRestrictionCard({
  procedure,
  accessRestriction,
  onClick,
  onClickAddLetter,
  procedureClosed,
}: Readonly<AccessRestrictionCardProps>) {
  const [_isEditOpen, setEditOpen] = useSearchParam(
    EDIT_ACCESS_RESTRICTION_SEARCH_PARAM,
    "boolean",
  );

  return (
    <InfoTile
      title="Betretungsverbot"
      name="accessRestriction"
      sx={{ height: "100%" }}
      {...(!procedureClosed &&
        accessRestriction && {
          controls: (
            <IconButton
              aria-label="Betretungsverbot bearbeiten"
              color="primary"
              variant="outlined"
              onClick={() => setEditOpen(true)}
            >
              <EditOutlined />
            </IconButton>
          ),
        })}
    >
      <Stack spacing={3} alignItems="start" width="100%">
        {accessRestriction ? (
          <>
            <Stack gap={3} flexDirection="row">
              <DetailsItem
                label={fields.restrictionIssuedDate.label}
                value={formatDate(accessRestriction.restrictionIssuedDate)}
              />
              <DetailsItem
                label={fields.restrictionStartDate.label}
                value={formatDate(accessRestriction.restrictionStartDate)}
              />
              {accessRestriction.restrictionTerminationDate && (
                <DetailsItem
                  label={fields.restrictionTerminationDate.label}
                  value={formatDate(
                    accessRestriction.restrictionTerminationDate,
                  )}
                />
              )}
            </Stack>
            {accessRestriction.letters?.map((letter) => (
              <ProofTabEntry key={letter.externalId}>
                <DetailsItem label="" value="Anschreiben" />
                <DetailsItem
                  label="Empfänger"
                  value={formatName(
                    getPersonByIdFromProcedure(letter.recipientId, procedure),
                  )}
                />
                {letter.documentFileId && (
                  <ProofTabFileCard fileId={letter.documentFileId} />
                )}
              </ProofTabEntry>
            ))}
            {!procedureClosed && (
              <Button
                variant="plain"
                startDecorator={<Add />}
                onClick={onClickAddLetter}
              >
                Anschreiben hinzufügen
              </Button>
            )}
          </>
        ) : (
          !procedureClosed && (
            <Button variant="plain" startDecorator={<Add />} onClick={onClick}>
              Betretungsverbot erteilen
            </Button>
          )
        )}
      </Stack>
    </InfoTile>
  );
}
