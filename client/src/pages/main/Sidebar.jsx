import React from 'react'
import { Box, Divider, Drawer, Typography, useMediaQuery, useTheme } from '@mui/material';
import {ChartBar} from "../../icons/chart-bar";
import {Users} from "../../icons/users";
import {NavItem} from "../../components/sidebar/Sidebar.item";

const items = [
    {
        href: '/',
        icon: (<ChartBar fontSize="small" />),
        title: 'Dashboard'
    },
    {
        href: '/customers',
        icon: (<Users fontSize="small"/>),
        title: 'Customers'
    },
];

export const DashboardSidebar = (props) => {
    let { open, onClose } = props;
    const theme = useTheme()
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'), { defaultMatches: true });

    const content = (
        <>
            <Box className={'font-sidebar'} expend
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: 'white',
                }}
            >
                <Divider
                    sx={{
                        borderColor: '#000000',
                        my: 3
                    }}
                />
                <Box className={"font-sidebar"} sx={{px: 3}}>
                    Dashboard
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {items.map((item) => (
                        <NavItem
                            key={item.title}
                            icon={item.icon}
                            href={item.href}
                            title={item.title}
                        />
                    ))}
                </Box>
                <Divider sx={{ borderColor: '#2D3748' }} />
            </Box>
        </>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: '#fff',
                        color: '#000',
                        width: 280
                    }
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    width: 280
                }
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};