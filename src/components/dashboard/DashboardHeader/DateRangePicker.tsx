import { useState, useCallback, useEffect, useRef } from 'react';
import { useFinance } from '@/contexts';
import { IconChevronLeft, IconChevronRight } from '@/components/icons/SidebarIcons';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export function DateRangePicker({ isOpen, onClose, isMobile, anchorRef }: DateRangePickerProps) {
  const { dateRange, setDateRange } = useFinance();
  const [tempStart, setTempStart] = useState<string | null>(null);
  const [tempEnd, setTempEnd] = useState<string | null>(null);
  const [step, setStep] = useState<'start' | 'end'>('start');
  const [leftMonth, setLeftMonth] = useState(() => {
    const [y, m] = dateRange.startDate.split('-').map(Number);
    return new Date(y, m - 1);
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const applyRange = useCallback(() => {
    if (tempStart && tempEnd) {
      const [s, e] = [tempStart, tempEnd].sort();
      setDateRange({ startDate: s, endDate: e });
    }
    onClose();
    setTempStart(null);
    setTempEnd(null);
    setStep('start');
  }, [tempStart, tempEnd, setDateRange, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setTempStart(dateRange.startDate);
    setTempEnd(dateRange.endDate);
    const [y, m] = dateRange.startDate.split('-').map(Number);
    setLeftMonth(new Date(y, m - 1));
  }, [isOpen, dateRange.startDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = anchorRef?.current;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchor &&
        !anchor.contains(e.target as Node)
      ) {
        applyRange();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, applyRange, anchorRef]);

  const shortcuts = [
    {
      label: 'Este mês',
      get: () => {
        const now = new Date();
        const start = getFirstDayOfMonth(now.getFullYear(), now.getMonth());
        const end = getLastDayOfMonth(now.getFullYear(), now.getMonth());
        return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
      },
    },
    {
      label: 'Mês passado',
      get: () => {
        const now = new Date();
        const start = getFirstDayOfMonth(now.getFullYear(), now.getMonth() - 1);
        const end = getLastDayOfMonth(now.getFullYear(), now.getMonth() - 1);
        return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
      },
    },
    {
      label: 'Últimos 3 meses',
      get: () => {
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 3);
        return { startDate: toYYYYMMDD(start), endDate: toYYYYMMDD(end) };
      },
    },
    {
      label: 'Este ano',
      get: () => {
        const now = new Date();
        return {
          startDate: toYYYYMMDD(new Date(now.getFullYear(), 0, 1)),
          endDate: toYYYYMMDD(now),
        };
      },
    },
  ];

  const handleDayClick = (dateStr: string) => {
    if (step === 'start') {
      setTempStart(dateStr);
      setTempEnd(dateStr);
      setStep('end');
    } else {
      const [a, b] = [tempStart!, dateStr].sort();
      setTempStart(a);
      setTempEnd(b);
      setStep('start');
    }
  };

  const renderCalendar = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const first = getFirstDayOfMonth(year, month);
    const last = getLastDayOfMonth(year, month);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    return (
      <div className="min-w-[240px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label-medium font-semibold text-secondary-darker">
            {MONTHS[month]} {year}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => (
            <span key={d} className="text-label-xsmall font-semibold text-secondary-normal">
              {d}
            </span>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />;
            const dateStr = toYYYYMMDD(new Date(year, month, d));
            const inRange =
              tempStart &&
              tempEnd &&
              dateStr >= tempStart &&
              dateStr <= tempEnd;
            const isStart = dateStr === tempStart;
            const isEnd = dateStr === tempEnd;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(dateStr)}
                className={`size-8 rounded-full text-label-small transition-colors ${
                  inRange
                    ? 'bg-neutral-900 text-neutral-0'
                    : 'text-secondary-darker hover:bg-neutral-300/50'
                } ${isStart || isEnd ? 'ring-2 ring-lime ring-offset-1' : ''}`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1);

  if (!isOpen) return null;

  const content = (
    <div
      ref={panelRef}
      className="flex flex-col gap-4 rounded-card border border-neutral-300 bg-surface-50 p-4 shadow-lg"
    >
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              const r = s.get();
              setDateRange(r);
              onClose();
            }}
            className="rounded-pill border border-neutral-300 bg-surface-50 px-3 py-1.5 text-label-small text-secondary-normal transition-colors hover:bg-neutral-300/30"
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {isMobile ? (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1))
              }
              className="rounded-full p-2 text-secondary-normal hover:bg-neutral-300/50"
            >
              <IconChevronLeft className="size-4" />
            </button>
            {renderCalendar(leftMonth)}
            <button
              type="button"
              onClick={() =>
                setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1))
              }
              className="rounded-full p-2 text-secondary-normal hover:bg-neutral-300/50"
            >
              <IconChevronRight className="size-4" />
            </button>
          </div>
        ) : (
          <>
            {renderCalendar(leftMonth)}
            {renderCalendar(rightMonth)}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={applyRange}
        className="rounded-pill bg-neutral-900 px-4 py-2 text-label-medium font-semibold text-neutral-0"
      >
        OK
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          role="presentation"
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-secondary-darker/50"
        />
        <div
          className="fixed inset-x-4 bottom-0 z-50 rounded-t-card border border-neutral-300 bg-surface-50 p-4 pb-8"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {content}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <div className="relative z-50">{content}</div>
    </>
  );
}
