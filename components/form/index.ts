import * as mobx from 'mobx';

export { default as Input } from './Input';
export { default as Textarea } from './Textarea';
export { default as Form } from './Form';


export const newField = (value: string, constraints: Function[], isValid: boolean) => {
  return mobx.observable({value: value, constraints: constraints, isValid: isValid})
}