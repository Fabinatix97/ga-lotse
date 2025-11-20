/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis;

import de.eshg.inspection.teis.persistence.TeisEntity;
import de.eshg.inspection.teis.persistence.TeisEuParameter;
import de.eshg.inspection.teis.persistence.TeisGesundheitsamt;
import de.eshg.inspection.teis.persistence.TeisListe;
import de.eshg.inspection.teis.persistence.TeisMesswerttext;
import de.eshg.inspection.teis.persistence.TeisParameter;
import de.eshg.inspection.teis.persistence.TeisProbenahmehaeufigkeit;
import de.eshg.inspection.teis.persistence.TeisUmrechnung;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameter;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsumfang;
import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung1;
import de.eshg.inspection.teis.persistence.interfaces.HasBezeichnung2;
import de.eshg.inspection.teis.persistence.interfaces.HasCasnummer;
import de.eshg.inspection.teis.persistence.interfaces.HasEinheit;
import de.eshg.inspection.teis.persistence.interfaces.HasFilterkuerzel;
import de.eshg.inspection.teis.persistence.interfaces.HasKurzbezeichnung;
import de.eshg.inspection.teis.persistence.interfaces.HasParameter;
import de.eshg.inspection.teis.persistence.interfaces.HasParameterart;
import de.eshg.inspection.teis.persistence.interfaces.HasStichwort;
import de.eshg.inspection.teis.persistence.interfaces.HasWert;
import java.util.function.BiConsumer;
import org.apache.commons.lang3.function.TriConsumer;

