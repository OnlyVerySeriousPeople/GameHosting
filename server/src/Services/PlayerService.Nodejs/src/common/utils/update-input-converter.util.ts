import { UpdatePlayerRequest } from '@proto/types';

export const simplifyFieldMaskInUpdateInput = (
  updateInput: UpdatePlayerRequest,
): UpdatePlayerRequest => {
  const input = { ...updateInput };
  if (
    input.updateMask &&
    'paths' in input.updateMask &&
    Array.isArray(input.updateMask.paths)
  ) {
    input.updateMask = input.updateMask.paths;
  }
  return input;
};
