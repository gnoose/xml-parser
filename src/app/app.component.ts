import { Component } from '@angular/core';
import * as parser from 'fast-xml-parser';
import * as he from 'he';
import { TranslatorService } from './services/translator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoading = false;
  title = 'xml-parser';
  options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val: any, attrName: any) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val: any, tagName: any) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
  };

  files: File[] = [];
  jsonObj: any;
  format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  constructor(
    private translatorService: TranslatorService
  ) {
  }

  fileChanged(e: any) {
    this.files = e.target.files;
  }

  uploadDocument(): void {
    for (let index = 0; index < this.files.length; index ++) {
      const file = this.files[index];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log(fileReader.result);
      }
      fileReader.readAsText(file);
      setTimeout(async () => {
        this.isLoading = true;
        const contentStr = fileReader.result as string;
        this.jsonObj = parser.parse(contentStr, this.options);
        this.jsonObj = await this.fixup(this.jsonObj, 'Value', 'XXXXXXXXX');
        this.downloadString(JSON.stringify(this.jsonObj), 'text/xml', file.name);
        this.isLoading = false;
      }, 300);
    }
  }

  downloadString(text: any, fileType: string, fileName: string) {
    let blob = new Blob([text], { type: fileType });
    let a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }

  async fixup(obj: any, tKey: any, value: any) {
    for(let key in obj) {
      if(key === tKey) {
        if (!this.format.test(obj[key]) && obj[key]) {
          const res = await this.translatorService.translate(obj[key]).toPromise();
          obj[key] = res.text;
          console.log('res = ', res.text);
        }
      } else if (typeof obj[key] === 'object') {
        obj[key] = await this.fixup(obj[key], tKey, value);
      }
    }
    return obj;
  }
}