public enum TeisAttribute {
  ZID(TeisEntity.class, TeisEntity::setZid),
  AKTIV(
      TeisEntity.class,
      (entity, value) -> {
        if ("0".equals(value)) {
          entity.setAktiv(true);
        } else if ("1".equals(value)) {
          entity.setAktiv(true);
        } else {
          throw new RuntimeException("Unexpected value for AKTIV: " + value);
        }
      }),
  FILTERKUERZEL(HasFilterkuerzel.class, HasFilterkuerzel::setFilterkuerzel),
  KURZBEZEICHNUNG(HasKurzbezeichnung.class, HasKurzbezeichnung::setKurzbezeichnung),
  BEZEICHNUNG(HasBezeichnung.class, HasBezeichnung::setBezeichnung),
  BEZEICHNUNG1(HasBezeichnung1.class, HasBezeichnung1::setBezeichnung1),
  BEZEICHNUNG2(HasBezeichnung2.class, HasBezeichnung2::setBezeichnung2),
  STICHWORT(HasStichwort.class, HasStichwort::setStichwort),
  WERT(
      HasWert.class,
      (entity, value) -> {
        if (entity instanceof TeisMesswerttext messwerttext) {
          messwerttext.setWert(Integer.parseInt(value));
        } else if (entity instanceof TeisUmrechnung umrechnung) {
          umrechnung.setWert(Double.parseDouble(value.replace(",", ".")));
        } else {
          throw new RuntimeException("Unexpected class for WERT: " + entity.getClass().getName());
        }
      }),
  EINHEITVON(
      TeisUmrechnung.class,
      (entity, value, repositories) ->
          entity.setEinheitVon(
              repositories
                  .teisEinheitRepository()
                  .findTeisEinheitByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  EINHEITNACH(
      TeisUmrechnung.class,
      (entity, value, repositories) ->
          entity.setEinheitNach(
              repositories
                  .teisEinheitRepository()
                  .findTeisEinheitByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  STRASSE(TeisGesundheitsamt.class, TeisGesundheitsamt::setStrasse),
  PLZ(TeisGesundheitsamt.class, TeisGesundheitsamt::setPlz),
  ORT(TeisGesundheitsamt.class, TeisGesundheitsamt::setOrt),
  LISTE(TeisListe.class, TeisListe::setListe),
  NUMMER(TeisListe.class, (entity, value) -> entity.setNummer(Integer.parseInt(value))),
  EINHEIT(
      HasEinheit.class,
      (entity, value, repositories) ->
          entity.setEinheit(
              repositories
                  .teisEinheitRepository()
                  .findTeisEinheitByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  HISTKURZBEZEICHNUNG(TeisParameter.class, TeisParameter::setHistkurzbezeichnung),
  HYGRISNUMMER(TeisParameter.class, TeisParameter::setHygrisnummer),
  CASNUMMER(HasCasnummer.class, HasCasnummer::setCasnummer),
  SYNONYM1(TeisParameter.class, TeisParameter::setSynonym1),
  SYNONYM2(TeisParameter.class, TeisParameter::setSynonym2),
  SYNONYM3(TeisParameter.class, TeisParameter::setSynonym3),
  SYNONYM4(TeisParameter.class, TeisParameter::setSynonym4),
  SYNONYM5(TeisParameter.class, TeisParameter::setSynonym5),
  PZSUMME(TeisParameter.class, (entity, value) -> entity.setPzsumme(Integer.parseInt(value))),
  WASSERVOLUMENMIN(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setWasserVolumenMin(Integer.parseInt(value))),
  WASSERVOLUMENMAX(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setWasserVolumenMax(Integer.parseInt(value))),
  OPERATORMIN(TeisProbenahmehaeufigkeit.class, TeisProbenahmehaeufigkeit::setOperatorMin),
  OPERATORMAX(TeisProbenahmehaeufigkeit.class, TeisProbenahmehaeufigkeit::setOperatorMax),
  FIXANZAHL(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setFixanzahl(Integer.parseInt(value))),
  FIXBASIS(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setFixbasis(Integer.parseInt(value))),
  VARANZAHL(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setVaranzahl(Integer.parseInt(value))),
  VARBASIS(
      TeisProbenahmehaeufigkeit.class,
      (entity, value) -> entity.setVarbasis(Integer.parseInt(value))),
  VERORDNUNG(
      TeisProbenahmehaeufigkeit.class,
      (entity, value, repositories) ->
          entity.setVerordnung(
              repositories
                  .teisListeRepository()
                  .findTeisListeByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  PARAMETERART(
      HasParameterart.class,
      (entity, value, repositories) ->
          entity.setParameterart(
              repositories
                  .teisListeRepository()
                  .findTeisListeByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  NOTIZ(TeisUntersuchungsumfang.class, TeisUntersuchungsumfang::setNotiz),
  PARAMETER(
      HasParameter.class,
      (entity, value, repositories) ->
          entity.setParameter(
              repositories
                  .teisParameterRepository()
                  .findTeisParameterByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  UNTERSUCHUNGSUMFANG(
      TeisUntersuchungsparameter.class,
      (entity, value, repositories) ->
          entity.setUntersuchungsumfang(
              repositories
                  .teisUntersuchungsumfangRepository()
                  .findTeisUntersuchungsumfangByZid(value)
                  .orElseThrow(() -> getZidNotFoundErrorException(value)))),
  POSITION(
      TeisUntersuchungsparameter.class,
      (entity, value) -> entity.setPosition(Integer.parseInt(value))),
  OBGRENZWERT(
      TeisUntersuchungsparameter.class,
      (entity, value) -> entity.setObgrenzwert(Double.parseDouble(value.replace(",", ".")))),
  UNTGRENZWERT(
      TeisUntersuchungsparameter.class,
      (entity, value) -> entity.setUntgrenzwert(Double.parseDouble(value.replace(",", ".")))),
  GRENZWERTTEXT(TeisUntersuchungsparameter.class, TeisUntersuchungsparameter::setGrenzwertText),
  PRUEFUNG(TeisEuParameter.class, (entity, value) -> entity.setPruefung(Integer.parseInt(value))),
  ;

  private final TriConsumer<TeisEntity, String, TeisRepositories> setter;

  <T> TeisAttribute(Class<T> requiredClass, BiConsumer<T, String> setter) {
    this.setter =
        (entity, value, repositories) -> {
          if (requiredClass.isInstance(entity)) {
            @SuppressWarnings("unchecked")
            T entityT = (T) entity;
            setter.accept(entityT, value);
          } else {
            throw new RuntimeException(getUnexpectedClassErrorMessage(requiredClass, entity));
          }
        };
  }

  <T> TeisAttribute(Class<T> requiredClass, TriConsumer<T, String, TeisRepositories> setter) {
    this.setter =
        (entity, value, repositories) -> {
          if (requiredClass.isInstance(entity)) {
            @SuppressWarnings("unchecked")
            T entityT = (T) entity;
            setter.accept(entityT, value, repositories);
          } else {
            throw new RuntimeException(getUnexpectedClassErrorMessage(requiredClass, entity));
          }
        };
  }

  void apply(TeisEntity entity, String value, TeisRepositories repositories) {
    this.setter.accept(entity, value, repositories);
  }

  private String getUnexpectedClassErrorMessage(Class<?> requiredClass, Object entity) {
    return "For "
        + this.name()
        + ", expected entity to be of type "
        + requiredClass.getSimpleName()
        + " but it is "
        + entity.getClass().getSimpleName();
  }

  private static String getZidNotFoundErrorMessage(String zid) {
    return "ZID not found: " + zid;
  }

  private static RuntimeException getZidNotFoundErrorException(String zid) {
    return new RuntimeException(getZidNotFoundErrorMessage(zid));
  }
}
