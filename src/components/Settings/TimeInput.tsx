/**
 * 時間入力コンポーネント
 */

interface TimeInputProps {
  readonly label: string;
  readonly value: number; // seconds
  readonly onChange: (seconds: number) => void;
  readonly showHours?: boolean;
  readonly min?: number;
  readonly max?: number;
}

export const TimeInput = ({
  label,
  value,
  onChange,
  showHours = false,
  min = 0,
  max = 35999, // 9:59:59
}: TimeInputProps) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const handleHoursChange = (h: number) => {
    const newValue = h * 3600 + minutes * 60 + seconds;
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const handleMinutesChange = (m: number) => {
    const newValue = hours * 3600 + m * 60 + seconds;
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const handleSecondsChange = (s: number) => {
    const newValue = hours * 3600 + minutes * 60 + s;
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const inputId = `time-input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <label className="setting-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        {showHours && (
          <>
            <input
              id={inputId}
              type="number"
              className="setting-input w-16 text-center"
              value={hours}
              onChange={(e) =>
                handleHoursChange(Number.parseInt(e.target.value) || 0)
              }
              min={0}
              max={9}
              aria-label={`${label} 時`}
            />
            <span className="text-color-dim text-sm">時</span>
          </>
        )}
        <input
          type="number"
          className="setting-input w-16 text-center"
          value={minutes}
          onChange={(e) =>
            handleMinutesChange(Number.parseInt(e.target.value) || 0)
          }
          min={0}
          max={59}
          aria-label={`${label} 分`}
        />
        <span className="text-color-dim text-sm">分</span>
        <input
          type="number"
          className="setting-input w-16 text-center"
          value={seconds}
          onChange={(e) =>
            handleSecondsChange(Number.parseInt(e.target.value) || 0)
          }
          min={0}
          max={59}
          aria-label={`${label} 秒`}
        />
        <span className="text-color-dim text-sm">秒</span>
      </div>
    </div>
  );
};
