/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FactCheckOutlined } from "@mui/icons-material";
import CropFree from "@mui/icons-material/CropFree";
import { Grid, IconButton, Sheet, Stack, Typography } from "@mui/joy";

import { ApiUser } from "@eshg/base-api";
import { ApiPacklistDefinitionRevision } from "@eshg/inspection-api";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

import { isUnknownUser } from "@/lib/businessModules/inspection/shared/isUnknownUser";
import { UserLink } from "@/lib/shared/components/users/UserLink";

interface PacklistDefinitionRevisionTileProps {
  revision: ApiPacklistDefinitionRevision;
  previousName?: string;
  onClickOnRevision: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
  version: number;
  label: string;
}

export function PacklistDefinitionRevisionTile({
  revision,
  previousName,
  onClickOnRevision,
  version,
  label,
}: Readonly<PacklistDefinitionRevisionTileProps>) {
  return (
    <Sheet variant="outlined" sx={{ mt: 1 }} aria-label={label}>
      <Stack spacing={1} direction="row" alignItems={"flex-start"}>
        <Grid container>
          <FactCheckOutlined
            sx={{
              backgroundColor: "#F0F4F8",
              borderRadius: "5px",
              padding: 1,
              width: "40px",
              height: "40px",
            }}
          />
        </Grid>
        <Stack spacing={0}>
          <Stack>
            <Grid container direction="row" alignItems="center" xs={15.5}>
              <Grid container>
                <Typography id={revision.id} level="h4" component="p">
                  {`Version ${revision.revision}`}
                </Typography>
              </Grid>
              <Grid container direction="row" sx={{ marginLeft: "auto" }}>
                <IconButton
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    onClickOnRevision(revision.defId, version, revision.id)
                  }
                >
                  <CropFree />
                </IconButton>
              </Grid>
            </Grid>
          </Stack>
          <Stack>
            <Stack>
              <NameInfo
                name={revision.name}
                previousName={previousName}
              ></NameInfo>
            </Stack>
            <Stack>
              <ModifiedInfo
                validFrom={revision.validFrom}
                modifiedBy={revision.modifiedBy}
              ></ModifiedInfo>
            </Stack>
            <Stack>
              <Typography>{revision.description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Sheet>
  );
}

function ModifiedInfo({
  validFrom,
  modifiedBy,
}: Readonly<{ validFrom: Date; modifiedBy?: ApiUser }>) {
  if (modifiedBy && !isUnknownUser(modifiedBy)) {
    return (
      <Typography color="neutral">
        Veröffentlicht am {formatDateTime(validFrom)}
        <br />
        von <UserLink user={modifiedBy} />
      </Typography>
    );
  } else {
    return (
      <Typography>Veröffentlicht am {formatDateTime(validFrom)}</Typography>
    );
  }
}

function NameInfo({
  name,
  previousName,
}: Readonly<{ name: string; previousName?: string }>) {
  if (!previousName) {
    return <Typography>Benannt als &quot;{name}&quot;</Typography>;
  } else if (name !== previousName) {
    return <Typography>Umbenannt zu &quot;{name}&quot;</Typography>;
  } else {
    return undefined;
  }
}
