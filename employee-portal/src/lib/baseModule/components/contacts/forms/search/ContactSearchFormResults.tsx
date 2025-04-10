/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NoSearchResults } from "@eshg/lib-employee-portal";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

import { routes } from "@/lib/baseModule/shared/routes";

interface ContactSearchFormResultsProps<T> {
  label: string;
  searchTerm: string;
  elements: T[];
  totalNumberOfElements: number;
  onCreateNew: () => void;
  renderCard: (element: T) => ReactNode;
}

export function ContactSearchFormResults<T extends { id: string }>({
  searchTerm,
  label,
  elements,
  totalNumberOfElements,
  onCreateNew,
  renderCard,
}: ContactSearchFormResultsProps<T>) {
  return (
    <Stack gap={2} data-testid={"contact-search-results"}>
      {totalNumberOfElements === 0 ? (
        <EmptyResults
          label={label}
          searchTerm={searchTerm}
          onCreateNew={onCreateNew}
        />
      ) : (
        <>
          <Typography>
            <Typography level={"title-md"}>{totalNumberOfElements}</Typography>{" "}
            {totalNumberOfElements === 1
              ? "ähnlicher Eintrag "
              : "ähnliche Einträge "}
            bereits vorhanden für:
            <br />
            <Typography level={"title-md"}>{searchTerm}</Typography>
          </Typography>
          <Stack gap={2}>
            {elements.map((element) => (
              <InternalLinkButton
                key={element.id}
                href={routes.contacts.details(element.id)}
                target={"_blank"}
                variant={"outlined"}
                size={"lg"}
                color={"primary"}
                startDecorator={<OpenInNewIcon size={"lg"} />}
                sx={(theme) => ({
                  "--Button-margin": 0,
                  "--Button-paddingBlock": theme.spacing(2),
                  justifyContent: "flex-start",
                })}
              >
                {renderCard(element)}
              </InternalLinkButton>
            ))}
          </Stack>
          <FormAddMoreButton onClick={onCreateNew}>
            Neue {label} anlegen
          </FormAddMoreButton>
        </>
      )}
    </Stack>
  );
}

function EmptyResults({
  onCreateNew,
  label,
  searchTerm,
}: {
  onCreateNew: () => void;
  label: string;
  searchTerm: string;
}) {
  return (
    <>
      <Typography>
        <Typography level={"title-md"}>0</Typography> Treffer für:
        <br />
        <Typography level={"title-md"}>{searchTerm}</Typography>
      </Typography>
      <NoSearchResults
        info={"Keine Treffer"}
        buttonLabel={`Neue ${label} anlegen`}
        onClick={onCreateNew}
      />
    </>
  );
}
