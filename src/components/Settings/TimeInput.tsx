interface TimeInputProps {
  label: string;
  value: number; // seconds
  onChange: (seconds: number) => void;
  showHours?: boolean;
  min?: number;
  max?: number;
}

export function TimeInput({
  label,
  value,
  onChange,
  showHours = false,
  min = 0,
  max = 35999, // 9:59:59
}: TimeInputProps) {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const handleHoursChange = (h: number) => {
    onChange(Math.min(max, Math.max(min, h * 3600 + minutes * 60 + seconds)));
  };

  const handleMinutesChange = (m: number) => {
    onChange(Math.min(max, Math.max(min, hours * 3600 + m * 60 + seconds)));
  };

  const handleSecondsChange = (s: number) => {
    onChange(Math.min(max, Math.max(min, hours * 3600 + minutes * 60 + s)));
  };

  return (
    <div>
      <label className="setting-label">{label}</label>
      <div className="flex items-center gap-1">
        {showHours && (
          <>
            <input
              type="number"
              className="setting-input w-16 text-center"
              value={hours}
              onChange={(e) => handleHoursChange(parseInt(e.target.value) || 0)}
              min={0}
              max={9}
            />
            <span className="text-color-dim text-sm">時</span>
          </>
        )}
        <input
          type="number"
          className="setting-input w-16 text-center"
          value={minutes}
          onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
          min={0}
          max={59}
        />
        <span className="text-color-dim text-sm">分</span>
        <input
          type="number"
          className="setting-input w-16 text-center"
          value={seconds}
          onChange={(e) => handleSecondsChange(parseInt(e.target.value) || 0)}
          min={0}
          max={59}
        />
        <span className="text-color-dim text-sm">秒</span>
      </div>
    </div>
  );
}
