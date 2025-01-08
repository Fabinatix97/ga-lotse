/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.TableColumn;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CellEntryRepository extends JpaRepository<CellEntry, Long> {

  @Query(
      """
    select min(ce.bigDecimalValue) from DecimalEntry ce
    where ce.tableColumn = :tableColumn
    and ce.bigDecimalValue is not null
    and (:unknownValue is null or ce.bigDecimalValue != :unknownValue)
    """)
  BigDecimal findDecimalValueMin(
      @Param("tableColumn") TableColumn tableColumn,
      @Param("unknownValue") BigDecimal unknownValue);

  @Query(
      """
    select max(ce.bigDecimalValue) from DecimalEntry ce
    where ce.tableColumn = :tableColumn
    and ce.bigDecimalValue is not null
    and (:unknownValue is null or ce.bigDecimalValue != :unknownValue)
    """)
  BigDecimal findDecimalValueMax(
      @Param("tableColumn") TableColumn tableColumn,
      @Param("unknownValue") BigDecimal unknownValue);

  @Query(
      """
    select min(ce.integerValue) from IntegerEntry ce
    where ce.tableColumn = :tableColumn
    and ce.integerValue is not null
    and (:unknownValue is null or ce.integerValue != :unknownValue)
    """)
  Integer findIntegerValueMin(
      @Param("tableColumn") TableColumn tableColumn, @Param("unknownValue") Integer unknownValue);

  @Query(
      """
    select max(ce.integerValue) from IntegerEntry ce
    where ce.tableColumn = :tableColumn
    and ce.integerValue is not null
    and (:unknownValue is null or ce.integerValue != :unknownValue)
    """)
  Integer findIntegerValueMax(
      @Param("tableColumn") TableColumn tableColumn, @Param("unknownValue") Integer unknownValue);
}
