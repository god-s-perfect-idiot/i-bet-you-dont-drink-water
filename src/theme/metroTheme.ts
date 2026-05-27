import { createTheme } from "@mui/material/styles";

/** Windows Phone 8.1 Metro — flat, Segoe, accent blue, zero elevation. */
export const metroTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0078D7",
      light: "#4FA3E8",
      dark: "#005A9E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00ABA9",
      light: "#4DC4C2",
      dark: "#008A88",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#107C10",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E81123",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFB900",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "#1F1F1F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#999999",
      disabled: "#666666",
    },
    divider: "#333333",
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily:
      '"Segoe UI", "Segoe UI Variable", "Segoe WP", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h4: {
      fontWeight: 200,
      fontSize: "3.5rem",
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 300,
      fontSize: "2.125rem",
      lineHeight: 1.15,
    },
    h6: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: 1.3,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "0.9375rem",
      lineHeight: 1.35,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
    body1: {
      fontWeight: 400,
      fontSize: "0.9375rem",
      lineHeight: 1.45,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 400,
      fontSize: "0.9375rem",
      textTransform: "none",
      letterSpacing: 0,
    },
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem",
      letterSpacing: "0.02em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
        },
        "::selection": {
          backgroundColor: "#0078D7",
          color: "#FFFFFF",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "default",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          backgroundImage: "none",
          borderBottom: "1px solid #333333",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          minHeight: 40,
          paddingInline: 16,
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
        text: {
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },
    MuiFab: {
      defaultProps: {
        disableFocusRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          minHeight: 48,
          height: 48,
          "&:hover": {
            boxShadow: "none",
          },
        },
        extended: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: 36,
          fontWeight: 400,
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          backgroundColor: "#000000",
        },
        indicator: {
          height: 4,
          backgroundColor: "#0078D7",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
          fontSize: "0.9375rem",
          minHeight: 48,
          opacity: 0.55,
          "&.Mui-selected": {
            opacity: 1,
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
      styleOverrides: {
        root: {
          "& .MuiInput-underline:before": {
            borderBottomColor: "#333333",
          },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: "#666666",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#0078D7",
            borderBottomWidth: 2,
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.875rem",
            color: "#999999",
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 56,
          backgroundColor: "#000000",
          borderTop: "1px solid #333333",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 48,
          maxWidth: 120,
          color: "#666666",
          paddingTop: 6,
          paddingBottom: 6,
          "&.Mui-selected": {
            color: "#0078D7",
          },
        },
        label: {
          fontSize: "0.625rem",
          fontWeight: 400,
          letterSpacing: "0.02em",
          "&.Mui-selected": {
            fontSize: "0.625rem",
            fontWeight: 600,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#333333",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          backgroundColor: "#1F1F1F",
          boxShadow: "none",
          border: "1px solid #333333",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "none",
          borderLeft: "4px solid #0078D7",
          backgroundColor: "#1F1F1F",
          color: "#FFFFFF",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
    },
  },
});
