import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface APIEndpoints {
  characters: string;
  locations: string;
  episodes: string;
}

const HomePage = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoints | null>(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const response = await axios.get("https://rickandmortyapi.com/api");
        setEndpoints(response.data);
      } catch (error) {
        console.error("Error fetching the API endpoints:", error);
      }
    };

    fetchEndpoints();
  }, []);

  if (!endpoints) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-20">Rick and Morty API</h1>
      <div className="flex space-x-10">
        <button
          className="w-80 py-8 bg-blue-600 text-2xl font-semibold text-white rounded-xl hover:bg-blue-800 transform hover:scale-110 transition-all duration-300"
          onClick={() => router.push("/characters")} // Use router.push
        >
          Characters
        </button>

        <button
          className="w-80 py-8 bg-green-600 text-2xl font-semibold text-white rounded-xl hover:bg-green-800 transform hover:scale-110 transition-all duration-300"
          onClick={() => router.push("/locations")} // Use router.push
        >
          Locations
        </button>

        <button
          className="w-80 py-8 bg-purple-600 text-2xl font-semibold text-white rounded-xl hover:bg-purple-800 transform hover:scale-110 transition-all duration-300"
          onClick={() => router.push("/episodes")} // Use router.push
        >
          Episodes
        </button>
      </div>
    </div>
  );
};

export default HomePage;
