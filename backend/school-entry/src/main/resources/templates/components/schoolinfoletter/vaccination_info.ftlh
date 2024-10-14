<#import "../common/forms.ftlh" as forms />

<#macro content vaccinationInfo >
<#-- @ftlvariable name="vaccinationInfo" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterVaccinationInfo" -->
  <table style="width: 100%;">
    <colgroup>
      <col style="width: 34%" />
      <col style="width: 15%" />
      <col style="width: 51%" />
    </colgroup>
    <tr>
      <td colspan="3">
        <@forms.checkbox checked=vaccinationInfo.measlesProtectionComplete title="Masernschutz vollständig"/>
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=!vaccinationInfo.measlesProtectionComplete title="Masernschutz unvollständig"/>
      </td>
      <td colspan="2">
        <@forms.checkbox checked=vaccinationInfo.measlesContraIndication title="Medizinische Kontraindikation gegen Masernimpfung besteht:"/>
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=vaccinationInfo.vaccinationPassNotPresented title="Impfbuch nicht vorgelegt"/>
      </td>
      <td>
        <@forms.checkbox checked=vaccinationInfo.measlesContraIndicationPermanent title="ständig"/>
      </td>
      <td>
        <@forms.checkbox checked=(vaccinationInfo.measlesContraIndicationUntil??) title="bis zum: " + (vaccinationInfo.measlesContraIndicationUntil ! "_______________________________________")/>
      </td>
    </tr>
  </table>
</#macro>
