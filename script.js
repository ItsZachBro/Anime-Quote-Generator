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

async function fetchCharacterImage(animeCharacter) {
  const query = `
  query ($character: String) {
      Character (search: $character) {
          image {
              large
          }
      }
  }
  `;

  const variables = {
    character: animeCharacter
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
  return data.data.Character.image.large;
}

async function fetchRandomQuote() {
  let attempts = 0;
  const apiUrl = 'http://animechan.xyz/api/random';

  while (attempts < 10) {
    try {
      const timestamp = Date.now();
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}&timestamp=${timestamp}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const quoteData = JSON.parse(data.contents);
        const animeImageUrl = await fetchAnimeImage(quoteData.anime);
        const characterImageUrl = await fetchCharacterImage(quoteData.character);

        if (animeImageUrl && characterImageUrl) {
          document.body.style.backgroundImage = `url(${animeImageUrl})`;

          // Replace the heading with anime name
          document.querySelector('h1').innerText = quoteData.anime;

          // Remove previous second photo if it exists
          const previousSecondPhoto = document.querySelector('.second-photo');
          if (previousSecondPhoto) {
            previousSecondPhoto.parentNode.removeChild(previousSecondPhoto);
          }

          // Create a div element for the second photo
          const secondPhotoDiv = document.createElement('div');
          secondPhotoDiv.classList.add('second-photo');
          secondPhotoDiv.style.backgroundImage = `url(${characterImageUrl})`;
          document.body.appendChild(secondPhotoDiv);

          return `${quoteData.quote} - ${quoteData.character}`;
        }
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
    attempts++;
  }

  return 'Failed to fetch quote after 10 attempts.';
}

async function generateQuote() {
  const randomQuote = await fetchRandomQuote();
  document.getElementById('quote').innerText = randomQuote;
}

generateQuote();
