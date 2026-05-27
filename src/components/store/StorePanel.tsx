import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material'
import { STORE_ITEMS } from '../../storeItems'
import { metroListItemSx, metroTileSx } from '../../theme/metroStyles'

interface StorePanelProps {
  balance: number
  onBuy: (productId: string, title: string) => Promise<void>
}

const tileAccents = ['#0078D7', '#00ABA9', '#8764B8', '#FF8C00', '#107C10', '#E81123']

export function StorePanel({ balance, onBuy }: StorePanelProps) {
  return (
    <Box>
      <Box sx={{ ...metroTileSx('#0078D7'), mb: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          your balance
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 200 }}>
          ${balance.toLocaleString()}
        </Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
        exclusive items
      </Typography>

      <List disablePadding>
        {STORE_ITEMS.map((item, index) => {
          const canAfford = balance >= item.price
          const accent = tileAccents[index % tileAccents.length]

          return (
            <ListItem
              key={item.id}
              sx={{
                ...metroListItemSx,
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 4,
                    alignSelf: 'stretch',
                    minHeight: 48,
                    bgcolor: accent,
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  slotProps={{
                    primary: { variant: 'subtitle1', sx: { fontWeight: 400 } },
                    secondary: { variant: 'body2', sx: { color: 'text.secondary', mt: 0.5 } },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: accent }}>
                  ${item.price.toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!canAfford}
                  onClick={() => void onBuy(item.id, item.title)}
                  sx={{ bgcolor: canAfford ? accent : undefined }}
                >
                  {canAfford ? 'buy' : 'insufficient'}
                </Button>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
