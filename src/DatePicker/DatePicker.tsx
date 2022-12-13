/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  KeyboardEventHandler,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import cx from 'clsx';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import Input from '../Input/Input';
import { Error as InputError } from '../types';

const BOTTOM_OFFSET = 320;

type PossibleDateType = Date | Date[] | DateRange | undefined;

interface NavigationSelectableProps {
  captionLayout: 'dropdown' | 'buttons';
}

interface NavigationDisabledProps {
  disableNavigation: boolean;
}

type NavigationProps = NavigationSelectableProps | NavigationDisabledProps;

interface DatePickerCommonProps {
  value?: PossibleDateType;
  error?: InputError;
  className?: string;
  calendarClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  scale?: 'medium' | 'small' | 'big';
  openSite?: 'top' | 'bottom' | 'center' | 'auto';
  closeOnSelect?: boolean;
  dateFormat?: string;
  defaultMonth?: Date;
  fromYear?: number;
  toYear?: number;
  fromDate?: Date;
  toDate?: Date;
  navigation?: 'pagination' | 'dropdown' | 'disabled';
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

interface DatePickerRangeSingleProps extends DatePickerCommonProps {
  selectionMode: 'single';
  onChange?: (date: Date) => void;
  formatter?: (date: Date) => string;
}

interface DatePickerRangeMultipleProps extends DatePickerCommonProps {
  selectionMode: 'multiple';
  onChange?: (date: Date[] | undefined) => void;
  formatter?: (date: Date[]) => string;
}

interface DatePickerRangeRangeProps extends DatePickerCommonProps {
  selectionMode:  'range';
  onChange?: (date: DateRange | undefined) => void;
  formatter?: (date: DateRange[]) => string;
}

type DatePickerProps = DatePickerRangeSingleProps | DatePickerRangeMultipleProps | DatePickerRangeRangeProps

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = '',
  value: initialValue,
  error: externalError,
  disabled,
  scale,
  className,
  calendarClassName,
  closeOnSelect = true,
  openSite = 'auto',
  dateFormat = 'P',
  formatter,
  defaultMonth,
  fromYear,
  toYear,
  fromDate,
  toDate,
  selectionMode = 'single',
  navigation,
  onChange,
  onKeyDown,
}) => {
  const [value, setValue] = useState<PossibleDateType>(initialValue);
  const [isOpenOnTop, setIsOpenOnTop] = useState(openSite === 'top');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const errorMessage = error || externalError;

  const wrapperClassNames = cx('date-picker', className);
  const calendarClassNames = cx('calendar', calendarClassName, {
    'site-top': isOpenOnTop && openSite !== 'center',
    'site-bottom': !isOpenOnTop && openSite !== 'center',
    'site-center': openSite === 'center',
  });

  const navigationProps: NavigationProps | null = useMemo(() => {
    switch (navigation) {
      case 'disabled':
        return { disableNavigation: true };
      case 'dropdown':
        return { captionLayout: 'dropdown' };
      case 'pagination':
        return { captionLayout: 'buttons' };
      default:
        return null;
    }
  }, [navigation]);

  const formattedValue = useMemo(() => {
    if (!value) return '';

    if (formatter) return formatter(value as any);

    try {
      if (value instanceof Date) return format(value, dateFormat);
      if (Array.isArray(value)) return value.map((dateItem) => format(dateItem, dateFormat));
      if (typeof value === 'object') {
        const formattedFrom = value.from ? format(value.from, dateFormat) : '';
        const formattedTo =  value.to ? format(value.to, dateFormat) : '';

        if (!formattedFrom && formattedTo) return '';

        return `${formattedFrom} - ${formattedTo}`;
      }

      return '';
    } catch (error) {
      setError((error as Error)?.message ?? 'Formatting error.');

      return '';
    }
  }, [value, placeholder, formatter]);

  const calculateOpenSite = (e: ReactMouseEvent<HTMLInputElement>): void => {
    if (openSite !== 'auto') return;

    setIsOpenOnTop(window.innerHeight - e.clientY <= BOTTOM_OFFSET);
  };

  const handleInputClick = (e: ReactMouseEvent<HTMLInputElement>) => {
    calculateOpenSite(e);
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleClose = () => {
    setIsActive(false);
  };

  const handleSelectDate = (date: PossibleDateType) => {
    setValue(date);

    onChange?.(date as any);

    if (closeOnSelect) handleClose();
  };

  useEffect(() => {
    const { current: wrapper } = wrapperRef;

    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!wrapper || wrapper.contains(event.target as Node)) return;

      handleClose();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return (): void => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={wrapperClassNames} ref={wrapperRef}>
      <Input
        type="text"
        disabled={disabled}
        label={label}
        scale={scale}
        error={errorMessage}
        value={formattedValue}
        placeholder={placeholder}
        onChange={() => {}}
        onClick={handleInputClick}
        onKeyDown={onKeyDown}
      />
      {isActive && (
        <DayPicker
          mode={selectionMode as any}
          selected={value}
          onSelect={handleSelectDate}
          defaultMonth={defaultMonth}
          weekStartsOn={1}
          fromYear={fromYear}
          toYear={toYear}
          fromDate={fromDate}
          toDate={toDate}
          className={calendarClassNames}
          {...navigationProps}
        />
      )}
    </div>
  );
};

export default DatePicker;
