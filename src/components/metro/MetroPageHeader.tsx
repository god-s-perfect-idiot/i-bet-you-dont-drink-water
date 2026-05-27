import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { metroPageTitleSx } from "../../theme/metroStyles";

interface MetroPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function MetroPageHeader({ title, subtitle, action }: MetroPageHeaderProps) {
  return (
    <Box sx={{ mb: 2, pt: 1 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Typography component="h1" sx={metroPageTitleSx}>
          {title}
        </Typography>
        {action}
      </Box>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
