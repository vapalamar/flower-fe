import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

function cutText(text: string, length: number): string {
  const sliced = text.slice(0, length);
  let result = sliced.slice(0, sliced.lastIndexOf(' '));
  if (/[^a-z]/.test(result.slice(-1))) {
    result = result.slice(0, -1);
  }
  return result + ' ...';
}

@Component({
  selector: 'fl-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss'],
})
export class SeeMoreComponent implements OnInit {
  @Input('dataIn') dataIn: string;
  @Input('textBtn') textBtn: string;
  @Input('classForBtn') classForBtn: string;
  @Input('lengthText') lengthText: number;
  @Input('includeHtml') includeHtml: boolean;
  @Input() cutOnly = false;
  @Input('id') id = '';

  modBtn = true;
  showBtn: boolean;
  showText: string | SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.includeHtml) {
      const dataIn = this.dataIn ? this.dataIn.replace(/(<([^>]+)>)/ig, '') : null;
      this.showBtn = dataIn && dataIn.length > this.lengthText;
      this.showText = this.sanitizeMarkup(this.dataIn, !this.showBtn, this.lengthText);
    } else {
      this.showBtn = this.dataIn && this.dataIn.length > this.lengthText;
      this.showText = this.showBtn ? cutText(this.dataIn, this.lengthText) : this.dataIn;
    }

    if (this.cutOnly) {
      this.showBtn = false;
    }
  }

  turnDescription() {
    if (this.showBtn) {
      if (this.includeHtml) {
        this.showText = this.sanitizeMarkup(this.dataIn, this.modBtn, this.lengthText);
      } else {
        this.showText = this.modBtn ? this.dataIn : cutText(this.dataIn, this.lengthText);
      }

      this.modBtn = !this.modBtn;
    }
  }

  private sanitizeMarkup(markup: string, slice: boolean, maxLength: number): SafeHtml {
    if (!markup) {
      return '';
    }

    const htmlTagRegex = /\s*(<[^>]*>)/;
    const formatHtmlArr = markup.split(htmlTagRegex).filter(item => item);

    if (slice) {
      return this.sanitizer.bypassSecurityTrustHtml(formatHtmlArr.join(''));
    }

    let accLength = 0;
    let concat = true;

    const slicedMarkupArr = formatHtmlArr.map(item => {
      if (!htmlTagRegex.test(item)) {
        accLength += item.length;
        if (accLength > maxLength) {
          if (concat) {
            concat = false;
            return cutText(item.slice(0, 0 - (accLength - maxLength)), maxLength);
          }

          return '';
        }

        return ' ' + item;
      }

      return item;
    });

    markup = slicedMarkupArr.join('').replace(/<br>/gi, '<br/>');
    let markupLength = 0;
    while (markupLength !== markup.length) {
      markupLength = markup.length;
      markup = markup.replace(/<[^\/>]*><\/[^>]+>/gi, '');
    }
    return this.sanitizer.bypassSecurityTrustHtml(markup);
  }
}
