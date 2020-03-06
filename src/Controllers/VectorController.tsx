/**
 * @File   : VectorController.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 3/6/2020, 2:17:34 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {h, Fragment} from 'preact';

import Text from '../UI/components/Text';
import {TController} from '../types';

type TVectorValue = Sein.Vector2 | Sein.Vector3 | Sein.Vector4;

function RenderOne(value: TVectorValue, key: string, readonly: boolean, onChange: (value: TVectorValue) => void) {
  return (
    <Text
      prefix={key}
      value={value[key]}
      onChange={(_, v) => {
        value[key] = v;
        onChange(value);
      }}
      disabled={readonly}
    />
  );
}

const VectorController: TController<TVectorValue> = (
  name: string,
  value: TVectorValue,
  readonly: boolean,
  options: any,
  object: Sein.SObject,
  onChange: (value: TVectorValue) => void
) => {
  return (
    <div>
      <div>{name}</div>
      {
        Sein.isVector2(value) && (
          <Fragment>
            {RenderOne(value, 'x', readonly, onChange)}
            {RenderOne(value, 'y', readonly, onChange)}
          </Fragment>
        )
      }
      {
        Sein.isVector3(value) && (
          <Fragment>
            {RenderOne(value, 'x', readonly, onChange)}
            {RenderOne(value, 'y', readonly, onChange)}
            {RenderOne(value, 'z', readonly, onChange)}
          </Fragment>
        )
      }
      {
        Sein.isVector4(value) && (
          <Fragment>
            {RenderOne(value, 'x', readonly, onChange)}
            {RenderOne(value, 'y', readonly, onChange)}
            {RenderOne(value, 'z', readonly, onChange)}
            {RenderOne(value, 'w', readonly, onChange)}
          </Fragment>
        )
      }
    </div>
  )
}

export default VectorController;
