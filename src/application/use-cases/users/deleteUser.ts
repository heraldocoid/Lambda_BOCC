export default async function deleteUser(repository: any, id: string) {
  if (!id || typeof id !== 'string') {
    const e: any = new Error('`id` is required');
    e.type = 'VALIDATION';
    throw e;
  }
  const ok = await repository.delete(id);
  if (!ok) {
    const e: any = new Error('User not found');
    e.type = 'NOT_FOUND';
    throw e;
  }
  return { deleted: true };
}
