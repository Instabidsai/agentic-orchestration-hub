import { createJSONBlob } from './export';
import { describe, it, expect } from 'vitest';

describe('createJSONBlob', () => {
  it('creates a JSON blob with pretty string', async () => {
    const data = { foo: 'bar' };
    const blob = createJSONBlob(data);
    expect(blob.type).toBe('application/json');
    const text = await blob.text();
    expect(text).toBe(JSON.stringify(data, null, 2));
  });
});
