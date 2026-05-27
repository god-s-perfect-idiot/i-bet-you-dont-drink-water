import { createTheme, alpha } from '@mui/material/styles'

/** iOS Human Interface Guidelines — dark mode, SF typography, grouped surfaces. */
export const iosTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A84FF',
      light: '#409CFF',
      dark: '#0066CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5E5CE6',
      light: '#7D7AFF',
      dark: '#3634A3',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#30D158',
      contrastText: '#000000',
    },
    error: {
      main: '#FF453A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD60A',
      contrastText: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#1C1C1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      disabled: '#636366',
    },
    divider: alpha('#545456', 0.65),
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.375rem',
      lineHeight: 1.25,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.0625rem',
      lineHeight: 1.3,
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1.0625rem',
      lineHeight: 1.35,
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: '0.8125rem',
      lineHeight: 1.3,
      textTransform: 'none',
      letterSpacing: 0,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1.0625rem',
      lineHeight: 1.4,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.9375rem',
      lineHeight: 1.35,
    },
    button: {
      fontWeight: 600,
      fontSize: '1.0625rem',
      textTransform: 'none',
      letterSpacing: 0,
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.8125rem',
      letterSpacing: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          WebkitOverflowScrolling: 'touch',
        },
        '::selection': {
          backgroundColor: '#0A84FF',
          color: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          minHeight: 50,
          paddingInline: 20,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: 1,
          borderColor: alpha('#545456', 0.65),
          '&:hover': {
            borderWidth: 1,
          },
        },
        sizeSmall: {
          minHeight: 34,
          borderRadius: 8,
          fontSize: '0.9375rem',
          paddingInline: 14,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          backgroundColor: '#1C1C1E',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 34,
          fontWeight: 500,
          fontSize: '0.9375rem',
        },
        filled: {
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 32,
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          minHeight: 32,
          minWidth: 0,
          padding: '6px 12px',
          borderRadius: 8,
          opacity: 1,
          color: '#FFFFFF',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            borderRadius: 10,
            backgroundColor: '#2C2C2E',
            '&:hover': {
              backgroundColor: '#3A3A3C',
            },
            '&.Mui-focused': {
              backgroundColor: '#2C2C2E',
            },
            '&::before, &::after': {
              display: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.9375rem',
            color: '#8E8E93',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 49,
          backgroundColor: 'transparent',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          maxWidth: 'none',
          flex: 1,
          color: '#8E8E93',
          paddingTop: 4,
          paddingBottom: 2,
          '&.Mui-selected': {
            color: '#0A84FF',
          },
        },
        label: {
          fontSize: '0.625rem',
          fontWeight: 500,
          '&.Mui-selected': {
            fontSize: '0.625rem',
            fontWeight: 500,
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
          borderColor: alpha('#545456', 0.65),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          backgroundColor: '#1C1C1E',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          margin: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: 'calc(49px + env(safe-area-inset-bottom, 0px) + 12px) !important',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
  },
})
