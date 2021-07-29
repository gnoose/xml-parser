import { Component } from '@angular/core';

import { TranslatorService } from '../core/services/translator.service';

@Component({
  selector: 'app-xml-parser',
  templateUrl: './xml-parser.component.html',
  styleUrls: ['./xml-parser.component.scss']
})
export class XmlParserComponent {

  isLoading = false;
  files: File[] = [];
  // format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  format = /[`*+=\[\]{}|]/;
  replaceList = ['&lt;ul&gt;', '&lt;li&gt;', '&lt;/li&gt;', '&lt;/ul&gt;', '&lt;br&gt;', '<ul>', '<li>', '</li>', '</ul>', '<br>'];

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
      fileReader.onload = () => {
        console.log(fileReader.result);
      }
      fileReader.readAsText(file);
      setTimeout(async () => {
        this.isLoading = true;
        const contentStr = fileReader.result as string;
        const parser = new DOMParser();
        let dom = parser.parseFromString(contentStr, "application/xml");
        await this.replaceUp(dom.documentElement, 'Value', 'XXXX');
        const xmlStr = new XMLSerializer().serializeToString(dom);
        this.downloadString(xmlStr,  'text/xml', file.name);
        this.isLoading = false;
      }, 300);
    }
  }

  async replaceUp(xmlDoc: any, tKey: any, value: any): Promise<any> {
    let node, childNodes = xmlDoc.childNodes;
    for(let i = 0; i < childNodes.length; i++)
    {
      node = childNodes[i];
      if (!node.childElementCount) {
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === tKey) {
          if (!this.format.test(node.textContent) && node.textContent && !node.textContent.toLowerCase().includes('.val')) {
            let str = node.textContent;
            for(let replaceIndex = 0; replaceIndex < this.replaceList.length; replaceIndex ++) {
              str = str.replace(this.replaceList[replaceIndex], '');
            }
            const res = await this.translatorService.translate(str).toPromise();
            node.textContent = res.text;
          }
        }
      } else {
        node = await this.replaceUp(node, tKey, value);
      }
    }
    return node;
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

}
