"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const menuItems = [
  { id: 1, title: 'Ana Sayfa', url: '/' },
  { id: 2, title: 'Yurt İçi Turlar', url: '/yurtici' },
  { id: 3, title: 'Yurt Dışı Turlar', url: '/yurtdisi' },
  { id: 4, title: 'Hakkımızda', url: '/hakkimizda' },
  { id: 5, title: 'İletişim', url: '/iletisim' },
];

const WHATSAPP_NUMBER = "905060461212";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const pathname = usePathname();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  // Aktif kontrolü için yardımcı fonksiyon
  const isActive = (url) => {
    return url === '/' ? pathname === '/' : pathname.startsWith(url);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        color: 'black', 
        width: '100%', 
        overflow: 'hidden',
        padding: '0 2rem',
        height: '70px',
      }}
    >
      <Toolbar 
        disableGutters 
        sx={{ 
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: '70px',
          paddingTop: '10px',
          display: 'grid',
          gridTemplateColumns: { xs: '120px 1fr auto', md: '200px 1fr 80px' },
          gap: '1rem',
        }}
      >
        {/* Sol: Logo */}
        <Link href="/" passHref>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '60px',
                maxWidth: '120px'
              }}
            />
          </Box>
        </Link>

        {/* Orta: Menü Öğeleri (Masaüstü) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              component={Link}
              href={item.url}
              sx={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textTransform: 'none',
                color: isActive(item.url) ? '#0056b3' : 'black',
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        {/* Sağ: WhatsApp/Hamburger */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          {/* Masaüstü WhatsApp */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <IconButton
              onClick={handleWhatsAppClick}
              aria-label="WhatsApp ile iletişime geç"
              sx={{
                color: '#25D366',
                '&:hover': {
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '32px'
                }
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Box>

          {/* Mobil WhatsApp ve Hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: '10px', alignItems: 'center' }}>
            <IconButton
              onClick={handleWhatsAppClick}
              aria-label="WhatsApp ile iletişime geç"
              sx={{
                color: '#25D366',
                '& .MuiSvgIcon-root': {
                  fontSize: '28px'
                }
              }}
            >
              <WhatsAppIcon />
            </IconButton>
            <IconButton 
              edge="end" 
              color="inherit" 
              aria-label="Ana menüyü aç"
              onClick={handleMenuOpen}
              sx={{ 
                color: 'black',
                '& .MuiSvgIcon-root': {
                  fontSize: '28px'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobil Menü */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ mt: '55px', ml: '-10px' }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.id} onClick={handleMenuClose}>
                <Link href={item.url} passHref>
                  <Button 
                    sx={{ 
                      color: isActive(item.url) ? '#0056b3' : 'black',
                      textTransform: 'none',
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '0.5rem 1rem'
                    }}
                  >
                    {item.title}
                  </Button>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
