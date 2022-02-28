import React from 'react'
import { Box, Button, Icon, ListItem } from '@mui/material';

export const NavItem = (props) => {
    const { href, icon, title, ...others } = props;
    const active = false;

    return (
        <ListItem>
            <Button startIcon={icon}
                sx={{
                    backgroundColor: active && '#4285F4',
                    borderRadius: 1,
                    color: active ? '#fff' : '#000',
                    fontWeight: active && 'fontWeightBold',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    px: 3,
                    width: '100%',
                    '& .MuiButton-startIcon': {
                        color: active ? '#fff' : 'neutral.900'
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.2)'
                    }
                }}
            >
                <Box className={"font-sidebar"}>
                    {title}
                </Box>
            </Button>
        </ListItem>
    );
};
