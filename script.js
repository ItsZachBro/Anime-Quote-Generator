async function fetchAnimeImage(animeTitle) {
  const query = `
  query ($title: String) {
      Media (search: $title, type: ANIME) {
          coverImage {
              extraLarge
          }
      }
  }
  `;

  const variables = {
      title: animeTitle
  };

  const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
      body: JSON.stringify({
          query: query,
          variables: variables
      })
  });

  const data = await response.json();
  return data.data.Media.coverImage.extraLarge;
}



async function fetchRandomQuote() {
  let attempts = 0;
  while (attempts < 10) { 
      try {
          const response = await fetch('http://animechan.melosh.space/random');
          const quoteData = await response.json();
          const imageUrl = await fetchAnimeImage(quoteData.anime);
          if (imageUrl) {  // Check if imageUrl is valid
              document.body.style.backgroundImage = `url(${imageUrl})`;
              return `${quoteData.quote} - ${quoteData.character}`;
          }
      } catch (error) {
          console.error('Error fetching quote:', error);
      }
      attempts++; // Increment the attempts counter
  }
  return 'Failed to fetch quote after 10 attempts.';
}

async function generateQuote() {
const randomQuote = await fetchRandomQuote();
document.getElementById('quote').innerText = randomQuote;
}

generateQuote();

