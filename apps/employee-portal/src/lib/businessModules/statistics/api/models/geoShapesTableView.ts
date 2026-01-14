/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGeoShapeSortKey,
  ApiGetGeoShapesResponse,
} from "@eshg/statistics-api";

export const GeoShapeStatus = {
  Active: "ACTIVE",
  Archived: "ARCHIVED",
} as const;
export type GeoShapeStatus =
  (typeof GeoShapeStatus)[keyof typeof GeoShapeStatus];

export interface GeoShapeInfo {
  createdAt: Date;
  id: string;
  status: GeoShapeStatus;
  title: string;
}

interface GeoShapesTableView {
  totalNumberOfElements: number;
  geoShapes: GeoShapeInfo[];
}

export function mapGetGeoShapesResponseToTableView(
  getGeoShapesResponse: ApiGetGeoShapesResponse,
): GeoShapesTableView {
  return {
    totalNumberOfElements: getGeoShapesResponse.totalNumberOfElements,
    geoShapes: getGeoShapesResponse.geoShapeMetaInfos.map(
      (apiGeoShapeMetaInfo) => {
        return {
          createdAt: apiGeoShapeMetaInfo.createdAt,
          id: apiGeoShapeMetaInfo.id,
          status: apiGeoShapeMetaInfo.status,
          title: apiGeoShapeMetaInfo.title,
        };
      },
    ),
  };
}

export function mapSortKey(sortKey: string | undefined) {
  switch (sortKey) {
    case "title":
      return ApiGeoShapeSortKey.Title;
    case "createdAt":
      return ApiGeoShapeSortKey.CreatedAt;
    default:
      return undefined;
  }
}
