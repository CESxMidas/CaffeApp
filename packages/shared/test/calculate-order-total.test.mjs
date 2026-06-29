import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateOrderTotal, VAT_RATE } from '../dist/constants/index.js';

describe('calculateOrderTotal (VAT-inclusive prices)', () => {
  it('total equals gross subtotal — does not add VAT on top', () => {
    const { subtotal, total, tax_amount, pretax_subtotal } = calculateOrderTotal(35_000);
    assert.equal(subtotal, 35_000);
    assert.equal(total, 35_000);
    assert.equal(tax_amount, Math.round((35_000 * VAT_RATE) / (1 + VAT_RATE)));
    assert.equal(pretax_subtotal + tax_amount, total);
  });

  it('matches API formula round(total * 8/108) for pilot price points', () => {
    const cases = [
      { gross: 19_000, tax: 1_407 },
      { gross: 35_000, tax: 2_593 },
      { gross: 48_000, tax: 3_556 },
      { gross: 69_000, tax: 5_111 },
    ];

    for (const { gross, tax } of cases) {
      const result = calculateOrderTotal(gross);
      assert.equal(result.tax_amount, tax, `tax for ${gross}`);
      assert.equal(result.total, gross);
      assert.equal(result.pretax_subtotal, gross - tax);
    }
  });
});
