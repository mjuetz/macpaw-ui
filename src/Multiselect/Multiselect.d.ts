import {FC, HTMLProps} from 'react';

interface Props extends HTMLProps<HTMLElement> {
  placeholder?: string;
}

declare const Multiselect: FC<Props>;

export default Multiselect;