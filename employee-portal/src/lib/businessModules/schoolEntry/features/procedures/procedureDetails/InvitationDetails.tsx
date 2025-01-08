/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Grid, Typography } from "@mui/joy";

import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface Props {
  procedureId: string;
  isInvitationSend: boolean;
}

export function InvitationDetails(props: Props) {
  return (
    <Grid container>
      <Grid xs={6}>
        {props.isInvitationSend && (
          <Typography
            startDecorator={<CheckCircleOutlineIcon />}
            fontSize="s"
            noWrap
          >
            Einladung versandt
          </Typography>
        )}
      </Grid>
      <Grid xs={6}>
        <Box display="flex" justifyContent="flex-end">
          <InternalLink
            href={routes.procedures.byId(props.procedureId).progressEntries}
          >
            Zur Einladung
          </InternalLink>
        </Box>
      </Grid>
    </Grid>
  );
}
