/** Station tablet shared login — email local part `station` or `station.*` */
export function isStationAccountEmail(email: string): boolean {
  const local = email.split('@')[0]?.toLowerCase() ?? '';
  return local === 'station' || local.startsWith('station.');
}
