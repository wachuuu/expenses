import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {

  constructor(private papa: Papa) {}

  parseCsv(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          // Detect encoding and convert to UTF-8
          const text = await this.convertToUtf8(reader.result as ArrayBuffer);
          this.papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error),
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);

      // Read file as ArrayBuffer for proper encoding handling
      reader.readAsArrayBuffer(file);
    });
  }

  private async convertToUtf8(buffer: ArrayBuffer): Promise<string> {
    const encoding = await this.detectEncoding(buffer);
    const decoder = new TextDecoder(encoding, { fatal: false });
    return decoder.decode(buffer);
  }

  private async detectEncoding(buffer: ArrayBuffer): Promise<string> {
    // Simple detection based on common encodings
    const possibleEncodings = ['utf-8', 'windows-1250', 'iso-8859-1'];
    for (const encoding of possibleEncodings) {
      try {
        const decoder = new TextDecoder(encoding, { fatal: true });
        decoder.decode(buffer); // If no error, encoding is valid
        return encoding;
      } catch {
        continue; // Try next encoding
      }
    }
    return 'utf-8'; // Default fallback
  }
}
