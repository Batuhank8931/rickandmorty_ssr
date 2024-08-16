import { GetServerSideProps } from 'next';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

interface APIResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Location[];
}

interface LocationsPageProps {
  locations: Location[];
  pageInfo: APIResponse["info"];
  filters: {
    name: string;
    type: string;
    dimension: string;
  };
}

const LocationsPage = ({ locations, pageInfo, filters }: LocationsPageProps) => {
  const [currentFilters, setCurrentFilters] = useState(filters);
  const router = useRouter();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFilters({
      ...currentFilters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let filterQuery = "?";
    Object.keys(currentFilters).forEach((key) => {
      if (currentFilters[key as keyof typeof currentFilters]) {
        filterQuery += `${key}=${currentFilters[key as keyof typeof currentFilters]}&`;
      }
    });
    router.push({
      pathname: '/locations',
      query: { ...currentFilters, page: '1' },
    });
  };

  const handlePageChange = (url: string | null) => {
    if (url) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const nextPage = urlParams.get('page');
      router.push({
        pathname: '/locations',
        query: { ...currentFilters, page: nextPage },
      });
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/locations/${id}`);
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <button
        className="absolute top-8 right-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-all duration-300"
        onClick={() => router.push("/")}
      >
        Home
      </button>
      <h1 className="text-4xl font-bold mb-8">Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={currentFilters.name}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={currentFilters.type}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <input
          type="text"
          name="dimension"
          placeholder="Dimension"
          value={currentFilters.dimension}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <button
          onClick={applyFilters}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-300"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6 cursor-pointer hover:bg-gray-700 transition-all duration-300"
            onClick={() => handleCardClick(location.id)}
          >
            <h2 className="text-2xl font-bold mb-2">{location.name}</h2>
            <p className="text-sm text-gray-300">
              <strong>Type:</strong> {location.type}
            </p>
            <p className="text-sm text-gray-300">
              <strong>Dimension:</strong> {location.dimension}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Residents:</strong> {location.residents.length}{" "}
              resident(s)
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          className={`px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded ${
            !pageInfo?.prev
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 transition-all duration-300"
          }`}
          onClick={() => handlePageChange(pageInfo?.prev)}
          disabled={!pageInfo?.prev}
        >
          Previous
        </button>
        <button
          className={`px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded ${
            !pageInfo?.next
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 transition-all duration-300"
          }`}
          onClick={() => handlePageChange(pageInfo?.next)}
          disabled={!pageInfo?.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { name = '', type = '', dimension = '', page = '1' } = query;
  const filters = { name, type, dimension };

  let filterQuery = "&";
  Object.keys(filters).forEach((key) => {
    if (filters[key as keyof typeof filters]) {
      filterQuery += `${key}=${filters[key as keyof typeof filters]}&`;
    }
  });

  try {
    const response = await axios.get<APIResponse>(
      `https://rickandmortyapi.com/api/location?page=${page}${filterQuery}`
    );

    return {
      props: {
        locations: response.data.results,
        pageInfo: response.data.info,
        filters,
      },
    };
  } catch (error) {
    console.error("Error fetching the locations data:", error);
    return {
      props: {
        locations: [],
        pageInfo: null,
        filters: {
          name: "",
          type: "",
          dimension: "",
        },
      },
    };
  }
};

export default LocationsPage;
