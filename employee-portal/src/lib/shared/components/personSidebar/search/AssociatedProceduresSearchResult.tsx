/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import ArrowBackIosOutlined from "@mui/icons-material/ArrowBackIosOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface AssociatedProceduresSearchResultProps<TProcedure> {
  inputs: ApiGetReferencePersonResponse;
  procedures: TProcedure[];
  onCancel: () => void;
  onBack?: () => void;
  procedureCard: (props: { procedure: TProcedure }) => ReactNode;
}
export function AssociatedProceduresSearchResult<TProcedure>(
  props: AssociatedProceduresSearchResultProps<TProcedure>,
) {
  const procedures = props.procedures;
  const CardComponent = props.procedureCard;

  return (
    <>
      <SidebarContent
        title="Vorhandene Vorgänge"
        header={
          <>
            <Stack gap={2}>
              {isDefined(props.onBack) && (
                <Button
                  variant="plain"
                  startDecorator={<ArrowBackIosOutlined />}
                  sx={{ alignSelf: "start", paddingInline: 0 }}
                  onClick={props.onBack}
                >
                  Zurück
                </Button>
              )}
              <Stack>
                Bereits vorhandene Vorgänge zur Person:
                <Typography level={"title-md"}>
                  {props.inputs.firstName} {props.inputs.lastName},{" "}
                  {formatDate(new Date(props.inputs.dateOfBirth))}
                </Typography>
              </Stack>
            </Stack>
          </>
        }
      >
        <Stack gap={2}>
          {procedures.map((procedure, index) => (
            <CardComponent key={index} procedure={procedure} />
          ))}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <Stack direction="row" gap={2} sx={{ justifyContent: "end" }}>
          <Button
            onClick={props.onCancel}
            color="neutral"
            variant="soft"
            sx={{ alignSelf: "end" }}
          >
            Abbrechen
          </Button>
        </Stack>
      </SidebarActions>
    </>
  );
}
