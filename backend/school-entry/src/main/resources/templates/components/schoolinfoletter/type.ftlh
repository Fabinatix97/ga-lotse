<#import "../common/forms.ftlh" as forms>
<#macro content type="NUL">
<#-- @ftlvariable name="type" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterExaminationType" -->
  <table style="width: 70%; margin: 1mm 0 1mm 0;">
    <colgroup>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=type?isHash && type.examinationType.name() == "REGULAR_EXAMINATION" title="Regelkind"/>
      </td>
      <td>
        <@forms.checkbox checked=type?isHash && type.examinationType.name() == "CAN_CHILD" title="Kann-Kind"/>
      </td>
      <td>
        <@forms.checkbox checked=type?isHash && type.examinationType.name() == "ENTRY_LEVEL" title="Eingangsstufe"/>
      </td>
      <td>
        <@forms.checkbox checked=type?isHash && type.postponed title="Zurückgestellt"/>
      </td>
    </tr>
  </table>
</#macro>
