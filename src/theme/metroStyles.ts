import type { SxProps, Theme } from "@mui/material/styles";

export const sectionStackSx: SxProps<Theme> = {
  position: "relative",
  zIndex: 1,
};

/** Large Segoe Light page title (hub / panorama style). */
export const metroPageTitleSx: SxProps<Theme> = {
  fontWeight: 200,
  fontSize: { xs: "2.75rem", sm: "3.5rem" },
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  mb: 0.5,
};

/** Section label above list groups. */
export const metroSectionLabelSx: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  mb: 1,
  mt: 2,
};

/** Full-width Metro list row. */
export const metroListItemSx: SxProps<Theme> = {
  py: 2,
  px: 0,
  alignItems: "flex-start",
  borderBottom: "1px solid",
  borderColor: "divider",
  "&:last-child": {
    borderBottom: "none",
  },
};

/** Accent-filled hub tile. */
export const metroTileSx = (accent: string): SxProps<Theme> => ({
  bgcolor: accent,
  color: "#FFFFFF",
  p: 2,
  minHeight: 88,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  cursor: "pointer",
  transition: "opacity 0.12s ease",
  "&:active": {
    opacity: 0.85,
  },
});

/** Fixed bottom offset above Metro app bar. */
export const metroBottomInset = "calc(56px + env(safe-area-inset-bottom, 0px))";
