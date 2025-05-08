/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormLabel, Slider, Stack, Typography, styled } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { useEffect, useState } from "react";

import {
  FileField,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { formatFileSize } from "@eshg/lib-portal/components/formFields/file/helpers";
import { FileLike } from "@eshg/lib-portal/components/formFields/file/types";

import { compressImage } from "@/lib/shared/helpers/imageCompressor";

const StyledImage = styled("img")({ width: "100%" });

export default function PlaygroundImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number | undefined>(undefined);
  const [maxSize, setMaxSize] = useState<number | undefined>(undefined);

  const { data: compressedFile, isFetching } = useQuery({
    queryKey: getQueryKey(originalFile, quality, maxSize),
    queryFn: async () => {
      if (!originalFile) {
        throw new Error("Missing originalFile");
      }

      return compressImage(originalFile, {
        // leave empty to use the default values defined in .env
        quality, // NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY
        maxSize, // NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE
      });
    },
    enabled: !!originalFile,
  });

  const originalFileUrl = useObjectUrl(originalFile);
  const compressedFileUrl = useObjectUrl(compressedFile);

  function handleFormChange(_: { file: null }) {
    // do nothing, FileField needs special handling
  }

  function handleFileChange(file: FileLike | null) {
    setOriginalFile(file as File | null);
  }

  function handleQualityChange(_event: Event, newValue: number | number[]) {
    setQuality(newValue as number);
  }

  function handleMaxSizeChange(_event: Event, newValue: number | number[]) {
    setMaxSize(newValue as number);
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Image Compression" />}>
      <MainContentLayout>
        <Stack gap={4}>
          <Formik initialValues={{ file: null }} onSubmit={handleFormChange}>
            <FormPlus>
              <FileField label="File" name="file" onChange={handleFileChange} />
            </FormPlus>
          </Formik>
          <Stack>
            <FormLabel>Quality: {quality ?? "default"}</FormLabel>
            <Slider
              aria-label="Quality"
              defaultValue={0.8}
              step={0.025}
              marks
              min={0}
              max={1}
              value={quality}
              onChange={handleQualityChange}
            />
          </Stack>
          <Stack>
            <FormLabel>Max Size: {maxSize ?? "default"}</FormLabel>
            <Slider
              aria-label="Max Size"
              defaultValue={1920}
              step={10}
              min={1}
              max={4096}
              value={maxSize}
              onChange={handleMaxSizeChange}
            />
          </Stack>
          {originalFile && (
            <Stack direction="row" gap={2}>
              <Stack gap={2}>
                <Typography level="h2">Original</Typography>
                <Typography>
                  {`Size: ${formatFileSize(originalFile.size)} (${originalFile.size} bytes)`}
                </Typography>
                {originalFileUrl && (
                  <StyledImage src={originalFileUrl} alt="Original" />
                )}
              </Stack>
              <Stack gap={2}>
                <Typography level="h2">Compressed</Typography>
                {isFetching && <Typography>Compressing...</Typography>}
                {compressedFile && (
                  <Typography>
                    {`Size: ${formatFileSize(compressedFile.size)} (${compressedFile.size} bytes)`}
                  </Typography>
                )}
                {compressedFileUrl && (
                  <StyledImage src={compressedFileUrl} alt="Compressed" />
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function getQueryKey(
  originalFile: File | null,
  quality: number | undefined,
  maxSize: number | undefined,
) {
  return [
    "playground",
    "compressedFile",
    {
      originalFile,
      quality,
      maxSize,
    },
  ];
}

function useObjectUrl(file: File | null | undefined) {
  const [objUrl, setObjUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      return;
    }

    const res = URL.createObjectURL(file);
    setObjUrl(res);

    return () => {
      URL.revokeObjectURL(res);
    };
  }, [file]);

  return objUrl;
}
