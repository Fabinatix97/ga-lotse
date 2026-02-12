/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ContentCopy,
  FileUploadOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Sheet,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { Formik, type FormikHelpers } from "formik";
import { useCallback, useMemo, useState } from "react";

import { FormPlus } from "@eshg/lib-portal";
import type {
  ApiAdminRuleImport,
  ApiAdminRuleImportError,
  ApiAdminRuleImportResponse,
} from "@eshg/service-directory-api";

import { useAdminApi } from "@/lib/api/clients";
import { SubHeader } from "@/lib/components/header/SubHeader";
import { ENTITIES_QUERY } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

interface RuleImportFormData {
  file: File | null;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === "function") {
    return file.text();
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") {
        resolve(r);
      } else if (r instanceof ArrayBuffer) {
        resolve(new TextDecoder().decode(r));
      } else {
        reject(
          new Error(
            `Unexpected file read result type: ${typeof r}. Expected string or ArrayBuffer.`,
          ),
        );
      }
    };

    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function parseRulesFromJson(parsed: unknown): ApiAdminRuleImport[] {
  let rulesUnknown: unknown;

  if (Array.isArray(parsed)) {
    rulesUnknown = parsed;
  } else if (isPlainObject(parsed)) {
    const maybeRules = parsed.rules;
    if (Array.isArray(maybeRules)) rulesUnknown = maybeRules;
  }

  if (!Array.isArray(rulesUnknown)) {
    const error = new Error(
      "Expected a JSON array of rules or an object { rules: [...] }.",
    );
    (error as Error & { details?: string }).details =
      'Expected format:\n[\n  { "client": {...}, "server": {...}, ... },\n  ...\n]\n\nOr:\n{\n  "rules": [\n    { "client": {...}, "server": {...}, ... },\n    ...\n  ]\n}';
    throw error;
  }

  for (let i = 0; i < rulesUnknown.length; i++) {
    if (!isPlainObject(rulesUnknown[i])) {
      const error = new Error(`Rule #${i + 1} is not a JSON object.`);
      (error as Error & { details?: string }).details =
        `Found type: ${typeof rulesUnknown[i]}\n\nEach rule must be a JSON object with fields like "client", "server", etc.`;
      throw error;
    }
  }

  return rulesUnknown as ApiAdminRuleImport[];
}

function getStringProp(
  obj: Record<string, unknown>,
  key: string,
): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

function safeJson(v: unknown): string | null {
  try {
    return JSON.stringify(v);
  } catch {
    return null;
  }
}

function buildClipboardText(errors: ApiAdminRuleImportError[]) {
  return errors
    .map((err) => {
      const ruleNo = err.index + 1;

      const id = err.id ? `id=${err.id}` : "id=-";
      const client = err.client ? (safeJson(err.client) ?? "-") : "-";
      const server = err.server ? (safeJson(err.server) ?? "-") : "-";
      const msg = err.message ?? "Unknown error";

      return `Rule #${ruleNo} | ${id} | client=${client} | server=${server} | ${msg}`;
    })
    .join("\n");
}

function extractErrorMessage(e: unknown, fallback = "Import failed."): string {
  if (e instanceof Error && e.message) return e.message;

  if (isPlainObject(e)) {
    const msg = getStringProp(e, "message");
    if (msg) return msg;

    const body = e.body;
    if (isPlainObject(body)) {
      const bodyMsg =
        getStringProp(body, "message") ??
        getStringProp(body, "detail") ??
        getStringProp(body, "error");
      if (bodyMsg) return bodyMsg;
    }
  }

  return fallback;
}

function stringifyCompact(v: unknown, maxLen = 220) {
  const full = typeof v === "string" ? v : (safeJson(v) ?? "-");

  if (full.length <= maxLen) return { full, short: full };
  return { full, short: `${full.slice(0, maxLen)}…` };
}

