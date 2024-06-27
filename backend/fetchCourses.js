

const fetchCourses = async () => {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch('https://squid-app-57j93.ondigitalocean.app/:5000/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Data from backend:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  fetchCourses();


