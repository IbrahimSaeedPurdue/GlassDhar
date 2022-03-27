import React from 'react';
import { ErrorMessage } from '@hookform/error-message';

const Input = (props) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {props.label
      ? (
        <label htmlFor={props.name}>
          {props.label}
          {props.required ? <span>*</span> : null}
        </label>
        )
      : null}
    {props.type === 'textarea'
      ? <textarea
          defaultValue={props.defaultValue ? props.defaultValue : ''}
          {...props.register(props.name)}
          name={props.name}
          type={props.type ? props.type : 'text'}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          onChange={(event) =>
            props.onChangeText ? props.onChangeText(event.target.value) : ''}
        />
      : <input
          defaultValue={props.defaultValue ? props.defaultValue : ''}
          {...props.register(props.name)}
          name={props.name}
          type={props.type ? props.type : 'text'}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          onChange={(event) =>
            props.onChangeText ? props.onChangeText(event.target.value) : ''}
        />}

    {props.errors
      ? (
        <p>
          <ErrorMessage errors={props.errors} name={props.name} />
        </p>
        )
      : null}
  </div>
);

export default Input;
