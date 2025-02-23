import { useState } from 'react';
import { ResponsiveCard, ResponsiveCardContent } from '@/components/common/ResponsiveCard';
import { SearchBar } from '@/components/common/SearchBar';
import { PageContainer } from '@/components/common/PageContainer';
import { Button, Grid, Stack } from '@mui/material';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';

export const TestResponsive = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <PageContainer 
      title="Responsive Test" 
      action={
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Action</Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      }
    >
      <SearchBar value={searchValue} onChange={setSearchValue} />
      
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <ResponsiveCard>
              <ResponsiveCardContent>
                Card Content {item}
              </ResponsiveCardContent>
            </ResponsiveCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};