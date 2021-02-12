import React, { forwardRef } from 'react';
import cx from 'clsx';
import PawIcon from '../Icons/jsx/PawIcon';

const Button = forwardRef((props, ref) => {
  const {
    children,
    className,
    type = 'button',
    color = 'primary',
    component = 'button',
    size,
    wide,
    disabled,
    loading,
    outline,
    iconLeft,
    iconRight,
    asLink,
    icon,
    ...other
  } = props;

  const classNames = cx(className, 'button', `-${color}`, {
    '-wide': wide,
    '-medium': size === 'medium',
    '-small': size === 'small',
    '-loading': loading,
    '-outline': outline,
    '-asLink': asLink,
    '-icon': icon,
  });

  const componentProps = {};

  let Component = component;

  if (Component === 'button' && other.href) {
    Component = 'a';
  }

  if (Component === 'button') {
    componentProps.type = type;
    componentProps.disabled = disabled || loading;
  } else if (Component !== 'a' || !other.href) {
    componentProps.role = 'button';
  }

  return (
    <Component className={classNames} {...componentProps} {...other} ref={ref}>
      {iconLeft && <span className="button-icon -left">{iconLeft}</span>}
      {loading && <PawIcon className="button-loader" />}
      <span className="button-content">{children}</span>
      {iconRight && <span className="button-icon -right">{iconRight}</span>}
    </Component>
  );
});

export default Button;
