import React, { ElementType, forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import cx from 'clsx';
import Hint from '../Hint/Hint';
import { Error } from '../types';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  scale?: 'medium' | 'small' | 'big';
  error?: Error;
  action?: ReactNode;
  multiline?: boolean;
  label?: string | ReactNode;
  rows?: number;
  requiredHint?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    type = 'text',
    multiline = false,
    error,
    scale,
    style,
    action,
    label,
    className,
    requiredHint,
    ...other
  } = props;

  const classNames = cx('input', {
    '-error': Boolean(error),
    '-medium': scale === 'medium',
    '-small': scale === 'small',
    '-big': scale === 'big',
  });

  const componentProps: any = {
    className: cx(action && '-with-action', className),
  };

  const showHintError = error && typeof error !== 'boolean';
  const Component = multiline ? 'textarea' : 'input' as ElementType;

  if (Component === 'input') {
    componentProps.type = type;
  }

  return (
    <label className={classNames} style={style}>
      {label && <span className="input-label h6">{label}{`${requiredHint ? ' *' : ''}`}</span>}
      <span className="input-field">
        <Component
          {...componentProps}
          {...other}
          aria-label={label && other.placeholder}
          ref={ref}
        />
        {action && <span className="input-action">{action}</span>}
      </span>
      {showHintError && <Hint error style={{ marginTop: 6 }}>{error}</Hint>}
    </label>
  );
});

export default Input;
