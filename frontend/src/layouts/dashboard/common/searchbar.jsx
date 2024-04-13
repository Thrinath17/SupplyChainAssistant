import { useState } from 'react';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({
    color: theme.palette.background.default,
  }),
  zIndex: 99,
  display: 'flex',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {

  const [inputValue, setInputValue] = useState('');

  // Function to update the state variable as the user types in the input field
  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
   fetchResults(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  async function fetchResults(queryString) {
    // Assuming you have a Flask route set up to handle this POST request
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: queryString })
    });
    const data = await response.json();

    displayResults(data);
    // Clear the input field after fetching and displaying the results
  setInputValue('');
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  // Clear existing results
  resultsDiv.innerHTML = '';

  // Ensure 'data.answer' is an array and then iterate over it
  if (Array.isArray(data.answer)) {
      // Create a fragment to append all messages
      const fragment = document.createDocumentFragment();

      data.answer.forEach(message => {
          // Create paragraph for each message
          const p = document.createElement('p');
          p.textContent = `${message.role}: ${message.value}`;
          fragment.appendChild(p);
      });

      // Append all messages to the results div
      resultsDiv.appendChild(fragment);
  } else {
      console.error('Expected an array for data.answer, but did not find one.');
  }
}

  return (

      <div>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask me..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" onClick={handleSearchClick}>
              Search
            </Button>
          </StyledSearchbar>
      </div>
  );
}
