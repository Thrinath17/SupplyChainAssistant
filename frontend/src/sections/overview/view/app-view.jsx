// import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Searchbar from 'src/layouts/dashboard/common/searchbar';

// import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl" sx={{ display: 'flex', 
    height: '100%', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    '& > :last-child': {
          width: '100%',
        }}}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      <div id="results">h</div>
      <Searchbar style={{ width: '100%' }}/>
    </Container>
  );
}