export function RuleImportContent() {
  const adminApi = useAdminApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const tString = useMemo(() => t as unknown as (key: string) => string, [t]);

  const tr = useCallback(
    (key: string, fallback: string) => {
      const val = tString(key);
      if (!val || val === key) return fallback;
      return val;
    },
    [tString],
  );

  const [fatalError, setFatalError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [result, setResult] = useState<ApiAdminRuleImportResponse | null>(null);
  const [totalRulesCount, setTotalRulesCount] = useState<number>(0);
  const [copyInfo, setCopyInfo] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (!result) return null;

    const errors = result.errors ?? [];
    const successCount = totalRulesCount - errors.length;

    return { errors, successCount };
  }, [result, totalRulesCount]);

  const validate = useCallback(
    (values: RuleImportFormData) => {
      const errors: Partial<Record<keyof RuleImportFormData, string>> = {};
      if (!values.file) errors.file = tr("fileRequired", "File is required.");
      return errors;
    },
    [tr],
  );

  const copyErrorsToClipboard = useCallback(
    async (errors: ApiAdminRuleImportError[]) => {
      try {
        await navigator.clipboard.writeText(buildClipboardText(errors));
        setCopyInfo(tr("copiedToClipboard", "Copied errors to clipboard."));
        setTimeout(() => setCopyInfo(null), 2500);
      } catch {
        setCopyInfo(tr("copyFailed", "Copy failed (clipboard not available)."));
        setTimeout(() => setCopyInfo(null), 2500);
      }
    },
    [tr],
  );

  const handleSubmit = useCallback(
    async (
      values: RuleImportFormData,
      { setSubmitting }: FormikHelpers<RuleImportFormData>,
    ) => {
      setSubmitting(true);
      setFatalError(null);
      setErrorDetails(null);
      setResult(null);
      setTotalRulesCount(0);
      setCopyInfo(null);

      try {
        if (!values.file) {
          throw new Error(tr("fileRequired", "File is required."));
        }

        const text = await readFileAsText(values.file);

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch (jsonError) {
          const error = new Error(tr("invalidJson", "File is not valid JSON."));
          let details = "";

          if (jsonError instanceof SyntaxError) {
            const msg = jsonError.message;
            details = `Syntax error: ${msg}\n\n`;

            const posMatch = /position (\d+)/i.exec(msg);
            if (posMatch?.[1]) {
              const pos = parseInt(posMatch[1], 10);
              const start = Math.max(0, pos - 30);
              const end = Math.min(text.length, pos + 30);
              const snippet = text.slice(start, end);
              const relativePos = pos - start;

              details += `Context around error:\n${snippet}\n${" ".repeat(relativePos)}^\n\n`;
            }
          }

          details +=
            'Expected valid JSON format:\n[\n  { "client": {...}, "server": {...} },\n  ...\n]';

          (error as Error & { details?: string }).details = details;
          throw error;
        }

        const rules = parseRulesFromJson(parsed);
        if (rules.length === 0) {
          const error = new Error(
            tr("noRulesFound", "No rules found in import file."),
          );
          (error as Error & { details?: string }).details =
            "The file contains an empty array or the rules array is empty.";
          throw error;
        }

        setTotalRulesCount(rules.length);

        const resp = await adminApi.postRuleImport(rules);
        setResult(resp);

        await queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY });
      } catch (e) {
        setFatalError(
          extractErrorMessage(e, tr("importFailed", "Import failed.")),
        );

        if (
          e &&
          typeof e === "object" &&
          "details" in e &&
          typeof (e as { details?: string }).details === "string"
        ) {
          setErrorDetails((e as { details: string }).details);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [adminApi, queryClient, tr],
  );

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
        <SubHeader
          header={tr("ruleImportHeader", "Import rule configuration")}
        />

        <Tooltip
          placement="right"
          variant="soft"
          title={
            <Typography
              level="body-sm"
              sx={{ whiteSpace: "pre-line", maxWidth: 360 }}
            >
              {tr(
                "ruleImportDescription",
                "Import rules from JSON. Imported/updated rules will end up in READY_FOR_REVIEW (4-eyes principle).\nImport continues even if some rules fail.",
              )}
            </Typography>
          }
        >
          <IconButton
            size="sm"
            variant="plain"
            sx={{ mt: 0.25 }}
            aria-label={tr("ruleImportInfo", "Import info")}
          >
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </Box>

      <Formik<RuleImportFormData>
        initialValues={{ file: null }}
        validate={validate}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          isValid,
          values,
          errors,
          touched,
          submitCount,
          setFieldValue,
          setFieldTouched,
        }) => {
          const showFileError =
            Boolean(errors.file) && (Boolean(touched.file) || submitCount > 0);

          return (
            <FormPlus>
              <FormControl error={showFileError} sx={{ mb: 2, maxWidth: 920 }}>
                <FormLabel>
                  {tr("ruleImportFileLabel", "Configuration file")}
                </FormLabel>

                <Box
                  sx={{
                    display: { xs: "flex", sm: "inline-flex" },
                    width: { xs: "100%", sm: "fit-content" },
                    justifyContent: "flex-start",
                    gap: 1.25,
                    alignItems: "center",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    mt: 0.75,
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      whiteSpace: "nowrap",
                      border: "1px solid",
                      borderColor: "neutral.outlinedBorder",
                    }}
                    endDecorator={<FileUploadOutlined />}
                  >
                    {tr("selectImportConfig", "Select configuration")}
                    <input
                      data-testid="file"
                      hidden
                      type="file"
                      accept="application/json"
                      onChange={(e) => {
                        void setFieldTouched("file", true, false);
                        void setFieldValue(
                          "file",
                          e.currentTarget.files?.[0] ?? null,
                        );
                      }}
                    />
                  </Button>

                  <Typography
                    level="body-sm"
                    sx={{
                      opacity: 0.85,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: { xs: "100%", sm: 420 },
                      flex: "0 1 auto",
                    }}
                    title={values.file?.name ?? ""}
                  >
                    {values.file
                      ? values.file.name
                      : tr("noFileChosen", "No file chosen")}
                  </Typography>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {tr("importConfig", "Import")}
                  </Button>
                </Box>

                {showFileError && (
                  <FormHelperText>{errors.file}</FormHelperText>
                )}
              </FormControl>
            </FormPlus>
          );
        }}
      </Formik>

      {fatalError && (
        <Alert color="danger" variant="soft" sx={{ mt: 2 }}>
          <Box>
            <Typography level="body-sm" sx={{ fontWeight: "md", mb: 0.5 }}>
              {fatalError}
            </Typography>
            {errorDetails && (
              <Typography
                level="body-xs"
                sx={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  mt: 1,
                  p: 1,
                  bgcolor: "danger.softBg",
                  borderRadius: "sm",
                  opacity: 0.9,
                }}
              >
                {errorDetails}
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {summary && (
        <Box sx={{ mt: 2 }}>
          <Alert
            color={summary.errors.length > 0 ? "warning" : "success"}
            variant="soft"
            sx={{ mb: summary.errors.length > 0 ? 1.5 : 0 }}
          >
            <Typography level="body-sm">
              {tr("importFinished", "Import finished")} —{" "}
              {tr("succeeded", "succeeded")}: <b>{summary.successCount}</b>,{" "}
              {tr("errors", "errors")}: <b>{summary.errors.length}</b>
            </Typography>
          </Alert>

          {summary.errors.length > 0 && (
            <Box>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
              >
                <Typography level="title-sm">
                  {tr("errors", "Errors")}
                </Typography>

                <Button
                  size="sm"
                  variant="outlined"
                  startDecorator={<ContentCopy />}
                  onClick={() => copyErrorsToClipboard(summary.errors)}
                >
                  {tr("copy", "Copy")}
                </Button>

                {copyInfo && (
                  <Typography level="body-xs" sx={{ opacity: 0.75 }}>
                    {copyInfo}
                  </Typography>
                )}
              </Box>

              <Sheet
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  overflow: "auto",
                  maxHeight: "600px",
                }}
              >
                <Table
                  size="sm"
                  stickyHeader
                  sx={{
                    minWidth: 900,
                    "& th": { whiteSpace: "nowrap" },
                    "& td": { verticalAlign: "top" },
                    "& th:nth-of-type(1)": { width: 70 },
                    "& th:nth-of-type(2)": { width: 220 },
                    "& th:nth-of-type(3)": { width: 320 },
                    "& th:nth-of-type(4)": { width: 320 },
                  }}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>{tr("client", "Client")}</th>
                      <th>{tr("server", "Server")}</th>
                      <th>{tr("message", "Message")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.errors.map((err, i) => {
                      const client = stringifyCompact(err.client ?? "-");
                      const server = stringifyCompact(err.server ?? "-");

                      return (
                        <tr key={`${err.index}-${i}`}>
                          <td>{err.index + 1}</td>
                          <td>{err.id ?? "-"}</td>
                          <td title={client.full}>
                            <Typography
                              level="body-xs"
                              sx={{
                                fontFamily: "monospace",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 320,
                              }}
                            >
                              {client.short}
                            </Typography>
                          </td>
                          <td title={server.full}>
                            <Typography
                              level="body-xs"
                              sx={{
                                fontFamily: "monospace",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 320,
                              }}
                            >
                              {server.short}
                            </Typography>
                          </td>
                          <td>
                            {err.message ?? tr("unknownError", "Unknown error")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Sheet>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
