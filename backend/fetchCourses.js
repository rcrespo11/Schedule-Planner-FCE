

const fetchCourses = async () => {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch('http://localhost:5000/courses');
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


