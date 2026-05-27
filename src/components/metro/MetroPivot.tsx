import { Paper, Tab, Tabs } from "@mui/material";

interface MetroPivotProps {
  value: number;
  labels: string[];
  onChange: (index: number) => void;
  "aria-label"?: string;
}

export function MetroPivot({ value, labels, onChange, "aria-label": ariaLabel }: MetroPivotProps) {
  return (
    <Paper square sx={{ mb: 2, bgcolor: "background.default" }}>
      <Tabs
        value={value}
        onChange={(_, next) => onChange(next)}
        variant="fullWidth"
        aria-label={ariaLabel}
      >
        {labels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
    </Paper>
  );
}
