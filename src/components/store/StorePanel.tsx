import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material'
import { STORE_ITEMS } from '../../storeItems'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosListCellSx } from '../../theme/iosStyles'

interface StorePanelProps {
  balance: number
  onBuy: (productId: string, title: string) => Promise<void>
}

const tileAccents = ['#0A84FF', '#30D158', '#5E5CE6', '#FF9F0A', '#64D2FF', '#FF453A']

export function StorePanel({ balance, onBuy }: StorePanelProps) {
  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
          borderRadius: '12px',
          color: '#FFFFFF',
          p: 2.5,
          mb: 2.5,
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}>
          Your Balance
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          ${balance.toLocaleString()}
        </Typography>
      </Box>

      <IOSGroupedSection title="Exclusive Items">
        <List disablePadding>
          {STORE_ITEMS.map((item, index) => {
            const canAfford = balance >= item.price
            const accent = tileAccents[index % tileAccents.length]

            return (
              <ListItem
                key={item.id}
                sx={{
                  ...iosListCellSx,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 1.5,
                }}
              >
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  slotProps={{
                    primary: { variant: 'body1', sx: { fontWeight: 500 } },
                    secondary: { variant: 'caption', sx: { color: 'text.secondary', mt: 0.5 } },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: accent, fontWeight: 600 }}>
                    ${item.price.toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!canAfford}
                    onClick={() => void onBuy(item.id, item.title)}
                    sx={{ bgcolor: canAfford ? accent : undefined, minWidth: 88 }}
                  >
                    {canAfford ? 'Buy' : 'Insufficient'}
                  </Button>
                </Box>
              </ListItem>
            )
          })}
        </List>
      </IOSGroupedSection>
    </Box>
  )
}
