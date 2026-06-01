declare module "pdfjs-dist/web/pdf_viewer.mjs" {
  export class TextLayerBuilder {
    div: HTMLDivElement;
    constructor(options: { pdfPage: any });
    render(viewport: any): Promise<void>;
  }
}
