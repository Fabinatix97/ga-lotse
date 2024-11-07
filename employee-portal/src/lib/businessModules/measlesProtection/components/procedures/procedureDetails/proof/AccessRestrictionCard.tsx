/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAccessRestriction,
  ApiMeaslesProtectionFeature,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Sheet, Stack } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/measlesProtection/api/queries/featureTogglesApi";
import { ACCESS_RESTRICTION_FIELDS } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AccessRestrictionSidebar";
import { EDIT_ACCESS_RESTRICTION_SEARCH_PARAM } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/EditAccessRestrictionSidebar";
import {
  formatName,
  getPersonByIdFromProcedure,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { ProofTabEntry } from "./ProofTabEntry";
import { ProofTabFileCard } from "./ProofTabFileCard";

const fields = ACCESS_RESTRICTION_FIELDS;

export interface AccessRestrictionCardProps {
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
  const isEditAccessRestrictionEnabled = useIsNewFeatureEnabled(
    ApiMeaslesProtectionFeature.EditAccessRestriction,
  );

  return (
    <Sheet sx={{ height: "100%" }}>
      <DetailsSection
        title="Betretungsverbot"
        {...(isEditAccessRestrictionEnabled &&
          !procedureClosed &&
          accessRestriction && {
            buttons: (
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
        <Stack spacing={3} alignItems={"start"} width={"100%"}>
          {accessRestriction ? (
            <>
              <Stack gap={3} flexDirection={"row"}>
                <DetailsCell
                  label={fields.restrictionIssuedDate.label}
                  value={formatDate(accessRestriction.restrictionIssuedDate)}
                />
                <DetailsCell
                  label={fields.restrictionStartDate.label}
                  value={formatDate(accessRestriction.restrictionStartDate)}
                />
                {accessRestriction.restrictionTerminationDate && (
                  <DetailsCell
                    label={fields.restrictionTerminationDate.label}
                    value={formatDate(
                      accessRestriction.restrictionTerminationDate,
                    )}
                  />
                )}
              </Stack>
              {accessRestriction.letters?.map((letter) => (
                <ProofTabEntry key={letter.externalId}>
                  <DetailsCell label="" value="Anschreiben" />
                  <DetailsCell
                    label="Empfänger"
                    value={formatName(
                      getPersonByIdFromProcedure(letter.recipientId, procedure),
                    )}
                    sx={{ width: "100%" }}
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
              <Button
                variant="plain"
                startDecorator={<Add />}
                onClick={onClick}
              >
                Betretungsverbot erteilen
              </Button>
            )
          )}
        </Stack>
      </DetailsSection>
    </Sheet>
  );
}
