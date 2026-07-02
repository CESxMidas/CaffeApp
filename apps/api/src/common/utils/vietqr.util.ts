/**
 * VietQR Utility
 * Generates VietQR image URLs for bank transfer payments
 * Reference: https://vietqr.io/
 */

export interface VietQRParams {
  bankCode: string; // e.g., 'MSB', 'VCB', 'TCB'
  accountNo: string; // Account number
  accountName: string; // Account holder name
  amount?: number; // Payment amount (optional)
  addInfo?: string; // Additional info/order reference (optional)
  template?: 'compact' | 'full' | 'thumbnail'; // QR template
}

/**
 * Generate VietQR image URL
 * @param params - VietQR parameters
 * @returns Full URL to VietQR image
 */
export function generateVietQRUrl(params: VietQRParams): string {
  const { bankCode, accountNo, accountName, amount, addInfo, template = 'compact' } = params;

  let url = `https://img.vietqr.io/image/${bankCode}-${accountNo}-${template}.png`;
  const queryParams: string[] = [];

  if (amount !== undefined && amount > 0) {
    queryParams.push(`amount=${amount}`);
  }
  if (addInfo) {
    queryParams.push(`addInfo=${encodeURIComponent(addInfo)}`);
  }
  if (accountName) {
    queryParams.push(`accountName=${encodeURIComponent(accountName)}`);
  }

  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&');
  }

  return url;
}

/**
 * Generate VietQR data for payment
 * @param params - VietQR parameters
 * @returns Object with QR URL and payment info
 */
export function generateVietQRData(params: VietQRParams): {
  qrUrl: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  amount?: number;
  addInfo?: string;
} {
  return {
    qrUrl: generateVietQRUrl(params),
    bankCode: params.bankCode,
    accountNo: params.accountNo,
    accountName: params.accountName,
    amount: params.amount,
    addInfo: params.addInfo,
  };
}
