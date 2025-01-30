/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/base-api";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { Button, Sheet, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useId, useState } from "react";

import { useGetSelfGdprProceduresQuery } from "@/lib/baseModule/api/queries/gdpr";
import { GdprProcedureList } from "@/lib/baseModule/components/gdpr/GdprProcedureList";
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

export function GdprRightsOverview({ userType }: { userType: UserType }) {
  const { t } = useTranslation();
  const [chosenProcedureType, setChosenProcedureType] = useState<
    ApiGdprProcedureType | undefined
  >();

  const { data: procedures } = useSuspenseQuery(
    useGetSelfGdprProceduresQuery(),
  );

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
          {t(`gdpr:overview.title.${userType}`)}
        </PageTitle>

        {procedures.length > 0 && (
          <ContentSheet missingTitle>
            <GdprProcedureList procedures={procedures} />
          </ContentSheet>
        )}

        <ContentSheet missingTitle>
          <InfoSectionGrid>
            {gdprProcedureTypes.map((type) => (
              <ActionTile
                key={type}
                title={msg(type, "title")}
                buttonLabel={msg(type, "button")}
                onClick={() => setChosenProcedureType(type)}
              >
                {t(
                  `gdpr:overview.${type.toLowerCase()}.description.${userType}`,
                )}
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
            userType={userType}
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
        height: "100%",
      })}
    >
      <Typography level="h2" id={id}>
        {props.title}
      </Typography>
      <Typography
        sx={{
          textWrap: "pretty",
          hyphens: "auto",
          overflowWrap: "anywhere",
        }}
      >
        {props.children}
      </Typography>
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
