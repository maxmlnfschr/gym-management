import { useState } from 'react';
import { ResponsiveCard, ResponsiveCardContent } from '@/components/common/ResponsiveCard';
import { SearchBar } from '@/components/common/SearchBar';
import { PageContainer } from '@/components/common/PageContainer';
import { Button, Grid } from '@mui/material';

export const TestResponsive = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <PageContainer title="Responsive Test" action={<Button variant="contained">Action</Button>}>
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