import { createTheme, alpha } from '@mui/material/styles'
import { iosTabBarHeight, paperThemeColors } from './iosStyles'

/** iOS Human Interface Guidelines — dark mode, SF typography, grouped surfaces. */
export const iosTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: paperThemeColors.red,
      light: paperThemeColors.redBright,
      dark: '#930005',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: paperThemeColors.yellow,
      light: '#FFE08B',
      dark: '#6E5700',
      contrastText: paperThemeColors.ink,
    },
    success: {
      main: '#0079C1',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F1C100',
      contrastText: paperThemeColors.ink,
    },
    background: {
      default: paperThemeColors.cream,
      paper: paperThemeColors.paperElevated,
    },
    text: {
      primary: paperThemeColors.ink,
      secondary: '#5D3F3B',
      disabled: '#926F6A',
    },
    divider: alpha(paperThemeColors.ink, 0.22),
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Rubik", "Inter", "Helvetica Neue", Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h4: {
      fontFamily: '"Bricolage Grotesque", "Rubik", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 800,
      fontSize: '2.125rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: '"Bricolage Grotesque", "Rubik", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 800,
      fontSize: '1.375rem',
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: '"Bricolage Grotesque", "Rubik", "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
      fontSize: '1.0625rem',
      lineHeight: 1.3,
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1.0625rem',
      lineHeight: 1.35,
    },
    subtitle2: {
      fontWeight: 700,
      fontSize: '0.8125rem',
      lineHeight: 1.3,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
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
      fontWeight: 700,
      fontSize: '0.9375rem',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
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
          backgroundColor: paperThemeColors.cream,
          backgroundImage:
            'radial-gradient(rgba(28,27,27,0.045) 0.8px, transparent 0.8px), linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 40%)',
          backgroundSize: '8px 8px, auto',
          color: paperThemeColors.ink,
        },
        '::selection': {
          backgroundColor: paperThemeColors.red,
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
          minHeight: 52,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `3px solid ${paperThemeColors.ink}`,
          boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
          minHeight: 48,
          paddingInline: 20,
          fontWeight: 700,
          '&:hover': {
            boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
          },
          '&:active': {
            transform: 'translate(4px, 4px)',
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
          '&:hover': {
            boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
          },
        },
        outlined: {
          borderWidth: 3,
          borderColor: paperThemeColors.ink,
          backgroundColor: paperThemeColors.paperElevated,
          '&:hover': {
            borderWidth: 3,
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
          borderRadius: 12,
          border: `2px solid ${paperThemeColors.ink}`,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `3px solid ${paperThemeColors.ink}`,
          backgroundColor: paperThemeColors.paperElevated,
          boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          border: `3px solid ${paperThemeColors.ink}`,
          boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          border: `2px solid ${paperThemeColors.ink}`,
          height: 34,
          fontWeight: 700,
          fontSize: '0.9375rem',
          boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
        },
        filled: {
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
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
          minHeight: 38,
          minWidth: 0,
          padding: '6px 12px',
          borderRadius: 8,
          opacity: 1,
          color: paperThemeColors.ink,
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
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            border: `3px solid ${paperThemeColors.ink}`,
            boxShadow: 'inset 3px 3px 0 rgba(28,27,27,0.14)',
            '&:hover': {
              backgroundColor: '#FFFFFF',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
            },
            '&::before, &::after': {
              display: 'none',
            },
            '& .MuiFilledInput-input': {
              // Keep vertical space for the floating label in filled inputs.
              paddingTop: 24,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
            },
            '&.MuiInputBase-hiddenLabel > .MuiInputBase-input': {
              paddingTop: 12,
              paddingBottom: 12,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.9375rem',
            color: '#5D3F3B',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 6,
          marginLeft: 0,
          marginRight: 0,
          lineHeight: 1.3,
          position: 'static',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          minHeight: iosTabBarHeight,
          backgroundColor: 'transparent',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          maxWidth: 'none',
          flex: 1,
          color: '#926F6A',
          paddingTop: 8,
          paddingBottom: 6,
          '&.Mui-selected': {
            color: paperThemeColors.red,
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
          borderRadius: 16,
          backgroundColor: paperThemeColors.paperElevated,
          border: `3px solid ${paperThemeColors.ink}`,
          boxShadow: `8px 8px 0 ${paperThemeColors.ink}`,
          margin: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `3px solid ${paperThemeColors.ink}`,
          backgroundColor: '#FFE08B',
          color: paperThemeColors.ink,
          boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: `calc(${iosTabBarHeight}px + env(safe-area-inset-bottom, 0px) + 12px) !important`,
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
