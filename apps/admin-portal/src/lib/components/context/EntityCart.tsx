/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Clear, Save } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useSnackbar } from "@eshg/lib-portal";

import { useAdminApi } from "@/lib/api/clients";
import { getAdminName } from "@/lib/helpers/adminName";
import { entityToString } from "@/lib/helpers/entityToString";
import { isValidEntity } from "@/lib/helpers/entityValidation";
import { ENTITIES_QUERY, StagedEntity } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

interface CartType {
  entities: StagedEntity<unknown>[];
  canAddEntity: (entity: StagedEntity<unknown>) => boolean;
  addEntity: (entity: StagedEntity<unknown>) => void;
  removeEntity: (id: string) => void;
  clear: () => void;
}

const EntityCartContext = createContext<CartType>(null!);

export function EntityCartProvider({ children }: Readonly<PropsWithChildren>) {
  const [entities, setEntities] = useState<StagedEntity<unknown>[]>([]);

  const canAddEntity = useCallback(
    (entity: StagedEntity<unknown>) => {
      return (
        entity.author !== getAdminName() &&
        !entities.some((e) => e.id === entity.id) &&
        !entities.some((e) => e.author !== entity.author) &&
        isValidEntity(entity)
      );
    },
    [entities],
  );

  const addEntity = useCallback((entity: StagedEntity<unknown>) => {
    if (!entity.author) {
      return;
    }
    setEntities((prevEntities) => {
      return [...prevEntities, entity];
    });
  }, []);

  const removeEntity = useCallback(
    (id: string) =>
      setEntities((prevEntities) => {
        return prevEntities.filter((e) => e.id !== id);
      }),
    [],
  );

  const clear = useCallback(() => setEntities([]), []);

  const values = useMemo(
    () => ({
      entities,
      canAddEntity,
      addEntity,
      removeEntity,
      clear,
    }),
    [addEntity, canAddEntity, clear, entities, removeEntity],
  );

  return <EntityCartContext value={values}>{children}</EntityCartContext>;
}

export function useEntityCart() {
  return useContext(EntityCartContext);
}

export function EntityCart() {
  const { t } = useTranslation();

  const { entities, clear } = useEntityCart();

  const save = useCommit(entities, clear);

  if (!entities.length) {
    return false;
  }

  const allEntities = t("allEntities");
  const entitiesLabel = t("entities");

  return (
    <SEntityCart justifyContent="space-between" alignItems="center">
      <Typography level="h3" alignSelf="flex-start">
        {t("entityCart")}
      </Typography>
      <Stack height="100%" alignItems="center">
        <Accordion sx={{ flex: 1, alignItems: "center" }}>
          <AccordionSummary aria-controls={allEntities} id={entitiesLabel}>
            {t("entities", { count: entities.length })}
          </AccordionSummary>
          <AccordionDetails id={allEntities} aria-labelledby={entitiesLabel}>
            {entities.map((entity) => (
              <Entity key={entity.id} entity={entity} />
            ))}
          </AccordionDetails>
        </Accordion>
        <Stack alignItems="center">
          <IconButton aria-label={t("save")} onClick={save}>
            <Save />
          </IconButton>
          <IconButton aria-label={t("discard")} onClick={clear}>
            <Clear />
          </IconButton>
        </Stack>
      </Stack>
    </SEntityCart>
  );
}

const SEntityCart = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  backgroundColor: theme.palette.background.level2,
  borderTop: "1px solid var(--joy-palette-divider)",
  padding: theme.spacing(3),
}));

function Entity({ entity }: Readonly<{ entity: StagedEntity<unknown> }>) {
  const { t } = useTranslation();

  const { removeEntity } = useEntityCart();

  return (
    <Stack alignItems="center">
      {entityToString(entity)}
      <IconButton
        aria-label={t("discard")}
        onClick={() => removeEntity(entity.id)}
      >
        <Clear />
      </IconButton>
    </Stack>
  );
}

function useCommit(
  entities: StagedEntity<unknown>[],
  clear: () => void,
): () => void {
  const adminApi = useAdminApi();
  const queryClient = useQueryClient();

  const snackbar = useSnackbar();

  const handleCommitStagedSuccess = useCallback(() => {
    clear();
    return queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY });
  }, [clear, queryClient]);

  const commitStaged = useMutation({
    mutationFn: () =>
      adminApi.commitStaged(
        undefined,
        entities.map(({ id }) => id),
      ),
    onSuccess: handleCommitStagedSuccess,
    onError: (e) => {
      // eslint-disable-next-line no-console
      console.error("commit error", e);
      snackbar.error(e.message);
    },
  });

  return commitStaged.mutate;
}
