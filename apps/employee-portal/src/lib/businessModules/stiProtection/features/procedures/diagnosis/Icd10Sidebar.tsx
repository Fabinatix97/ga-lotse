/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Close, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  styled,
  useTheme,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { visuallyHidden } from "@mui/utils";
import { FormikErrors } from "formik";
import {
  ChangeEvent,
  TdHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

import { ApiIcd10Code } from "@eshg/base-api";
import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { LiveAnnouncer } from "@eshg/lib-portal";

import { useSearchIcd10Codes } from "@/lib/baseModule/api/queries/icd10Codes";

import { DiagnosisFormData, sortIcd10Codes } from "./helpers";

export function useIcd10Sidebar(): UseSidebarResult<Icd10SidebarProps> {
  return useSidebar({
    component: Icd10Sidebar,
  });
}

interface Icd10SidebarProps extends DrawerProps {
  onSubmit: (
    selectedCodes: ApiIcd10Code[],
  ) => Promise<void | FormikErrors<DiagnosisFormData>>;
  initiallySelectedCodes: ApiIcd10Code[];
}

const StyledTable = styled(Table)({
  td: {
    verticalAlign: "top",
  },
  tr: {
    cursor: "pointer",
  },
});

function StyledTd({
  children,
  ...props
}: Omit<TdHTMLAttributes<HTMLTableDataCellElement>, "style"> & {
  sx?: SxProps;
}) {
  return (
    <Box component="td" {...props}>
      {children}
    </Box>
  );
}

function Icd10Sidebar(props: Icd10SidebarProps) {
  const theme = useTheme();
  const checkboxRefs = useRef<(HTMLElement | null)[]>([]);
  const searchRef = useRef<HTMLElement | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<ApiIcd10Code[]>(
    props.initiallySelectedCodes,
  );
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearchString] = useDebounce(searchString, 250, {
    trailing: true,
  });
  const searchResult = useSearchIcd10Codes({
    searchString: debouncedSearchString,
  });

  const isSearchMode = debouncedSearchString.length >= 1;
  const displayedCodes = useMemo(() => {
    const codes =
      isSearchMode && searchResult.isSuccess
        ? searchResult.data.codes
        : selectedCodes;

    return sortIcd10Codes(codes);
  }, [isSearchMode, searchResult, selectedCodes]);

  function addToSelection(addCode: ApiIcd10Code) {
    const nextCodes = sortIcd10Codes([...selectedCodes, addCode]);
    setSelectedCodes(nextCodes);
  }

  function removeFromSelection(removeCode: ApiIcd10Code, index: number) {
    setSelectedCodes(
      selectedCodes.filter(({ code }) => code !== removeCode.code),
    );
    if (selectedCodes.length > 0) {
      if (index === 0) {
        (checkboxRefs.current[1] ?? searchRef.current)?.focus();
      } else {
        (checkboxRefs.current[index - 1] ?? searchRef.current)?.focus();
      }
    }
  }

  function toggleSelection(icd10Code: ApiIcd10Code, index: number) {
    if (selectedCodes.find(({ code }) => code === icd10Code.code)) {
      removeFromSelection(icd10Code, index);
    } else {
      addToSelection(icd10Code);
    }
  }

  function handleChangeSearchInput(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);
  }

  function handleClearSearchInput() {
    setSearchString("");
  }

  async function handleSubmit() {
    await props.onSubmit(selectedCodes);
    props.onClose();
  }

  return (
    <>
      <LiveAnnouncer
        message="Keine ICD-10 Codes gefunden"
        active={displayedCodes.length === 0}
      />
      <LiveAnnouncer
        message={`${displayedCodes.length} ICD-10 Codes gefunden`}
        active={displayedCodes.length > 0}
      />
      <SidebarContent title="ICD-10 Katalog">
        <Stack gap={3}>
          <FormControl size="md" role="search" aria-label="ICD-10 Katalog">
            <FormLabel>Suche</FormLabel>
            <Input
              value={searchString}
              startDecorator={<SearchOutlined />}
              endDecorator={
                searchString.length > 0 && (
                  <IconButton
                    aria-label="Suche zurücksetzen"
                    onClick={handleClearSearchInput}
                  >
                    <Close />
                  </IconButton>
                )
              }
              slotProps={{
                input: {
                  ref: (el) => {
                    searchRef.current = el;
                  },
                },
              }}
              onChange={handleChangeSearchInput}
            />
          </FormControl>
          <Button
            variant="plain"
            sx={{
              width: "fit-content",
              "&.Mui-disabled": {
                color: theme.palette.primary.plainColor,
              },
            }}
            disabled={!searchString}
            onClick={() => setSearchString("")}
          >
            {`${selectedCodes.length} Befunde ausgewählt`}
          </Button>
          <StyledTable>
            <Box component="thead" sx={visuallyHidden}>
              <tr>
                <th>An- und Abwählen</th>
                <th>ICD-10 Code</th>
                <th>Beschreibung</th>
              </tr>
            </Box>
            <tbody>
              {displayedCodes.map((currentRowCode, index) => (
                <tr
                  key={currentRowCode.code}
                  onClick={() => toggleSelection(currentRowCode, index)}
                >
                  <StyledTd sx={{ width: "40px", paddingLeft: 0 }}>
                    <Checkbox
                      checked={
                        !!selectedCodes.find(
                          ({ code }) => code === currentRowCode.code,
                        )
                      }
                      size="sm"
                      variant="outlined"
                      slotProps={{
                        input: {
                          "aria-label": currentRowCode.originalCode,
                          "aria-describedby": `${currentRowCode.code}-title`,
                          ref: (el) => {
                            checkboxRefs.current[index] = el;
                          },
                        },
                      }}
                    />
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-code`}
                    sx={{
                      width: "72px",
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentRowCode.originalCode}
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-title`}
                    sx={{
                      paddingRight: 0,
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                    }}
                  >
                    {currentRowCode.title}
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="cancel"
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Abbrechen
            </Button>,
            <Button key="submit" color="primary" onClick={handleSubmit}>
              Übernehmen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}
