<#import "../common/forms.ftlh" as forms />

<#macro content physiciansRecommendation>
<#-- @ftlvariable name="physiciansRecommendation" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterPhysiciansRecommendationDto" -->
  <@forms.checkbox checked=physiciansRecommendation.concernsCanChild title="Prüfung einer Zurückstellung durch Schulleitung / Bedenken Kann-Kind" />
  <@forms.checkbox checked=physiciansRecommendation.specialPromotion title="Besondere schulische Förderung / Entwicklungsbeobachtung / Einleitung vorbeugender Maßnahmen" />
  <@forms.checkbox checked=physiciansRecommendation.introductionInBFZ title="Vorstellung in BFZ" />
  <@forms.checkbox checked=physiciansRecommendation.promotionOutsideSchool title="Außerschulische Förderung" />
  <@forms.checkbox checked=physiciansRecommendation.furtherMeasures title="Weitere Maßnahmen" />
  <@forms.checkbox checked=physiciansRecommendation.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended title="Besprechung Kinder- und Jugendgesundheitsdienst mit Schulleitung" />
</#macro>
