/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/base-api";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { Button, Sheet, Typography } from "@mui/joy";
import { useId, useState } from "react";

import { ConfirmStartGdprProcedureDialog } from "@/lib/baseModule/components/gdpr/form/ConfirmStartGdprProcedureDialog";
import { GdprObjectionFormDialog } from "@/lib/baseModule/components/gdpr/form/GdprObjectionFormDialog";
import { UserType } from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

const gdprProcedureTypes = Object.values(ApiGdprProcedureType);

export function GdprRightsOverview({ type }: { type: UserType }) {
  const { t } = useTranslation();
  const [chosenProcedureType, setChosenProcedureType] = useState<
    ApiGdprProcedureType | undefined
  >();

  function msg(
    type: ApiGdprProcedureType,
    key: "title" | "description" | "button",
  ) {
    return t(`gdpr:overview.${type.toLowerCase()}.${key}`);
  }

  return (
    <PageLayout>
      <PageContent>
        <PageTitle
          toolbar={<LogoutButton text={t("translation:common.leave")} />}
        >
          {t("gdpr:overview.title")}
        </PageTitle>

        <ContentSheet missingTitle>
          <InfoSectionGrid>
            {gdprProcedureTypes.map((type) => (
              <ActionTile
                key={type}
                title={msg(type, "title")}
                buttonLabel={msg(type, "button")}
                onClick={() => setChosenProcedureType(type)}
              >
                {msg(type, "description")}
              </ActionTile>
            ))}
          </InfoSectionGrid>
        </ContentSheet>

        <QueryBoundary>
          <GdprObjectionFormDialog
            open={chosenProcedureType === ApiGdprProcedureType.ToObject}
            onClose={() => setChosenProcedureType(undefined)}
          />

          <ConfirmStartGdprProcedureDialog
            type={chosenProcedureType}
            userType={type}
            onClose={() => setChosenProcedureType(undefined)}
          />
        </QueryBoundary>
      </PageContent>
    </PageLayout>
  );
}

interface ActionTileProps {
  readonly title: string;
  readonly buttonLabel: string;
  readonly children: string;
  readonly onClick: () => void;
}

function ActionTile(props: ActionTileProps) {
  const id = useId();
  return (
    <Sheet
      component="section"
      aria-labelledby={id}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.level1,
        gap: theme.spacing(2),
        display: "grid",
      })}
    >
      <Typography level="h2" id={id}>
        {props.title}
      </Typography>
      <Typography>{props.children}</Typography>
      <Button
        onClick={props.onClick}
        sx={{
          margin: 3,
          width: "calc(100% * 2/3)",
          minWidth: "fit-content",
          placeSelf: "center",
        }}
      >
        {props.buttonLabel}
      </Button>
    </Sheet>
  );
}
