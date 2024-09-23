<#import "../common/forms.ftlh" as forms />

<#macro content hearingExaminationInfo >
<#-- @ftlvariable name="hearingExaminationInfo" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterHearingExaminationInfo" -->
  <table style="width: 100%;">
    <colgroup>
      <col style="width: 17%" />
      <col style="width: 17%" />
      <col style="width: 33%" />
      <col style="width: 33%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=!hearingExaminationInfo.conspicuous title="Nein"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo.conspicuous title="Ja"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo.clarificationArranged title="Abklärung veranlasst"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo.underTreatment title="in Kontrolle / Behandlung"/>
      </td>
    </tr>
  </table>
</#macro>
