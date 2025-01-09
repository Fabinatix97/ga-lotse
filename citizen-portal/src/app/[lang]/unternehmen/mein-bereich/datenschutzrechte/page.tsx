/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGdprProcedureType } from "@eshg/citizen-portal-api/base";
import { Button, Sheet, Typography } from "@mui/joy";
import { useId } from "react";

import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

const gdprProcedureTypes = Object.values(ApiGdprProcedureType);

export default function OrganizationGdprOverview() {
  const { t } = useTranslation();

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
              >
                {msg(type, "description")}
              </ActionTile>
            ))}
          </InfoSectionGrid>
        </ContentSheet>
      </PageContent>
    </PageLayout>
  );
}

interface ActionTileProps {
  readonly title: string;
  readonly buttonLabel: string;
  readonly children: string;
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
      <Typography level="h2">{props.title}</Typography>
      {props.children}
      <Button
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
