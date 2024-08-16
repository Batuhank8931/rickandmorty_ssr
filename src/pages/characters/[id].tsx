import { GetServerSideProps } from "next";
import axios from "axios";
import { useRouter } from "next/router";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface CharacterDetailPageProps {
  character: Character;
}

const CharacterDetailPage = ({ character }: CharacterDetailPageProps) => {
  const router = useRouter();

  const handleLocationClick = async (url: string) => {
    try {
      if (!url || url.includes("null")) {
        alert("Location data not available.");
        return;
      }
      const locationId = url.split("/").pop();
      router.push(`/locations/${locationId}`);
    } catch (error) {
      alert("Error fetching location data.");
      console.error("Error fetching the location data:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <button
        className="absolute top-8 right-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-all duration-300"
        onClick={() => router.push("/")}
      >
        Home
      </button>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-md">
        <img
          src={character.image}
          alt={character.name}
          className="w-48 h-auto rounded-lg mb-6 border-4 border-gray-700 shadow-md"
        />
        <h1 className="text-4xl font-extrabold text-center mb-6">
          {character.name}
        </h1>
        <div className="text-center">
          <p className="text-lg">
            <strong>Status:</strong> {character.status}
          </p>
          <p className="text-lg mt-2">
            <strong>Species:</strong> {character.species}
          </p>
          <p className="text-lg mt-2">
            <strong>Gender:</strong> {character.gender}
          </p>
          <p className="text-lg mt-2">
            <strong>Origin:</strong>{" "}
            <span
              className="underline cursor-pointer hover:text-blue-400"
              onClick={() => handleLocationClick(character.origin.url)}
            >
              {character.origin.name}
            </span>
          </p>
          <p className="text-lg mt-2">
            <strong>Location:</strong>{" "}
            <span
              className="underline cursor-pointer hover:text-blue-400"
              onClick={() => handleLocationClick(character.location.url)}
            >
              {character.location.name}
            </span>
          </p>
          <p className="text-lg mt-2">
            <strong>Number of Episodes:</strong> {character.episode.length}
          </p>
          <p className="text-lg mt-2">
            <strong>Created on:</strong>{" "}
            {new Date(character.created).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const response = await axios.get<Character>(
      `https://rickandmortyapi.com/api/character/${id}`
    );

    return {
      props: {
        character: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching the character data:", error);

    return {
      notFound: true,
    };
  }
};

export default CharacterDetailPage;
