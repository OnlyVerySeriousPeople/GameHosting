import * as proto from '../../gen_proto';
import {GameSchema} from '../../db';
import {create} from '@bufbuild/protobuf';
import {timestampFromDate} from '@bufbuild/protobuf/wkt';

export const toGameDto = ({
  id,
  authorId,
  uploadedAt,
  totalPlaysCount,
  name,
  description,
  categories,
  iconUrl,
}: GameSchema): proto.Game => {
  return create(proto.GameSchema, {
    id,
    authorId,
    uploadedAt: timestampFromDate(uploadedAt),
    totalPlaysCount,
    metadata: create(proto.GameMetadataSchema, {
      name,
      description: description || undefined,
      categories: categories || undefined,
      iconUrl: iconUrl || undefined,
    }),
  });
};
